import { roundTo } from './formatters';

/**
 * Standard Reducing Balance EMI Calculation:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEMI(principal: number, annualRate: number, tenureYears: number) {
  const P = Math.max(0, principal);
  const r = annualRate > 0 ? annualRate / 12 / 100 : 0;
  const n = Math.max(1, Math.round(tenureYears * 12));

  if (P === 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, n };
  }

  if (r === 0) {
    const emi = P / n;
    return {
      emi: roundTo(emi, 0),
      totalInterest: 0,
      totalPayment: roundTo(P, 0),
      n,
    };
  }

  const factor = Math.pow(1 + r, n);
  const emi = (P * r * factor) / (factor - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return {
    emi: roundTo(emi, 0),
    totalInterest: roundTo(totalInterest, 0),
    totalPayment: roundTo(totalPayment, 0),
    n,
  };
}

/**
 * Generate yearly amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureYears: number
) {
  const P = Math.max(0, principal);
  const r = annualRate > 0 ? annualRate / 12 / 100 : 0;
  const totalMonths = Math.max(1, Math.round(tenureYears * 12));
  const { emi } = calculateEMI(P, annualRate, tenureYears);

  let currentBalance = P;
  const yearlySchedule: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    totalPaid: number;
    balance: number;
  }[] = [];

  let accumulatedPrincipalThisYear = 0;
  let accumulatedInterestThisYear = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interestForMonth = currentBalance * r;
    const principalForMonth = Math.min(currentBalance, emi - interestForMonth);
    currentBalance = Math.max(0, currentBalance - principalForMonth);

    accumulatedPrincipalThisYear += principalForMonth;
    accumulatedInterestThisYear += interestForMonth;

    if (m % 12 === 0 || m === totalMonths) {
      const yearNum = Math.ceil(m / 12);
      yearlySchedule.push({
        year: yearNum,
        principalPaid: roundTo(accumulatedPrincipalThisYear, 0),
        interestPaid: roundTo(accumulatedInterestThisYear, 0),
        totalPaid: roundTo(accumulatedPrincipalThisYear + accumulatedInterestThisYear, 0),
        balance: roundTo(currentBalance, 0),
      });
      accumulatedPrincipalThisYear = 0;
      accumulatedInterestThisYear = 0;
    }
  }

  return yearlySchedule;
}

/**
 * Systematic Investment Plan (SIP) Future Value:
 * FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 */
export function calculateSIP(monthlyInvestment: number, annualReturnRate: number, tenureYears: number) {
  const P = Math.max(0, monthlyInvestment);
  const i = annualReturnRate > 0 ? annualReturnRate / 12 / 100 : 0;
  const n = Math.max(1, Math.round(tenureYears * 12));
  const totalInvested = P * n;

  if (P === 0) {
    return { totalInvested: 0, totalGains: 0, maturityValue: 0, yearlyGrowth: [] };
  }

  let maturityValue = 0;
  if (i === 0) {
    maturityValue = totalInvested;
  } else {
    maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }

  const totalGains = Math.max(0, maturityValue - totalInvested);

  // Yearly growth series
  const yearlyGrowth = [];
  for (let y = 1; y <= tenureYears; y++) {
    const months = y * 12;
    const invested = P * months;
    const val = i === 0 ? invested : P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    yearlyGrowth.push({
      year: y,
      invested: roundTo(invested, 0),
      returns: roundTo(Math.max(0, val - invested), 0),
      totalValue: roundTo(val, 0),
    });
  }

  return {
    totalInvested: roundTo(totalInvested, 0),
    totalGains: roundTo(totalGains, 0),
    maturityValue: roundTo(maturityValue, 0),
    yearlyGrowth,
  };
}

/**
 * Step-Up SIP (Investment increases by X% every year)
 */
export function calculateStepUpSIP(
  initialMonthly: number,
  annualStepUpPercent: number,
  annualReturnRate: number,
  tenureYears: number
) {
  const i = annualReturnRate > 0 ? annualReturnRate / 12 / 100 : 0;
  const stepUpFactor = 1 + (annualStepUpPercent || 0) / 100;
  
  let currentMonthly = initialMonthly;
  let runningCorpus = 0;
  let totalInvested = 0;
  const yearlyGrowth = [];

  for (let y = 1; y <= tenureYears; y++) {
    let investedThisYear = 0;
    for (let m = 1; m <= 12; m++) {
      totalInvested += currentMonthly;
      investedThisYear += currentMonthly;
      runningCorpus = (runningCorpus + currentMonthly) * (1 + i);
    }
    yearlyGrowth.push({
      year: y,
      monthlyDeposit: roundTo(currentMonthly, 0),
      invested: roundTo(totalInvested, 0),
      returns: roundTo(Math.max(0, runningCorpus - totalInvested), 0),
      totalValue: roundTo(runningCorpus, 0),
    });
    currentMonthly *= stepUpFactor;
  }

  return {
    totalInvested: roundTo(totalInvested, 0),
    totalGains: roundTo(Math.max(0, runningCorpus - totalInvested), 0),
    maturityValue: roundTo(runningCorpus, 0),
    yearlyGrowth,
  };
}

/**
 * Lumpsum / Compound Interest:
 * A = P * (1 + r/n)^(n*t)
 */
export function calculateLumpsum(
  principal: number,
  annualRate: number,
  tenureYears: number,
  compoundFrequency: number = 1 // 1=annual, 4=quarterly, 12=monthly
) {
  const P = Math.max(0, principal);
  const r = annualRate > 0 ? annualRate / 100 : 0;
  const n = Math.max(1, compoundFrequency);
  const t = Math.max(0, tenureYears);

  const maturityValue = P * Math.pow(1 + r / n, n * t);
  const totalGains = Math.max(0, maturityValue - P);

  const yearlyGrowth = [];
  for (let y = 1; y <= tenureYears; y++) {
    const val = P * Math.pow(1 + r / n, n * y);
    yearlyGrowth.push({
      year: y,
      invested: P,
      returns: roundTo(Math.max(0, val - P), 0),
      totalValue: roundTo(val, 0),
    });
  }

  return {
    totalInvested: roundTo(P, 0),
    totalGains: roundTo(totalGains, 0),
    maturityValue: roundTo(maturityValue, 0),
    yearlyGrowth,
  };
}

/**
 * CAGR Calculation: ((End / Start)^(1 / years) - 1) * 100
 */
export function calculateCAGR(startValue: number, endValue: number, years: number) {
  if (startValue <= 0 || endValue <= 0 || years <= 0) {
    return { cagr: 0, absoluteReturn: 0 };
  }
  const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  const absoluteReturn = ((endValue - startValue) / startValue) * 100;
  return {
    cagr: roundTo(cagr, 2),
    absoluteReturn: roundTo(absoluteReturn, 2),
  };
}

/**
 * Systematic Withdrawal Plan (SWP)
 */
export function calculateSWP(
  initialCorpus: number,
  monthlyWithdrawal: number,
  annualReturnRate: number,
  tenureYears: number
) {
  const r = annualReturnRate > 0 ? annualReturnRate / 12 / 100 : 0;
  const totalMonths = tenureYears * 12;

  let balance = initialCorpus;
  let totalWithdrawn = 0;
  const yearlyBreakdown = [];

  for (let m = 1; m <= totalMonths; m++) {
    // Interest earned on balance
    const interest = balance * r;
    balance = balance + interest;
    
    // Withdraw
    const actualWithdrawal = Math.min(balance, monthlyWithdrawal);
    balance = Math.max(0, balance - actualWithdrawal);
    totalWithdrawn += actualWithdrawal;

    if (m % 12 === 0 || m === totalMonths) {
      yearlyBreakdown.push({
        year: Math.ceil(m / 12),
        totalWithdrawn: roundTo(totalWithdrawn, 0),
        remainingBalance: roundTo(balance, 0),
      });
    }

    if (balance <= 0) break;
  }

  return {
    initialCorpus: roundTo(initialCorpus, 0),
    totalWithdrawn: roundTo(totalWithdrawn, 0),
    remainingCorpus: roundTo(balance, 0),
    totalValueCreated: roundTo(totalWithdrawn + balance, 0),
    yearlyBreakdown,
  };
}

/**
 * Public Provident Fund (PPF) - 15 Years official rules
 * Current benchmark government rate: 7.1% compounded annually
 * Annual max deposit: ₹1,50,000
 */
export function calculatePPF(yearlyDeposit: number, annualRate: number = 7.1, tenureYears: number = 15) {
  const deposit = Math.min(150000, Math.max(500, yearlyDeposit));
  const r = annualRate / 100;
  const years = Math.max(15, tenureYears);

  let balance = 0;
  let totalInvested = 0;
  const yearlySchedule = [];

  for (let y = 1; y <= years; y++) {
    totalInvested += deposit;
    // Interest is calculated on balance + deposit for the full financial year
    const interestThisYear = (balance + deposit) * r;
    balance = balance + deposit + interestThisYear;

    yearlySchedule.push({
      year: y,
      invested: roundTo(totalInvested, 0),
      interestEarned: roundTo(interestThisYear, 0),
      balance: roundTo(balance, 0),
    });
  }

  return {
    totalInvested: roundTo(totalInvested, 0),
    totalInterest: roundTo(balance - totalInvested, 0),
    maturityAmount: roundTo(balance, 0),
    yearlySchedule,
  };
}

/**
 * Income Tax (India) Calculator: Year-Aware Engine (FY 2026-27 & AY 2027-28)
 * Configurable slabs for New Regime & Old Regime
 */
export interface TaxInputs {
  grossSalary: number;
  regime: 'new' | 'old';
  taxYear?: string;
  section80C?: number; // Old regime max 1.5L
  section80D?: number; // Health insurance
  hraExemption?: number;
  homeLoanInterest?: number; // Section 24b up to 2L
  otherDeductions?: number;
}

export function calculateIncomeTax(inputs: TaxInputs) {
  const gross = Math.max(0, inputs.grossSalary);
  const regime = inputs.regime;
  const year = inputs.taxYear || 'FY 2026-27';

  let standardDeduction = 0;
  let totalDeductions = 0;
  let taxableIncome = gross;
  let taxBeforeCess = 0;
  let rebate87A = 0;

  if (regime === 'new') {
    // New Tax Regime (Budget 2024-2025 onwards / FY 2025-26 & FY 2026-27)
    // Standard deduction increased to ₹75,000 for salaried employees
    standardDeduction = Math.min(gross, 75000);
    totalDeductions = standardDeduction;
    taxableIncome = Math.max(0, gross - totalDeductions);

    // Slabs:
    // 0 - 3,00,000: Nil
    // 3,00,001 - 7,00,000: 5%
    // 7,00,001 - 10,00,000: 10%
    // 10,00,001 - 12,00,000: 15%
    // 12,00,001 - 15,00,000: 20%
    // Above 15,00,000: 30%
    if (taxableIncome > 1500000) {
      taxBeforeCess += (taxableIncome - 1500000) * 0.3;
      taxBeforeCess += 300000 * 0.2; // 12-15L
      taxBeforeCess += 200000 * 0.15; // 10-12L
      taxBeforeCess += 300000 * 0.1; // 7-10L
      taxBeforeCess += 400000 * 0.05; // 3-7L
    } else if (taxableIncome > 1200000) {
      taxBeforeCess += (taxableIncome - 1200000) * 0.2;
      taxBeforeCess += 200000 * 0.15;
      taxBeforeCess += 300000 * 0.1;
      taxBeforeCess += 400000 * 0.05;
    } else if (taxableIncome > 1000000) {
      taxBeforeCess += (taxableIncome - 1000000) * 0.15;
      taxBeforeCess += 300000 * 0.1;
      taxBeforeCess += 400000 * 0.05;
    } else if (taxableIncome > 700000) {
      taxBeforeCess += (taxableIncome - 700000) * 0.1;
      taxBeforeCess += 400000 * 0.05;
    } else if (taxableIncome > 300000) {
      taxBeforeCess += (taxableIncome - 300000) * 0.05;
    }

    // Rebate u/s 87A: In New Regime, taxable income up to ₹7,00,000 gets full rebate (tax = 0)
    // Plus standard deduction ₹75,000, income up to ₹7,75,000 is effectively tax-free!
    if (taxableIncome <= 700000) {
      rebate87A = taxBeforeCess;
      taxBeforeCess = 0;
    }
  } else {
    // Old Tax Regime
    standardDeduction = Math.min(gross, 50000);
    const sec80C = Math.min(150000, inputs.section80C || 0);
    const sec80D = Math.min(100000, inputs.section80D || 0);
    const hra = inputs.hraExemption || 0;
    const homeLoan = Math.min(200000, inputs.homeLoanInterest || 0);
    const other = inputs.otherDeductions || 0;

    totalDeductions = standardDeduction + sec80C + sec80D + hra + homeLoan + other;
    taxableIncome = Math.max(0, gross - totalDeductions);

    // Old Slabs:
    // 0 - 2,50,000: Nil
    // 2,50,001 - 5,00,000: 5%
    // 5,00,001 - 10,00,000: 20%
    // Above 10,00,000: 30%
    if (taxableIncome > 1000000) {
      taxBeforeCess += (taxableIncome - 1000000) * 0.3;
      taxBeforeCess += 500000 * 0.2;
      taxBeforeCess += 250000 * 0.05;
    } else if (taxableIncome > 500000) {
      taxBeforeCess += (taxableIncome - 500000) * 0.2;
      taxBeforeCess += 250000 * 0.05;
    } else if (taxableIncome > 250000) {
      taxBeforeCess += (taxableIncome - 250000) * 0.05;
    }

    // 87A rebate in Old Regime: Taxable income up to ₹5,00,000 gets up to ₹12,500 rebate
    if (taxableIncome <= 500000) {
      rebate87A = Math.min(12500, taxBeforeCess);
      taxBeforeCess = Math.max(0, taxBeforeCess - rebate87A);
    }
  }

  // Health and Education Cess @ 4%
  const cess = taxBeforeCess * 0.04;
  const totalTax = taxBeforeCess + cess;
  const effectiveTaxRate = gross > 0 ? (totalTax / gross) * 100 : 0;
  const netTakeHome = Math.max(0, gross - totalTax);

  return {
    taxYear: year,
    regime,
    grossSalary: roundTo(gross, 0),
    standardDeduction: roundTo(standardDeduction, 0),
    totalDeductions: roundTo(totalDeductions, 0),
    taxableIncome: roundTo(taxableIncome, 0),
    taxBeforeCess: roundTo(taxBeforeCess, 0),
    rebate87A: roundTo(rebate87A, 0),
    cess: roundTo(cess, 0),
    totalTax: roundTo(totalTax, 0),
    monthlyTax: roundTo(totalTax / 12, 0),
    effectiveTaxRate: roundTo(effectiveTaxRate, 2),
    netTakeHome: roundTo(netTakeHome, 0),
  };
}

/**
 * GST Calculator (Configurable rate: 5%, 12%, 18%, 28% or custom)
 */
export function calculateGST(
  amount: number,
  ratePercent: number,
  isInclusive: boolean = false,
  isInterstate: boolean = false
) {
  const base = Math.max(0, amount);
  const r = Math.max(0, ratePercent);

  let netAmount = 0;
  let gstAmount = 0;
  let grossAmount = 0;

  if (isInclusive) {
    grossAmount = base;
    netAmount = base / (1 + r / 100);
    gstAmount = grossAmount - netAmount;
  } else {
    netAmount = base;
    gstAmount = (base * r) / 100;
    grossAmount = netAmount + gstAmount;
  }

  const cgst = isInterstate ? 0 : gstAmount / 2;
  const sgst = isInterstate ? 0 : gstAmount / 2;
  const igst = isInterstate ? gstAmount : 0;

  return {
    netAmount: roundTo(netAmount, 2),
    gstAmount: roundTo(gstAmount, 2),
    grossAmount: roundTo(grossAmount, 2),
    cgst: roundTo(cgst, 2),
    sgst: roundTo(sgst, 2),
    igst: roundTo(igst, 2),
    ratePercent: r,
  };
}

/**
 * Salary CTC to In-Hand Breakdown
 */
export function calculateSalaryCTC(annualCTC: number, taxRegime: 'new' | 'old' = 'new') {
  const ctc = Math.max(0, annualCTC);
  // Standard corporate structure:
  // Basic Salary ~ 40% of CTC
  const annualBasic = ctc * 0.4;
  const monthlyBasic = annualBasic / 12;

  // HRA ~ 50% of Basic
  const annualHRA = annualBasic * 0.5;

  // Employee Provident Fund (EPF): 12% of Basic (statutory cap on ₹15k basic or actual)
  // Standard corporate practice uses 12% of actual basic or min cap
  const annualEPFEmployee = annualBasic * 0.12;
  const monthlyEPF = annualEPFEmployee / 12;

  // Employer EPF: 12% of Basic (part of CTC)
  const annualEPFEmployer = annualEPFEmployee;

  // Gratuity: ~4.81% of Basic (part of CTC)
  const annualGratuity = annualBasic * (15 / 26 / 12);

  // Special Allowance / Other: Remainder of CTC
  const annualSpecialAllowance = Math.max(
    0,
    ctc - (annualBasic + annualHRA + annualEPFEmployer + annualGratuity)
  );

  // Gross Salary (CTC minus employer PF & Gratuity)
  const annualGross = annualBasic + annualHRA + annualSpecialAllowance;
  const monthlyGross = annualGross / 12;

  // Professional Tax (Standard ₹2,400/yr or ₹200/mo)
  const annualProfTax = 2400;

  // Income Tax Estimate
  const taxResult = calculateIncomeTax({
    grossSalary: annualGross,
    regime: taxRegime,
  });

  const annualTax = taxResult.totalTax;
  const monthlyTax = annualTax / 12;

  // Net In-Hand Salary
  const annualInHand = Math.max(0, annualGross - annualEPFEmployee - annualProfTax - annualTax);
  const monthlyInHand = annualInHand / 12;

  return {
    annualCTC: roundTo(ctc, 0),
    monthlyCTC: roundTo(ctc / 12, 0),
    annualBasic: roundTo(annualBasic, 0),
    monthlyBasic: roundTo(monthlyBasic, 0),
    annualHRA: roundTo(annualHRA, 0),
    annualSpecialAllowance: roundTo(annualSpecialAllowance, 0),
    annualGross: roundTo(annualGross, 0),
    monthlyGross: roundTo(monthlyGross, 0),
    annualEPF: roundTo(annualEPFEmployee, 0),
    monthlyEPF: roundTo(monthlyEPF, 0),
    annualProfTax: roundTo(annualProfTax, 0),
    monthlyProfTax: roundTo(annualProfTax / 12, 0),
    annualTax: roundTo(annualTax, 0),
    monthlyTax: roundTo(monthlyTax, 0),
    annualInHand: roundTo(annualInHand, 0),
    monthlyInHand: roundTo(monthlyInHand, 0),
  };
}

/**
 * Gratuity Calculation (Payment of Gratuity Act, 1972):
 * Gratuity = (15 * Last Basic Salary * Number of Years) / 26
 */
export function calculateGratuity(lastMonthlyBasic: number, yearsOfService: number) {
  const basic = Math.max(0, lastMonthlyBasic);
  const years = Math.max(0, yearsOfService);
  if (years < 5) {
    // Legally minimum 5 continuous years are required for eligibility
    const potential = (15 * basic * years) / 26;
    return {
      gratuityAmount: 0,
      estimatedGratuity: roundTo(potential, 0),
      eligible: false,
      message: 'Minimum 5 continuous years of service are required under the Payment of Gratuity Act.',
    };
  }
  const amount = Math.min(2000000, (15 * basic * years) / 26); // Tax-free limit up to 20 Lakhs
  return {
    gratuityAmount: roundTo(amount, 0),
    estimatedGratuity: roundTo(amount, 0),
    eligible: true,
    message: 'Eligible for gratuity (statutory tax exemption cap is ₹20 Lakh).',
  };
}

/**
 * Retirement & FIRE Corpus Calculation
 */
export function calculateRetirementCorpus(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentMonthlyExpense: number,
  inflationRate: number = 6,
  preRetirementReturn: number = 12,
  postRetirementReturn: number = 7
) {
  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);
  const inf = inflationRate / 100;

  // Monthly expense at retirement: PresentExpense * (1 + inf)^yearsToRetire
  const monthlyExpenseAtRetirement =
    currentMonthlyExpense * Math.pow(1 + inf, yearsToRetire);
  const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;

  // Real rate of return post-retirement
  // RealRate = ((1 + postReturn) / (1 + inflation)) - 1
  const postReturn = postRetirementReturn / 100;
  const realRate = (1 + postReturn) / (1 + inf) - 1;

  // Required Corpus at retirement = AnnualExpense * [ (1 - (1 + realRate)^(-yearsInRetirement)) / realRate ]
  let requiredCorpus = 0;
  if (Math.abs(realRate) < 0.0001) {
    requiredCorpus = annualExpenseAtRetirement * yearsInRetirement;
  } else {
    requiredCorpus =
      annualExpenseAtRetirement *
      ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);
  }

  // Monthly SIP needed to build this corpus from scratch
  const preReturnMonthly = preRetirementReturn / 12 / 100;
  const totalMonths = yearsToRetire * 12;
  const requiredMonthlySIP =
    (requiredCorpus * preReturnMonthly) /
    ((Math.pow(1 + preReturnMonthly, totalMonths) - 1) * (1 + preReturnMonthly));

  return {
    yearsToRetire,
    yearsInRetirement,
    monthlyExpenseAtRetirement: roundTo(monthlyExpenseAtRetirement, 0),
    annualExpenseAtRetirement: roundTo(annualExpenseAtRetirement, 0),
    requiredCorpus: roundTo(requiredCorpus, 0),
    requiredMonthlySIP: roundTo(Math.max(0, requiredMonthlySIP), 0),
  };
}

/**
 * Statistical Data Analyzer: Mean, Median, Mode, Variance, Std Dev
 */
export function calculateDatasetStats(numbers: number[]) {
  if (!numbers || numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      mode: 'N/A',
      min: 0,
      max: 0,
      range: 0,
      variancePop: 0,
      varianceSample: 0,
      stdDevPop: 0,
      stdDevSample: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const frequencyMap: Record<number, number> = {};
  let maxFreq = 0;
  for (const n of sorted) {
    frequencyMap[n] = (frequencyMap[n] || 0) + 1;
    if (frequencyMap[n] > maxFreq) maxFreq = frequencyMap[n];
  }
  const modes: number[] = [];
  if (maxFreq > 1) {
    for (const [key, freq] of Object.entries(frequencyMap)) {
      if (freq === maxFreq) modes.push(Number(key));
    }
  }
  const modeStr = modes.length > 0 ? modes.join(', ') : 'No unique mode';

  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Variance & StdDev
  const squaredDiffs = sorted.map((n) => Math.pow(n - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, curr) => acc + curr, 0);
  const variancePop = sumSquaredDiffs / count;
  const varianceSample = count > 1 ? sumSquaredDiffs / (count - 1) : 0;
  const stdDevPop = Math.sqrt(variancePop);
  const stdDevSample = Math.sqrt(varianceSample);

  // Quartiles
  const q1 = sorted[Math.floor(count * 0.25)];
  const q3 = sorted[Math.floor(count * 0.75)];
  const iqr = q3 - q1;

  return {
    count,
    sum: roundTo(sum, 2),
    mean: roundTo(mean, 2),
    median: roundTo(median, 2),
    mode: modeStr,
    min,
    max,
    range: roundTo(range, 2),
    variancePop: roundTo(variancePop, 2),
    varianceSample: roundTo(varianceSample, 2),
    stdDevPop: roundTo(stdDevPop, 2),
    stdDevSample: roundTo(stdDevSample, 2),
    q1: roundTo(q1, 2),
    q3: roundTo(q3, 2),
    iqr: roundTo(iqr, 2),
  };
}
