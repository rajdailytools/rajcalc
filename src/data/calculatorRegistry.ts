import { CalculatorDefinition } from '../types/calculator';
import {
  calculateEMI,
  generateAmortizationSchedule,
  calculateSIP,
  calculateStepUpSIP,
  calculateLumpsum,
  calculateCAGR,
  calculateSWP,
  calculatePPF,
  calculateIncomeTax,
  calculateGST,
  calculateSalaryCTC,
  calculateGratuity,
  calculateRetirementCorpus,
  calculateDatasetStats,
} from '../utils/mathEngine';
import { roundTo } from '../utils/formatters';

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  // 1. EMI Calculator
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    title: 'Loan EMI Calculator',
    shortDescription: 'Calculate equated monthly installments (EMI), total interest payable, and yearly amortization schedule for any loan.',
    category: 'finance',
    subcategory: 'Loans & EMI',
    keywords: ['emi calculator', 'loan calculator', 'monthly installment', 'home loan emi', 'car loan emi', 'personal loan emi'],
    route: '/calculators/emi-calculator',
    formula: 'E = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}',
    formulaExplanation: 'Where P is the Principal loan amount, r is the monthly interest rate (Annual Rate / 12 / 100), and n is the tenure in total months.',
    inputs: [
      { id: 'principal', label: 'Loan Amount', type: 'currency', defaultValue: 1000000, min: 10000, max: 100000000, step: 10000, helpText: 'Total amount borrowed from lender.' },
      { id: 'rate', label: 'Interest Rate (p.a.)', type: 'percent', defaultValue: 8.5, min: 1, max: 36, step: 0.1, helpText: 'Annual reducing interest rate charged by bank.' },
      { id: 'tenureYears', label: 'Loan Tenure', type: 'number', defaultValue: 15, min: 1, max: 35, step: 1, suffix: 'Years', helpText: 'Duration of the loan in years.' },
    ],
    calculate: (inputs, context) => {
      const P = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const tenure = Number(inputs.tenureYears) || 1;
      const { emi, totalInterest, totalPayment } = calculateEMI(P, rate, tenure);
      const schedule = generateAmortizationSchedule(P, rate, tenure);

      return {
        primaryOutput: {
          label: 'Monthly EMI',
          value: emi,
          format: 'currency',
          subtext: `Total payment over ${tenure} years: ${totalPayment.toLocaleString()}`,
        },
        breakdownOutputs: [
          { label: 'Principal Amount', value: P, format: 'currency' },
          { label: 'Total Interest Payable', value: totalInterest, format: 'currency' },
          { label: 'Total Amount Payable', value: totalPayment, format: 'currency' },
          { label: 'Interest as % of Total', value: totalPayment > 0 ? roundTo((totalInterest / totalPayment) * 100, 1) : 0, format: 'percent' },
        ],
        chartData: [
          { name: 'Principal Loan', value: P, color: '#2563EB' },
          { name: 'Total Interest', value: totalInterest, color: '#0EA5E9' },
        ],
        chartType: 'donut',
        seriesData: schedule.map((s) => ({
          period: `Year ${s.year}`,
          Principal: s.principalPaid,
          Interest: s.interestPaid,
          Balance: s.balance,
        })),
        breakdownSteps: [
          { step: '1. Monthly Interest Rate (r)', detail: `${rate}% ÷ 12 ÷ 100 = ${(rate / 12 / 100).toFixed(6)}` },
          { step: '2. Total Installments (n)', detail: `${tenure} years × 12 months = ${tenure * 12} months` },
          { step: '3. Calculate Compounding Factor', detail: `(1 + r)^n = ${(Math.pow(1 + rate / 12 / 100, tenure * 12)).toFixed(4)}` },
          { step: '4. Compute Monthly Payment', detail: `E = Principal × [r(1+r)^n / ((1+r)^n - 1)] = ${emi}` },
        ],
        meaningExplanation:
          'Your Equated Monthly Installment (EMI) is the fixed sum paid each month to clear both the principal and interest charges. In the initial years, a higher proportion goes toward interest, while principal repayment accelerates in later years.',
        quickTable: {
          headers: ['Year', 'Principal Paid', 'Interest Paid', 'Total Annual Paid', 'Outstanding Balance'],
          rows: schedule.map((s) => [s.year, s.principalPaid, s.interestPaid, s.totalPaid, s.balance]),
        },
      };
    },
    faq: [
      { question: 'What is reducing balance interest?', answer: 'In reducing balance loans, interest is charged only on the remaining unpaid principal at the end of each month, not the original loan amount.' },
      { question: 'Can I lower my EMI?', answer: 'Yes, by increasing the loan tenure (which increases total interest paid), making part-prepayments, or negotiating a lower interest rate with the lender.' },
      { question: 'Does EMI change over time?', answer: 'For fixed-rate loans, EMI stays constant. For floating-rate loans, banks typically adjust the loan tenure or monthly EMI when benchmark interest rates change.' },
    ],
    assumptions: ['Assumes constant annual interest rate throughout loan tenure.', 'Payments occur monthly at the end of each installment cycle.', 'No processing fees or statutory taxes are bundled into the basic EMI formula.'],
    tips: ['Even an extra half-EMI payment per year can shave 3 to 4 years off a 20-year home loan.', 'Always compare total interest cost, not just monthly EMI, when comparing offers.'],
    commonMistakes: ['Confusing flat interest rates with reducing balance rates (a 9% flat rate equals ~16% reducing rate).', 'Choosing longer tenure only to get lower EMI without realizing total interest can exceed principal.'],
    stepByStepExample: {
      scenario: 'Borrowing ₹10,00,000 at 8.5% p.a. for 15 years',
      inputs: { 'Loan Amount': '₹10,00,000', 'Interest Rate': '8.5%', 'Tenure': '15 Years (180 months)' },
      calculation: 'Monthly rate = 0.007083. Factor = (1.007083)^180 = 3.559. EMI = 10,00,000 × [0.007083 × 3.559 / (3.559 - 1)] = ₹9,847.',
      outcome: 'Monthly EMI: ₹9,847 | Total Interest: ₹7,72,534 | Total Payable: ₹17,72,534',
    },
    diagram: {
      title: 'EMI Repayment Flow',
      steps: ['Input Loan Amount & Rate', 'Calculate Monthly Rate (r)', 'Apply Reducing Balance Formula', 'Derive Monthly EMI', 'Generate Amortization Breakdown'],
    },
    relatedCalculators: ['home-loan-emi-calculator', 'loan-prepayment-calculator', 'sip-calculator', 'income-tax-calculator'],
    relatedGuides: ['how-to-reduce-home-loan-interest', 'difference-between-flat-and-reducing-rate'],
    seoTitle: 'EMI Calculator – Equated Monthly Installment & Amortization Schedule',
    metaDescription: 'Calculate accurate loan EMI, total interest, and complete year-by-year amortization schedule for home, car, and personal loans. Transparent and free.',
    lastUpdated: '2026-09-15',
    featured: true,
  },

  // 2. Home Loan EMI Calculator
  {
    id: 'home-loan-emi-calculator',
    slug: 'home-loan-emi-calculator',
    title: 'Home Loan EMI Calculator',
    shortDescription: 'Calculate monthly home loan installments, property financing costs, and loan amortization over 10 to 30 years.',
    category: 'finance',
    subcategory: 'Mortgage & Home Loans',
    keywords: ['home loan emi calculator', 'housing loan emi', 'mortgage calculator', 'property loan emi'],
    route: '/calculators/home-loan-emi-calculator',
    formula: 'E = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}',
    formulaExplanation: 'Calculated using reducing balance methodology over standard 10–30 year home loan tenures.',
    inputs: [
      { id: 'principal', label: 'Home Loan Amount', type: 'currency', defaultValue: 3500000, min: 100000, max: 200000000, step: 50000, helpText: 'Sanctioned loan amount after down payment.' },
      { id: 'rate', label: 'Interest Rate (% p.a.)', type: 'percent', defaultValue: 8.4, min: 2, max: 20, step: 0.05, helpText: 'Floating or fixed home loan rate.' },
      { id: 'tenureYears', label: 'Loan Tenure', type: 'number', defaultValue: 20, min: 1, max: 30, step: 1, suffix: 'Years', helpText: 'Home loan term (typically 15–30 years).' },
    ],
    calculate: (inputs) => {
      const P = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const tenure = Number(inputs.tenureYears) || 1;
      const { emi, totalInterest, totalPayment } = calculateEMI(P, rate, tenure);
      const schedule = generateAmortizationSchedule(P, rate, tenure);

      return {
        primaryOutput: {
          label: 'Monthly Home Loan EMI',
          value: emi,
          format: 'currency',
          subtext: `Total repayment over ${tenure} years`,
        },
        breakdownOutputs: [
          { label: 'Principal Amount', value: P, format: 'currency' },
          { label: 'Total Interest Payable', value: totalInterest, format: 'currency' },
          { label: 'Total Repayment', value: totalPayment, format: 'currency' },
          { label: 'Interest / Principal Ratio', value: P > 0 ? roundTo(totalInterest / P, 2) : 0, format: 'number', subtext: 'Multiplier of borrowed capital' },
        ],
        chartData: [
          { name: 'Borrowed Principal', value: P, color: '#2563EB' },
          { name: 'Interest to Bank', value: totalInterest, color: '#0EA5E9' },
        ],
        chartType: 'donut',
        seriesData: schedule.map((s) => ({
          period: `Yr ${s.year}`,
          Principal: s.principalPaid,
          Interest: s.interestPaid,
          Balance: s.balance,
        })),
        breakdownSteps: [
          { step: '1. Monthly Rate Factor', detail: `${rate}% annual ÷ 1200 = ${(rate / 1200).toFixed(6)} per month` },
          { step: '2. Installment Count', detail: `${tenure} years × 12 = ${tenure * 12} monthly cycles` },
          { step: '3. Loan EMI', detail: `₹${P.toLocaleString()} financed at ${rate}% yields ₹${emi.toLocaleString()} monthly` },
        ],
        meaningExplanation:
          'On long tenures like 20 or 30 years, total interest paid often matches or exceeds the principal borrowed. Making periodic prepayments reduces principal directly, drastically shortening tenure.',
        quickTable: {
          headers: ['Year', 'Principal Paid', 'Interest Paid', 'Balance Remaining'],
          rows: schedule.map((s) => [s.year, s.principalPaid, s.interestPaid, s.balance]),
        },
      };
    },
    faq: [
      { question: 'What is the ideal home loan tenure?', answer: 'A tenure of 15 to 20 years offers a balanced tradeoff between affordable monthly EMI and reasonable total interest burden.' },
      { question: 'Can home loan interest be deducted from taxes?', answer: 'Under Indian Income Tax (Old Regime), interest up to ₹2,00,000 is deductible under Section 24(b) for self-occupied properties.' },
    ],
    assumptions: ['Interest calculated monthly on reducing balance.', 'Does not account for prepayment penalties or statutory stamp duty.'],
    tips: ['Increase your EMI by 5% every year as your salary increases to cut your 20-year loan down to under 12 years.'],
    commonMistakes: ['Over-leveraging by keeping EMI higher than 40-50% of your monthly net take-home salary.'],
    stepByStepExample: {
      scenario: 'Home loan of ₹35,00,000 at 8.4% for 20 years',
      inputs: { 'Loan Amount': '₹35,00,000', 'Rate': '8.4%', 'Tenure': '20 Years' },
      calculation: 'Monthly rate = 0.007. n = 240 months. EMI = ₹30,139.',
      outcome: 'Monthly EMI: ₹30,139 | Total Interest: ₹37,33,360 | Total Payable: ₹72,33,360',
    },
    diagram: {
      title: 'Home Loan Financial Architecture',
      steps: ['Property Value', 'Down Payment (20%)', 'Loan Sanctioned (80%)', 'Monthly EMI Schedule', 'Tax Deductions u/s 24b & 80C'],
    },
    relatedCalculators: ['emi-calculator', 'loan-prepayment-calculator', 'income-tax-calculator', 'rent-vs-buy-calculator'],
    seoTitle: 'Home Loan EMI Calculator – Housing Loan Installment & Interest Breakdown',
    metaDescription: 'Calculate monthly home loan EMI, total interest, and amortization schedule. Compare tenures and discover interest saving strategies.',
    lastUpdated: '2026-09-20',
    featured: true,
  },

  // 3. SIP Calculator
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    title: 'SIP Calculator',
    shortDescription: 'Calculate wealth created through Systematic Investment Plans (SIP) in mutual funds with compounding returns.',
    category: 'investment',
    subcategory: 'Mutual Funds',
    keywords: ['sip calculator', 'mutual fund sip', 'systematic investment plan', 'wealth calculator', 'compound interest sip'],
    route: '/calculators/sip-calculator',
    formula: 'M = P \\times \\frac{(1 + i)^n - 1}{i} \\times (1 + i)',
    formulaExplanation: 'Where P is the monthly investment, i is periodic monthly return rate (Annual Return / 12 / 100), and n is total months invested.',
    inputs: [
      { id: 'monthlyInvestment', label: 'Monthly Investment', type: 'currency', defaultValue: 10000, min: 500, max: 2000000, step: 500, helpText: 'Amount you deposit every month.' },
      { id: 'annualRate', label: 'Expected Return Rate (p.a.)', type: 'percent', defaultValue: 12, min: 1, max: 30, step: 0.5, helpText: 'Long-term historical annualized return expectation (equity mutual funds typically 10–14%).' },
      { id: 'tenureYears', label: 'Investment Horizon', type: 'number', defaultValue: 15, min: 1, max: 40, step: 1, suffix: 'Years', helpText: 'Number of years you plan to remain invested.' },
    ],
    calculate: (inputs) => {
      const P = Number(inputs.monthlyInvestment) || 0;
      const rate = Number(inputs.annualRate) || 0;
      const tenure = Number(inputs.tenureYears) || 1;
      const { totalInvested, totalGains, maturityValue, yearlyGrowth } = calculateSIP(P, rate, tenure);

      return {
        primaryOutput: {
          label: 'Expected Maturity Amount',
          value: maturityValue,
          format: 'currency',
          subtext: `From ₹${totalInvested.toLocaleString()} total invested capital`,
        },
        breakdownOutputs: [
          { label: 'Total Invested Amount', value: totalInvested, format: 'currency' },
          { label: 'Estimated Wealth Gains', value: totalGains, format: 'currency' },
          { label: 'Maturity Value', value: maturityValue, format: 'currency' },
          { label: 'Gain Multiplier', value: totalInvested > 0 ? roundTo(maturityValue / totalInvested, 2) : 1, format: 'number', subtext: 'x your capital' },
        ],
        chartData: [
          { name: 'Total Invested', value: totalInvested, color: '#2563EB' },
          { name: 'Estimated Returns', value: totalGains, color: '#14B8A6' },
        ],
        chartType: 'donut',
        seriesData: yearlyGrowth.map((g) => ({
          period: `Yr ${g.year}`,
          Invested: g.invested,
          Gains: g.returns,
          'Total Value': g.totalValue,
        })),
        breakdownSteps: [
          { step: '1. Monthly Growth Rate (i)', detail: `${rate}% annual ÷ 12 ÷ 100 = ${(rate / 12 / 100).toFixed(6)}` },
          { step: '2. Compounding Periods (n)', detail: `${tenure} years × 12 months = ${tenure * 12} deposits` },
          { step: '3. Future Value of Annuity', detail: `Invested ₹${totalInvested.toLocaleString()} grows to ₹${maturityValue.toLocaleString()} at ${rate}% expected CAGR.` },
        ],
        meaningExplanation:
          'SIP enforces disciplined rupee-cost averaging. In down markets you accumulate more mutual fund units, and in bull runs compounding accelerates your wealth accumulation.',
        quickTable: {
          headers: ['Year', 'Total Invested', 'Estimated Returns', 'Portfolio Value'],
          rows: yearlyGrowth.map((g) => [g.year, g.invested, g.returns, g.totalValue]),
        },
      };
    },
    faq: [
      { question: 'What is a realistic expected return for mutual funds?', answer: 'For diversified equity index/flexi-cap funds over 10+ year horizons, historical CAGR has generally ranged between 11% and 13%.' },
      { question: 'Can I stop or pause my SIP anytime?', answer: 'Yes, mutual fund SIPs are non-binding. You can pause, modify, or stop installments without financial penalty in open-ended schemes.' },
    ],
    assumptions: ['Assumes constant annual compounded growth rate for modeling.', 'Returns are pre-tax and do not guarantee market performance.'],
    tips: ['Start as early as possible. An investor starting at age 25 accumulates nearly double the wealth by age 50 compared to someone starting at age 35.'],
    commonMistakes: ['Stopping SIPs during market corrections when units are cheapest.', 'Assuming returns will be linear every year rather than volatile.'],
    stepByStepExample: {
      scenario: 'Investing ₹10,000 monthly at 12% p.a. for 15 years',
      inputs: { 'Monthly SIP': '₹10,000', 'Rate of Return': '12%', 'Tenure': '15 Years' },
      calculation: 'Total deposits = 180 × ₹10,000 = ₹18,00,000. Compounded FV = ₹50,45,760.',
      outcome: 'Invested: ₹18,00,000 | Est. Gains: ₹32,45,760 | Maturity: ₹50,45,760',
    },
    diagram: {
      title: 'SIP Compounding Mechanics',
      steps: ['Monthly Bank Mandate', 'Purchase Fund Units (Rupee Cost Averaging)', 'Reinvest Dividends & Capital Gains', 'Exponential Power of Compounding'],
    },
    relatedCalculators: ['step-up-sip-calculator', 'cagr-calculator', 'lumpsum-calculator', 'retirement-calculator'],
    relatedGuides: ['power-of-compounding-explained', 'sip-vs-lumpsum-investment-guide'],
    seoTitle: 'SIP Calculator – Calculate Mutual Fund SIP Returns & Compounding',
    metaDescription: 'Calculate the future value of your monthly SIP investments in mutual funds. Interactive charts, year-wise table, and compounding insights.',
    lastUpdated: '2026-09-18',
    featured: true,
  },

  // 4. Step-Up SIP Calculator
  {
    id: 'step-up-sip-calculator',
    slug: 'step-up-sip-calculator',
    title: 'Step-Up SIP Calculator',
    shortDescription: 'Calculate mutual fund returns when increasing your monthly SIP amount annually by a fixed percentage as your income rises.',
    category: 'investment',
    subcategory: 'Mutual Funds',
    keywords: ['step up sip calculator', 'top up sip', 'increasing sip calculator', 'sip top-up'],
    route: '/calculators/step-up-sip-calculator',
    formula: 'Iterative annual geometric compounding: Monthly_{y} = Monthly_0 \\times (1 + g)^{y-1}',
    formulaExplanation: 'Where g is the annual step-up percentage and each 12-month tranche compounds at the expected annual rate.',
    inputs: [
      { id: 'initialMonthly', label: 'Initial Monthly Investment', type: 'currency', defaultValue: 10000, min: 1000, max: 1000000, step: 1000, helpText: 'Starting monthly investment amount.' },
      { id: 'stepUpPercent', label: 'Annual Step-Up (% p.a.)', type: 'percent', defaultValue: 10, min: 1, max: 50, step: 1, helpText: 'Percentage increase in monthly deposit each year (e.g. 10% matching salary increment).' },
      { id: 'annualRate', label: 'Expected Return Rate (% p.a.)', type: 'percent', defaultValue: 12, min: 1, max: 30, step: 0.5 },
      { id: 'tenureYears', label: 'Duration (Years)', type: 'number', defaultValue: 15, min: 2, max: 35, step: 1 },
    ],
    calculate: (inputs) => {
      const init = Number(inputs.initialMonthly) || 0;
      const stepUp = Number(inputs.stepUpPercent) || 0;
      const rate = Number(inputs.annualRate) || 0;
      const tenure = Number(inputs.tenureYears) || 2;
      const { totalInvested, totalGains, maturityValue, yearlyGrowth } = calculateStepUpSIP(init, stepUp, rate, tenure);

      return {
        primaryOutput: {
          label: 'Maturity Corpus',
          value: maturityValue,
          format: 'currency',
          subtext: `From ₹${totalInvested.toLocaleString()} invested with ${stepUp}% annual hike`,
        },
        breakdownOutputs: [
          { label: 'Total Capital Invested', value: totalInvested, format: 'currency' },
          { label: 'Wealth Growth Gains', value: totalGains, format: 'currency' },
          { label: 'Final Monthly Deposit (Yr ' + tenure + ')', value: yearlyGrowth[yearlyGrowth.length - 1]?.monthlyDeposit || 0, format: 'currency' },
          { label: 'Overall Wealth Multiplier', value: totalInvested > 0 ? roundTo(maturityValue / totalInvested, 2) : 1, format: 'number' },
        ],
        chartData: [
          { name: 'Capital Invested', value: totalInvested, color: '#2563EB' },
          { name: 'Compounded Gains', value: totalGains, color: '#10B981' },
        ],
        chartType: 'donut',
        seriesData: yearlyGrowth.map((g) => ({
          period: `Yr ${g.year}`,
          Invested: g.invested,
          'Total Value': g.totalValue,
        })),
        breakdownSteps: [
          { step: '1. Step-Up Increment', detail: `Monthly investment steps up by ${stepUp}% every 12 months.` },
          { step: '2. Accelerated Capital Injection', detail: `Year 1 deposit: ₹${init.toLocaleString()}/mo → Year ${tenure} deposit: ₹${(yearlyGrowth[yearlyGrowth.length - 1]?.monthlyDeposit || 0).toLocaleString()}/mo.` },
          { step: '3. Enhanced Compounding', detail: `Step-up boosts final corpus compared to fixed SIP significantly.` },
        ],
        meaningExplanation:
          'A Step-Up SIP aligns your investments with career income growth. A modest 10% annual step-up can often double your final corpus compared to a flat SIP over 15 to 20 years.',
        quickTable: {
          headers: ['Year', 'Monthly Deposit', 'Total Invested', 'Estimated Value'],
          rows: yearlyGrowth.map((g) => [g.year, g.monthlyDeposit, g.invested, g.totalValue]),
        },
      };
    },
    faq: [
      { question: 'Why is Step-Up SIP superior to regular SIP?', answer: 'As salaries increase with promotions and inflation adjustments, investing the same fixed amount lowers your savings rate over time. Stepping up preserves your savings ratio.' },
    ],
    assumptions: ['Investment amount increases strictly once per year after 12 months.', 'Returns remain consistently compounded over tenure.'],
    tips: ['Set your step-up percentage equal to your expected annual appraisal or inflation rate (8–10%).'],
    commonMistakes: ['Setting step-up too high (e.g. 25%), leading to cashflow crunches in later years.'],
    stepByStepExample: {
      scenario: 'Starting with ₹10,000/mo, 10% annual step-up, 12% return for 15 years',
      inputs: { 'Starting SIP': '₹10,000', 'Step-up': '10%', 'Rate': '12%', 'Tenure': '15 Years' },
      calculation: 'Total invested increases from ₹18.0L (regular) to ₹38.1L. Corpus jumps to over ₹88.7L.',
      outcome: 'Final Corpus: ~₹88.7 Lakh vs ~₹50.5 Lakh in flat SIP (+75% more wealth).',
    },
    diagram: {
      title: 'Step-Up Wealth Growth',
      steps: ['Base Monthly SIP', 'Annual Salary Review', 'Auto-Increase SIP by X%', 'Compounded Accelerated Wealth'],
    },
    relatedCalculators: ['sip-calculator', 'cagr-calculator', 'retirement-calculator'],
    seoTitle: 'Step-Up SIP Calculator – Top-Up SIP Wealth Growth Estimator',
    metaDescription: 'Calculate the exponential wealth impact of increasing your monthly mutual fund SIP annually. Compare flat SIP vs step-up SIP.',
    lastUpdated: '2026-09-19',
  },

  // 5. Income Tax Calculator (FY 2026-27 & AY 2027-28)
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    title: 'Income Tax Calculator (FY 2026-27 / AY 2027-28)',
    shortDescription: 'Calculate income tax liability, compare Old vs New Tax Regime, view tax slabs, standard deductions, and cess for FY 2026-27.',
    category: 'tax',
    subcategory: 'Direct Tax',
    keywords: ['income tax calculator', 'old vs new tax regime', 'fy 2026-27 tax calculator', 'income tax slab', 'salary tax calculator', 'section 87a rebate'],
    route: '/calculators/income-tax-calculator',
    formula: 'Tax = \\sum (Taxable \\, Slab \\times Rate) - Rebate_{87A} + 4\\% \\, Cess',
    formulaExplanation: 'Incorporating standard deduction (₹75,000 under New Regime), revised slab thresholds, and 4% Health & Education Cess.',
    inputs: [
      { id: 'grossSalary', label: 'Gross Annual Income', type: 'currency', defaultValue: 1200000, min: 100000, max: 100000000, step: 25000, helpText: 'Total annual earnings before any exemptions or tax deductions.' },
      { id: 'regime', label: 'Tax Regime', type: 'select', defaultValue: 'new', options: [{ label: 'New Tax Regime (Default)', value: 'new' }, { label: 'Old Tax Regime', value: 'old' }], helpText: 'Select preferred regime to evaluate tax liability.' },
      { id: 'section80C', label: 'Section 80C Deductions (Old Regime)', type: 'currency', defaultValue: 150000, min: 0, max: 150000, step: 5000, helpText: 'PPF, EPF, ELSS, Life Insurance, Home Loan Principal (Max ₹1.5 Lakh).' },
      { id: 'section80D', label: 'Section 80D Health Insurance (Old Regime)', type: 'currency', defaultValue: 25000, min: 0, max: 100000, step: 5000, helpText: 'Medical insurance premiums for self and family.' },
      { id: 'hraExemption', label: 'HRA Exemption (Old Regime)', type: 'currency', defaultValue: 60000, min: 0, max: 500000, step: 5000, helpText: 'House Rent Allowance tax-exempt portion.' },
    ],
    calculate: (inputs) => {
      const gross = Number(inputs.grossSalary) || 0;
      const regime = inputs.regime === 'old' ? 'old' : 'new';
      const sec80C = Number(inputs.section80C) || 0;
      const sec80D = Number(inputs.section80D) || 0;
      const hra = Number(inputs.hraExemption) || 0;

      const result = calculateIncomeTax({
        grossSalary: gross,
        regime,
        section80C: sec80C,
        section80D: sec80D,
        hraExemption: hra,
      });

      // Comparison with alternate regime
      const alternateRegime = regime === 'new' ? 'old' : 'new';
      const altResult = calculateIncomeTax({
        grossSalary: gross,
        regime: alternateRegime,
        section80C: sec80C,
        section80D: sec80D,
        hraExemption: hra,
      });

      const taxSavingsInChosen = altResult.totalTax - result.totalTax;

      return {
        primaryOutput: {
          label: 'Total Annual Tax Payable',
          value: result.totalTax,
          format: 'currency',
          subtext: `Effective Tax Rate: ${result.effectiveTaxRate}% of gross income`,
        },
        breakdownOutputs: [
          { label: 'Gross Annual Income', value: result.grossSalary, format: 'currency' },
          { label: 'Standard Deduction', value: result.standardDeduction, format: 'currency' },
          { label: 'Total Deductions Claimed', value: result.totalDeductions, format: 'currency' },
          { label: 'Net Taxable Income', value: result.taxableIncome, format: 'currency' },
          { label: 'Section 87A Tax Rebate', value: result.rebate87A, format: 'currency' },
          { label: '4% Health & Education Cess', value: result.cess, format: 'currency' },
          { label: 'Monthly Tax Deducted (TDS)', value: result.monthlyTax, format: 'currency' },
          { label: 'Net Annual Take-Home', value: result.netTakeHome, format: 'currency' },
        ],
        chartData: [
          { name: 'Net Take-Home Salary', value: result.netTakeHome, color: '#16A34A' },
          { name: 'Income Tax & Cess', value: result.totalTax, color: '#DC2626' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Standard Deduction', detail: `${regime === 'new' ? 'New Regime offers flat ₹75,000 deduction' : 'Old Regime offers ₹50,000 deduction'}` },
          { step: '2. Taxable Income Calculation', detail: `Gross (₹${gross.toLocaleString()}) - Deductions (₹${result.totalDeductions.toLocaleString()}) = ₹${result.taxableIncome.toLocaleString()}` },
          { step: '3. Slab-Wise Calculation', detail: `Base tax computed across applicable brackets: ₹${result.taxBeforeCess.toLocaleString()}` },
          { step: '4. Health & Education Cess', detail: `4% Cess on tax = ₹${result.cess.toLocaleString()}` },
        ],
        meaningExplanation:
          result.totalTax === 0
            ? 'Your taxable income qualifies for Section 87A rebate or falls below the basic exemption threshold, meaning zero income tax liability for this assessment period.'
            : `Under the ${regime === 'new' ? 'New' : 'Old'} Regime, your total tax burden is ₹${result.totalTax.toLocaleString()}. ${taxSavingsInChosen > 0 ? `You save ₹${taxSavingsInChosen.toLocaleString()} compared to the ${alternateRegime} regime.` : taxSavingsInChosen < 0 ? `Note: The ${alternateRegime} regime would save you ₹${Math.abs(taxSavingsInChosen).toLocaleString()}!` : 'Both regimes yield identical tax for your current deductions.'}`,
        quickTable: {
          headers: ['Parameter', 'New Regime', 'Old Regime'],
          rows: [
            ['Standard Deduction', '₹75,000', '₹50,000'],
            ['Total Deductions', `₹${regime === 'new' ? result.totalDeductions.toLocaleString() : altResult.totalDeductions.toLocaleString()}`, `₹${regime === 'old' ? result.totalDeductions.toLocaleString() : altResult.totalDeductions.toLocaleString()}`],
            ['Taxable Income', `₹${regime === 'new' ? result.taxableIncome.toLocaleString() : altResult.taxableIncome.toLocaleString()}`, `₹${regime === 'old' ? result.taxableIncome.toLocaleString() : altResult.taxableIncome.toLocaleString()}`],
            ['Annual Tax Payable', `₹${regime === 'new' ? result.totalTax.toLocaleString() : altResult.totalTax.toLocaleString()}`, `₹${regime === 'old' ? result.totalTax.toLocaleString() : altResult.totalTax.toLocaleString()}`],
            ['Net Take-Home', `₹${regime === 'new' ? result.netTakeHome.toLocaleString() : altResult.netTakeHome.toLocaleString()}`, `₹${regime === 'old' ? result.netTakeHome.toLocaleString() : altResult.netTakeHome.toLocaleString()}`],
          ],
        },
      };
    },
    faq: [
      { question: 'What is the tax-free limit under New Tax Regime in FY 2026-27?', answer: 'With the enhanced standard deduction of ₹75,000 and Section 87A rebate for taxable income up to ₹7,00,000, salaried employees with gross income up to ₹7,75,000 pay zero income tax.' },
      { question: 'When should I choose Old Tax Regime over New Tax Regime?', answer: 'Choose Old Regime if your total deductions (Section 80C + 80D + HRA + Home Loan Interest) exceed approximately ₹3,75,000 to ₹4,00,000. For lower deductions, New Regime generally offers lower tax.' },
    ],
    assumptions: ['Salaried individual aged below 60 years.', 'Standard deduction applied automatically.', 'Surcharge not included for incomes below ₹50 Lakhs.', 'Subject to official Union Budget finance bills.'],
    tips: ['Compare both regimes before submitting your annual investment declaration to your employer’s payroll team.'],
    commonMistakes: ['Assuming 80C deductions work in the New Regime (they do NOT qualify under New Regime).'],
    stepByStepExample: {
      scenario: 'Gross salary ₹12,00,000 under New Tax Regime',
      inputs: { 'Gross Salary': '₹12,00,000', 'Regime': 'New Regime', 'Standard Deduction': '₹75,000' },
      calculation: 'Taxable Income = ₹11,25,000. 0-3L: Nil, 3-7L (5%): ₹20,000, 7-10L (10%): ₹30,000, 10-11.25L (15%): ₹18,750. Total = ₹68,750 + 4% cess (₹2,750) = ₹71,500.',
      outcome: 'Total Tax: ₹71,500 | Effective Rate: 5.96% | Monthly TDS: ₹5,958',
    },
    diagram: {
      title: 'Tax Calculation Pipeline',
      steps: ['Gross Income Entry', 'Apply Standard & Chapter VI-A Deductions', 'Compute Taxable Income', 'Evaluate Section 87A Rebate', 'Add 4% Health & Education Cess'],
    },
    relatedCalculators: ['salary-calculator', 'hra-calculator', 'gratuity-calculator', 'ppf-calculator'],
    relatedGuides: ['old-vs-new-tax-regime-complete-guide', 'section-80c-deduction-options'],
    seoTitle: 'Income Tax Calculator FY 2026-27 – Old vs New Regime Comparison',
    metaDescription: 'Calculate your exact income tax for FY 2026-27 (AY 2027-28). Compare Old vs New Tax Regime with revised slabs and ₹75,000 standard deduction.',
    lastUpdated: '2026-09-22',
    featured: true,
  },

  // 6. GST Calculator
  {
    id: 'gst-calculator',
    slug: 'gst-calculator',
    title: 'GST Calculator',
    shortDescription: 'Calculate Goods and Services Tax (GST) inclusive, exclusive, CGST, SGST, IGST split, and invoice values.',
    category: 'gst',
    subcategory: 'Indirect Tax',
    keywords: ['gst calculator', 'gst inclusive', 'gst exclusive', 'cgst sgst calculator', 'reverse gst calculator', 'invoice gst'],
    route: '/calculators/gst-calculator',
    formula: 'GST_{exclusive} = Amount \\times \\frac{Rate}{100} \\quad | \\quad GST_{inclusive} = Amount - \\frac{Amount}{1 + Rate/100}',
    formulaExplanation: 'Calculates additive GST for price quotation or extracts embedded tax from MRP/gross invoice totals.',
    inputs: [
      { id: 'amount', label: 'Amount', type: 'currency', defaultValue: 10000, min: 1, max: 100000000, step: 100, helpText: 'Base cost or inclusive invoice total.' },
      { id: 'rate', label: 'GST Rate Slab', type: 'select', defaultValue: 18, options: [{ label: '5% (Essential Goods)', value: 5 }, { label: '12% (Processed Goods)', value: 12 }, { label: '18% (Standard Services & Tech)', value: 18 }, { label: '28% (Luxury & De-merit)', value: 28 }, { label: '0.25% (Precious Stones)', value: 0.25 }, { label: '3% (Gold & Silver)', value: 3 }], helpText: 'Applicable statutory GST slab.' },
      { id: 'type', label: 'Calculation Type', type: 'select', defaultValue: 'exclusive', options: [{ label: 'GST Exclusive (Add GST to Net Price)', value: 'exclusive' }, { label: 'GST Inclusive (Remove GST from Total)', value: 'inclusive' }], helpText: 'Choose whether you want to add or extract tax.' },
      { id: 'supply', label: 'Supply Type', type: 'select', defaultValue: 'intra', options: [{ label: 'Intra-State (CGST + SGST)', value: 'intra' }, { label: 'Inter-State (IGST)', value: 'inter' }], helpText: 'Intra-state splits 50:50 between Central and State; Inter-state applies Integrated GST.' },
    ],
    calculate: (inputs) => {
      const amt = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 18;
      const isInclusive = inputs.type === 'inclusive';
      const isInterstate = inputs.supply === 'inter';

      const res = calculateGST(amt, rate, isInclusive, isInterstate);

      return {
        primaryOutput: {
          label: isInclusive ? 'Net Pre-Tax Value' : 'Total Post-Tax Invoice',
          value: isInclusive ? res.netAmount : res.grossAmount,
          format: 'currency',
          subtext: `Total GST: ${res.gstAmount.toLocaleString()} (${rate}%)`,
        },
        breakdownOutputs: [
          { label: 'Net Amount (Before Tax)', value: res.netAmount, format: 'currency' },
          { label: 'Total GST Amount', value: res.gstAmount, format: 'currency' },
          { label: 'Gross Invoice Amount', value: res.grossAmount, format: 'currency' },
          { label: isInterstate ? 'IGST (Integrated)' : 'CGST (Central Tax)', value: isInterstate ? res.igst : res.cgst, format: 'currency', subtext: isInterstate ? `${rate}%` : `${rate / 2}%` },
          { label: isInterstate ? 'SGST / UTGST' : 'SGST (State Tax)', value: isInterstate ? 0 : res.sgst, format: 'currency', subtext: isInterstate ? 'Not Applicable' : `${rate / 2}%` },
        ],
        chartData: [
          { name: 'Net Amount', value: res.netAmount, color: '#2563EB' },
          { name: 'GST Tax', value: res.gstAmount, color: '#14B8A6' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. GST Slab', detail: `${rate}% applicable rate` },
          { step: '2. Calculation Basis', detail: isInclusive ? `Net = Total / (1 + ${rate}/100) = ₹${res.netAmount.toLocaleString()}` : `GST = Net × ${rate}% = ₹${res.gstAmount.toLocaleString()}` },
          { step: '3. Tax Split', detail: isInterstate ? `100% to IGST = ₹${res.igst.toLocaleString()}` : `50% CGST (₹${res.cgst.toLocaleString()}) + 50% SGST (₹${res.sgst.toLocaleString()})` },
        ],
        meaningExplanation: isInclusive
          ? `From your gross MRP/invoice of ₹${amt.toLocaleString()}, the vendor retains ₹${res.netAmount.toLocaleString()} and remits ₹${res.gstAmount.toLocaleString()} in GST to the government.`
          : `For a net service/goods quote of ₹${amt.toLocaleString()}, adding ${rate}% GST (₹${res.gstAmount.toLocaleString()}) brings the final payable invoice to ₹${res.grossAmount.toLocaleString()}.`,
        quickTable: {
          headers: ['Component', 'Percentage', 'Amount'],
          rows: [
            ['Net Taxable Base', '100%', res.netAmount],
            [isInterstate ? 'IGST' : 'CGST', isInterstate ? `${rate}%` : `${rate / 2}%`, isInterstate ? res.igst : res.cgst],
            [isInterstate ? 'SGST' : 'SGST', isInterstate ? '0%' : `${rate / 2}%`, isInterstate ? 0 : res.sgst],
            ['Final Invoice Total', `${100 + rate}%`, res.grossAmount],
          ],
        },
      };
    },
    faq: [
      { question: 'What is the difference between CGST, SGST, and IGST?', answer: 'CGST (Central) and SGST (State) apply equally to sales occurring within the same state. IGST (Integrated) applies when goods or services are transferred across state borders.' },
      { question: 'How do I extract GST from MRP?', answer: 'Use the GST Inclusive formula: Net Amount = MRP / (1 + Rate / 100). The difference between MRP and Net Amount is the GST component.' },
    ],
    assumptions: ['Standard statutory GST rates without cess (like compensation cess on motor vehicles).'],
    tips: ['Businesses registered under GST can claim Input Tax Credit (ITC) on the GST paid for operational business purchases.'],
    commonMistakes: ['Simply multiplying MRP by 18% to find GST, which overstates the tax because the MRP already includes tax.'],
    stepByStepExample: {
      scenario: 'Adding 18% GST to ₹10,000 intra-state transaction',
      inputs: { 'Amount': '₹10,000', 'Rate': '18%', 'Type': 'Exclusive', 'Supply': 'Intra-State' },
      calculation: 'GST = ₹10,000 × 0.18 = ₹1,800. CGST = ₹900, SGST = ₹900. Total = ₹11,800.',
      outcome: 'Net: ₹10,000 | CGST: ₹900 | SGST: ₹900 | Total Invoice: ₹11,800',
    },
    diagram: {
      title: 'GST Tax Routing Flow',
      steps: ['Transaction Value', 'Select Tax Slab (5, 12, 18, 28%)', 'Determine Jurisdiction (Intra vs Inter)', 'Split Tax (CGST + SGST vs IGST)', 'Generate Formal Tax Invoice'],
    },
    relatedCalculators: ['income-tax-calculator', 'salary-calculator', 'profit-calculator'],
    seoTitle: 'GST Calculator – Calculate GST Inclusive, Exclusive & Tax Split',
    metaDescription: 'Accurately calculate GST inclusive and exclusive prices. Instant breakdown of CGST, SGST, and IGST for all tax slabs (5%, 12%, 18%, 28%).',
    lastUpdated: '2026-09-10',
    featured: true,
  },

  // 7. Salary CTC to In-Hand Calculator
  {
    id: 'salary-calculator',
    slug: 'salary-calculator',
    title: 'Salary & CTC to In-Hand Calculator',
    shortDescription: 'Calculate monthly take-home salary from annual Cost-to-Company (CTC), with breakdown of Basic, HRA, PF, Gratuity, and Tax.',
    category: 'salary',
    subcategory: 'Take-Home & Compensation',
    keywords: ['salary calculator', 'ctc to in-hand', 'take home salary calculator', 'in hand salary calculator', 'ctc breakup'],
    route: '/calculators/salary-calculator',
    formula: 'Net \\, TakeHome = Gross \\, Salary - Employee \\, PF - Professional \\, Tax - TDS',
    formulaExplanation: 'CTC includes employer contributions (Employer PF, Gratuity). Gross is CTC minus employer contributions. Net is Gross minus employee deductions.',
    inputs: [
      { id: 'annualCTC', label: 'Annual Cost to Company (CTC)', type: 'currency', defaultValue: 1200000, min: 100000, max: 20000000, step: 25000, helpText: 'Total compensation mentioned in job offer letter.' },
      { id: 'taxRegime', label: 'Income Tax Regime', type: 'select', defaultValue: 'new', options: [{ label: 'New Tax Regime (Default)', value: 'new' }, { label: 'Old Tax Regime', value: 'old' }], helpText: 'Determines monthly TDS deduction.' },
    ],
    calculate: (inputs) => {
      const ctc = Number(inputs.annualCTC) || 0;
      const regime = inputs.taxRegime === 'old' ? 'old' : 'new';
      const s = calculateSalaryCTC(ctc, regime);

      return {
        primaryOutput: {
          label: 'Monthly In-Hand Salary',
          value: s.monthlyInHand,
          format: 'currency',
          subtext: `Annual In-Hand: ₹${s.annualInHand.toLocaleString()}`,
        },
        breakdownOutputs: [
          { label: 'Monthly Gross Salary', value: s.monthlyGross, format: 'currency' },
          { label: 'Monthly Basic Pay', value: s.monthlyBasic, format: 'currency' },
          { label: 'Monthly HRA', value: s.annualHRA / 12, format: 'currency' },
          { label: 'Monthly EPF Deduction (Employee)', value: s.monthlyEPF, format: 'currency' },
          { label: 'Monthly Professional Tax', value: s.monthlyProfTax, format: 'currency' },
          { label: 'Estimated Monthly TDS (Tax)', value: s.monthlyTax, format: 'currency' },
          { label: 'Annual Employer PF & Gratuity', value: s.annualCTC - s.annualGross, format: 'currency', subtext: 'Retained by company/funds' },
        ],
        chartData: [
          { name: 'Take-Home Pay', value: s.annualInHand, color: '#16A34A' },
          { name: 'EPF Savings', value: s.annualEPF, color: '#2563EB' },
          { name: 'Income Tax', value: s.annualTax, color: '#DC2626' },
          { name: 'Employer PF & Gratuity', value: s.annualCTC - s.annualGross, color: '#F59E0B' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Basic Salary (40% of CTC)', detail: `₹${s.annualBasic.toLocaleString()} per year (₹${s.monthlyBasic.toLocaleString()}/mo)` },
          { step: '2. Statutory EPF (12% of Basic)', detail: `₹${s.annualEPF.toLocaleString()} saved in your retirement fund annually` },
          { step: '3. Deduct Professional Tax & TDS', detail: `Prof Tax ₹200/mo + TDS ~₹${s.monthlyTax.toLocaleString()}/mo` },
          { step: '4. Net Take-Home In Bank', detail: `₹${s.monthlyInHand.toLocaleString()} credited to your bank account each month` },
        ],
        meaningExplanation:
          'Your CTC includes non-cash benefits and employer statutory contributions (like Employer EPF and Gratuity pool). Your actual monthly salary credited to your savings account is your Gross earnings minus Employee PF, Professional Tax, and Income Tax (TDS).',
        quickTable: {
          headers: ['Salary Component', 'Monthly (₹)', 'Annual (₹)', '% of CTC'],
          rows: [
            ['Basic Salary', s.monthlyBasic, s.annualBasic, '40%'],
            ['HRA (House Rent)', s.annualHRA / 12, s.annualHRA, '20%'],
            ['Special Allowance', s.annualSpecialAllowance / 12, s.annualSpecialAllowance, `${roundTo((s.annualSpecialAllowance / s.annualCTC) * 100, 1)}%`],
            ['Gross Earnings', s.monthlyGross, s.annualGross, `${roundTo((s.annualGross / s.annualCTC) * 100, 1)}%`],
            ['Employee EPF (12%)', s.monthlyEPF, s.annualEPF, '4.8%'],
            ['Professional Tax', s.monthlyProfTax, s.annualProfTax, '0.2%'],
            ['Estimated TDS (Tax)', s.monthlyTax, s.annualTax, `${roundTo((s.annualTax / s.annualCTC) * 100, 1)}%`],
            ['Net Take-Home Salary', s.monthlyInHand, s.annualInHand, `${roundTo((s.annualInHand / s.annualCTC) * 100, 1)}%`],
          ],
        },
      };
    },
    faq: [
      { question: 'Why is my take-home salary so much lower than my CTC?', answer: 'CTC represents the total cost to the company, which includes Employer PF (12%), Gratuity pool (~4.8%), medical insurance, and other perks. After deducting Employee PF and income tax TDS, in-hand is typically 70% to 80% of CTC.' },
    ],
    assumptions: ['Assumes standard corporate CTC breakup with Basic at 40% and HRA at 20% of CTC.', 'Professional Tax taken at standard ₹200/month.', 'TDS calculated assuming no additional outside income or capital gains.'],
    tips: ['Your EPF deduction is not a loss; it earns government-guaranteed tax-free interest (currently ~8.25% p.a.).'],
    commonMistakes: ['Budgeting monthly lifestyle expenses based on CTC divided by 12.'],
    stepByStepExample: {
      scenario: '₹12,00,000 CTC under New Tax Regime',
      inputs: { 'Annual CTC': '₹12,00,000', 'Tax Regime': 'New Regime' },
      calculation: 'Basic = ₹4,80,000. Employee PF = ₹57,600. Income Tax = ~₹71,500. Prof Tax = ₹2,400. In-Hand = ₹8,89,700.',
      outcome: 'Monthly In-Hand: ~₹74,142 per month.',
    },
    diagram: {
      title: 'CTC Breakdown Hierarchy',
      steps: ['Cost to Company (CTC)', 'Minus Employer PF & Gratuity', 'Gross Salary', 'Minus Employee PF, PT & TDS', 'Net Take-Home Credited to Bank'],
    },
    relatedCalculators: ['income-tax-calculator', 'gratuity-calculator', 'epf-calculator'],
    seoTitle: 'Salary Calculator – Convert CTC to Monthly In-Hand Salary',
    metaDescription: 'Accurately convert your CTC into net monthly in-hand take-home salary. Comprehensive breakdown of Basic, HRA, EPF deductions, and TDS.',
    lastUpdated: '2026-09-24',
    featured: true,
  },

  // 8. PPF Calculator
  {
    id: 'ppf-calculator',
    slug: 'ppf-calculator',
    title: 'PPF Calculator (Public Provident Fund)',
    shortDescription: 'Calculate maturity value and interest earned on Public Provident Fund (PPF) with 15-year statutory compounding.',
    category: 'savings',
    subcategory: 'Government Schemes',
    keywords: ['ppf calculator', 'public provident fund', 'ppf interest', 'ppf maturity calculator', '15 year ppf'],
    route: '/calculators/ppf-calculator',
    formula: 'F = P \\times \\left[ \\frac{(1 + r)^n - 1}{r} \\right] \\times (1 + r)',
    formulaExplanation: 'Interest compounded annually at current government notified rate (7.1% p.a.). Deposits qualify for Section 80C EEE status.',
    inputs: [
      { id: 'yearlyDeposit', label: 'Yearly Deposit', type: 'currency', defaultValue: 150000, min: 500, max: 150000, step: 500, helpText: 'Statutory minimum is ₹500 and maximum is ₹1,50,000 per financial year.' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'percent', defaultValue: 7.1, min: 4, max: 12, step: 0.1, helpText: 'Current official benchmark rate is 7.1% p.a.' },
      { id: 'tenureYears', label: 'Duration', type: 'number', defaultValue: 15, min: 15, max: 30, step: 5, suffix: 'Years', helpText: 'Standard lock-in is 15 years, extendable in 5-year blocks.' },
    ],
    calculate: (inputs) => {
      const deposit = Number(inputs.yearlyDeposit) || 150000;
      const rate = Number(inputs.rate) || 7.1;
      const tenure = Number(inputs.tenureYears) || 15;
      const { totalInvested, totalInterest, maturityAmount, yearlySchedule } = calculatePPF(deposit, rate, tenure);

      return {
        primaryOutput: {
          label: 'Total PPF Maturity Amount',
          value: maturityAmount,
          format: 'currency',
          subtext: `Completely Tax-Free (EEE Status)`,
        },
        breakdownOutputs: [
          { label: 'Total Invested Capital', value: totalInvested, format: 'currency' },
          { label: 'Total Interest Earned', value: totalInterest, format: 'currency' },
          { label: 'Maturity Amount', value: maturityAmount, format: 'currency' },
          { label: 'Interest as % of Corpus', value: roundTo((totalInterest / maturityAmount) * 100, 1), format: 'percent' },
        ],
        chartData: [
          { name: 'Principal Invested', value: totalInvested, color: '#2563EB' },
          { name: 'Interest Accumulated', value: totalInterest, color: '#16A34A' },
        ],
        chartType: 'donut',
        seriesData: yearlySchedule.map((s) => ({
          period: `Yr ${s.year}`,
          Invested: s.invested,
          Balance: s.balance,
        })),
        breakdownSteps: [
          { step: '1. Annual Compounding', detail: `Interest calculated on minimum balance between 5th and end of each month, credited March 31.` },
          { step: '2. EEE Tax Status', detail: 'Exempt on investment, Exempt on interest earned, Exempt at maturity.' },
          { step: '3. 15-Year Maturity', detail: `Depositing ₹${deposit.toLocaleString()}/yr yields ₹${maturityAmount.toLocaleString()} at ${rate}%.` },
        ],
        meaningExplanation:
          'PPF offers sovereign-backed safety with triple tax exemption (EEE). Even though it has a 15-year lock-in, it guarantees steady returns completely immune to stock market volatility.',
        quickTable: {
          headers: ['Year', 'Total Deposit', 'Interest Earned This Year', 'Closing Balance'],
          rows: yearlySchedule.map((s) => [s.year, s.invested, s.interestEarned, s.balance]),
        },
      };
    },
    faq: [
      { question: 'When is the best time of the month to deposit in PPF?', answer: 'Deposit on or before the 5th of every month. Interest is calculated on the minimum balance between the 5th and the last day of the month.' },
      { question: 'Can PPF be extended beyond 15 years?', answer: 'Yes, PPF can be extended indefinitely in blocks of 5 years, with or without continuing fresh contributions.' },
    ],
    assumptions: ['Deposits made at the beginning of each financial year (on or before April 5th) to maximize interest.', 'Interest rate remains at benchmark 7.1% throughout tenure.'],
    tips: ['Deposit between April 1st and April 5th every year to earn interest for all 12 months on that year’s contribution.'],
    commonMistakes: ['Depositing after the 5th of the month and losing an entire month of interest.'],
    stepByStepExample: {
      scenario: 'Depositing maximum ₹1,50,000 every year for 15 years at 7.1%',
      inputs: { 'Annual Deposit': '₹1,50,000', 'Rate': '7.1%', 'Tenure': '15 Years' },
      calculation: 'Total invested = 15 × ₹1,50,000 = ₹22,50,000. Interest compounded = ₹18,18,209.',
      outcome: 'Total Tax-Free Maturity: ₹40,68,209.',
    },
    diagram: {
      title: 'PPF 15-Year Accumulation Cycle',
      steps: ['Deposit by April 5th', 'Monthly Interest Accrual', 'Annual March 31 Crediting', 'Tax-Free Compounded Maturity at 15 Yrs'],
    },
    relatedCalculators: ['epf-calculator', 'sip-calculator', 'fd-calculator', 'income-tax-calculator'],
    seoTitle: 'PPF Calculator – Public Provident Fund Interest & Maturity Estimator',
    metaDescription: 'Calculate your PPF maturity value and year-wise interest earnings under official government scheme rules. 100% tax-free EEE benefits.',
    lastUpdated: '2026-09-12',
    featured: true,
  },

  // 9. Retirement & FIRE Calculator
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    title: 'Retirement & FIRE Corpus Calculator',
    shortDescription: 'Calculate the retirement corpus needed for financial independence, accounting for inflation and monthly lifestyle expenses.',
    category: 'retirement',
    subcategory: 'FIRE & Independence',
    keywords: ['retirement calculator', 'fire calculator', 'financial independence', 'retirement corpus', 'retirement planning'],
    route: '/calculators/retirement-calculator',
    formula: 'Corpus = Annual \\, Expense_{Retirement} \\times \\frac{1 - (1 + r_{real})^{-N}}{r_{real}}',
    formulaExplanation: 'Where r_real is the inflation-adjusted post-retirement return and N is years spent in retirement.',
    inputs: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 70, step: 1, suffix: 'Years' },
      { id: 'retirementAge', label: 'Target Retirement Age', type: 'number', defaultValue: 58, min: 25, max: 80, step: 1, suffix: 'Years' },
      { id: 'lifeExpectancy', label: 'Life Expectancy', type: 'number', defaultValue: 85, min: 60, max: 105, step: 1, suffix: 'Years' },
      { id: 'monthlyExpense', label: 'Current Monthly Living Expenses', type: 'currency', defaultValue: 50000, min: 5000, max: 2000000, step: 5000 },
      { id: 'inflationRate', label: 'Expected Inflation Rate (% p.a.)', type: 'percent', defaultValue: 6, min: 1, max: 15, step: 0.5 },
      { id: 'preReturn', label: 'Pre-Retirement Return (% p.a.)', type: 'percent', defaultValue: 12, min: 4, max: 25, step: 0.5 },
      { id: 'postReturn', label: 'Post-Retirement Return (% p.a.)', type: 'percent', defaultValue: 8, min: 3, max: 18, step: 0.5 },
    ],
    calculate: (inputs) => {
      const curAge = Number(inputs.currentAge) || 30;
      const retAge = Number(inputs.retirementAge) || 58;
      const lifeExp = Number(inputs.lifeExpectancy) || 85;
      const exp = Number(inputs.monthlyExpense) || 50000;
      const inf = Number(inputs.inflationRate) || 6;
      const preRet = Number(inputs.preReturn) || 12;
      const postRet = Number(inputs.postReturn) || 8;

      const res = calculateRetirementCorpus(curAge, retAge, lifeExp, exp, inf, preRet, postRet);

      return {
        primaryOutput: {
          label: 'Required Retirement Corpus',
          value: res.requiredCorpus,
          format: 'currency',
          subtext: `At age ${retAge} to sustain ₹${res.monthlyExpenseAtRetirement.toLocaleString()}/mo`,
        },
        breakdownOutputs: [
          { label: 'Years to Retirement', value: res.yearsToRetire, format: 'number', suffix: ' Years' },
          { label: 'Years in Retirement', value: res.yearsInRetirement, format: 'number', suffix: ' Years' },
          { label: 'Inflated Monthly Expense at Retirement', value: res.monthlyExpenseAtRetirement, format: 'currency' },
          { label: 'Inflated Annual Expense at Retirement', value: res.annualExpenseAtRetirement, format: 'currency' },
          { label: 'Recommended Monthly SIP Today', value: res.requiredMonthlySIP, format: 'currency', subtext: `At ${preRet}% expected CAGR` },
        ],
        chartData: [
          { name: 'Living Expenses Need', value: res.requiredCorpus * 0.7, color: '#2563EB' },
          { name: 'Healthcare & Contingency Buffer', value: res.requiredCorpus * 0.3, color: '#0EA5E9' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Expense Inflation', detail: `Current ₹${exp.toLocaleString()}/mo grows to ₹${res.monthlyExpenseAtRetirement.toLocaleString()}/mo over ${res.yearsToRetire} years at ${inf}% inflation.` },
          { step: '2. Real Post-Retirement Return', detail: `Post-retirement real return = ${(postRet - inf).toFixed(1)}% net of inflation.` },
          { step: '3. Corpus Depletion Buffer', detail: `Corpus of ₹${res.requiredCorpus.toLocaleString()} will fund living expenses until age ${lifeExp}.` },
          { step: '4. Monthly Savings Target', detail: `Requires saving ₹${res.requiredMonthlySIP.toLocaleString()}/month starting today.` },
        ],
        meaningExplanation:
          `Because of inflation, the purchasing power of ₹${exp.toLocaleString()} today will require ₹${res.monthlyExpenseAtRetirement.toLocaleString()} per month when you turn ${retAge}. Starting an investment plan now allows compounding to do the heavy lifting.`,
      };
    },
    faq: [
      { question: 'What is the 4% rule in FIRE?', answer: 'The 4% rule suggests you can safely withdraw 4% of your initial retirement portfolio each year (adjusted for inflation) with minimal risk of running out of money over 30 years.' },
    ],
    assumptions: ['Assumes constant inflation rate and consistent post-retirement real returns.', 'Medical emergencies funded through separate insurance.'],
    tips: ['Health insurance coverage is critical so a medical event does not derail your retirement corpus.'],
    commonMistakes: ['Ignoring lifestyle inflation and longevity risk.'],
    stepByStepExample: {
      scenario: 'Age 30 retiring at 58, ₹50,000 monthly expense, 6% inflation',
      inputs: { 'Current Age': '30', 'Retirement Age': '58', 'Expense': '₹50,000', 'Inflation': '6%' },
      calculation: 'Expense at 58 = ₹2,55,900/mo. To sustain 27 years in retirement requires ~₹4.8 Crore.',
      outcome: 'Corpus Needed: ~₹4.8 Cr | Monthly SIP Needed: ~₹17,500/mo.',
    },
    diagram: {
      title: 'FIRE Timeline',
      steps: ['Accumulation Phase (SIP & Wealth)', 'Peak Wealth Point (Retirement Age)', 'Distribution Phase (SWP)', 'Lifelong Financial Freedom'],
    },
    relatedCalculators: ['sip-calculator', 'inflation-calculator', 'nps-calculator'],
    seoTitle: 'Retirement Calculator – FIRE Corpus & Financial Independence Estimator',
    metaDescription: 'Calculate the retirement corpus and monthly SIP required for complete financial freedom. Factor in inflation, lifestyle expenses, and longevity.',
    lastUpdated: '2026-09-14',
    featured: true,
  },

  // 10. Percentage Calculator
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    shortDescription: 'Calculate percentage of a number, percentage increase/decrease, percentage difference, and ratio conversions.',
    category: 'math',
    subcategory: 'Percentages & Proportions',
    keywords: ['percentage calculator', 'percent increase calculator', 'percent decrease', 'percentage difference', 'marks percentage'],
    route: '/calculators/percentage-calculator',
    formula: 'Percentage = \\frac{Part}{Whole} \\times 100 \\quad | \\quad \\% \\Delta = \\frac{New - Old}{Old} \\times 100',
    formulaExplanation: 'Universal percentage formulas for everyday calculations, financial markups, discounts, and exam grades.',
    inputs: [
      { id: 'mode', label: 'Calculation Type', type: 'select', defaultValue: 'whatIs', options: [{ label: 'What is X% of Y?', value: 'whatIs' }, { label: 'X is what % of Y?', value: 'isWhat' }, { label: 'Percentage Increase / Decrease from X to Y', value: 'change' }] },
      { id: 'valA', label: 'Value X', type: 'number', defaultValue: 15, step: 0.1 },
      { id: 'valB', label: 'Value Y', type: 'number', defaultValue: 2500, step: 0.1 },
    ],
    calculate: (inputs) => {
      const mode = inputs.mode || 'whatIs';
      const a = Number(inputs.valA) || 0;
      const b = Number(inputs.valB) || 0;

      let primaryVal: number = 0;
      let label = '';
      let explanation = '';

      if (mode === 'whatIs') {
        label = `${a}% of ${b}`;
        primaryVal = roundTo((a / 100) * b, 4);
        explanation = `(${a} ÷ 100) × ${b} = ${primaryVal}`;
      } else if (mode === 'isWhat') {
        label = `${a} is what % of ${b}`;
        primaryVal = b !== 0 ? roundTo((a / b) * 100, 2) : 0;
        explanation = `(${a} ÷ ${b}) × 100 = ${primaryVal}%`;
      } else {
        label = `Change from ${a} to ${b}`;
        primaryVal = a !== 0 ? roundTo(((b - a) / Math.abs(a)) * 100, 2) : 0;
        const diff = b - a;
        explanation = `((${b} - ${a}) ÷ ${Math.abs(a)}) × 100 = ${primaryVal}% (${diff >= 0 ? 'Increase' : 'Decrease'} of ${Math.abs(diff)})`;
      }

      return {
        primaryOutput: {
          label: 'Calculated Result',
          value: mode === 'whatIs' ? primaryVal : `${primaryVal}%`,
          format: 'text',
          subtext: label,
        },
        breakdownOutputs: [
          { label: 'Value X', value: a, format: 'number' },
          { label: 'Value Y', value: b, format: 'number' },
          { label: 'Mathematical Formula', value: explanation, format: 'text' },
        ],
        chartData: [
          { name: 'Computed Portion', value: Math.abs(primaryVal), color: '#2563EB' },
          { name: 'Base Reference', value: Math.max(0, b - Math.abs(primaryVal)), color: '#E2E8F0' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: 'Formula Applied', detail: explanation },
          { step: 'Final Derived Value', detail: `${primaryVal}` },
        ],
        meaningExplanation: `The calculation demonstrates how proportion translates into percentages for quick mathematical analysis.`,
      };
    },
    faq: [
      { question: 'How do I calculate a percentage increase?', answer: 'Subtract the old value from the new value, divide by the absolute value of the old value, and multiply by 100.' },
    ],
    assumptions: ['Standard base-10 mathematics.'],
    tips: ['To calculate 10% of any number quickly in your head, simply move the decimal point one place to the left.'],
    commonMistakes: ['Dividing by the new value instead of the original old value when calculating percentage change.'],
    stepByStepExample: {
      scenario: 'Finding 15% discount on ₹2,500',
      inputs: { 'Percentage (X)': '15%', 'Base (Y)': '2,500' },
      calculation: '(15 / 100) × 2,500 = 375.',
      outcome: 'Result: ₹375 discount. Final price = ₹2,125.',
    },
    diagram: {
      title: 'Percentage Conversion',
      steps: ['Input Numerator & Denominator', 'Divide Numbers', 'Multiply by 100', 'Read Percent Result'],
    },
    relatedCalculators: ['cagr-calculator', 'gst-calculator', 'profit-calculator'],
    seoTitle: 'Percentage Calculator – Fast Percentage Increase, Decrease & Change',
    metaDescription: 'Free online percentage calculator. Calculate percent of a number, percentage change, and percentage differences instantly.',
    lastUpdated: '2026-09-01',
    featured: true,
  },

  // 11. CAGR Calculator
  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    title: 'CAGR Calculator (Compound Annual Growth Rate)',
    shortDescription: 'Calculate Compound Annual Growth Rate (CAGR) for mutual funds, stocks, business revenues, and real estate investments.',
    category: 'investment',
    subcategory: 'Investment Returns',
    keywords: ['cagr calculator', 'compound annual growth rate', 'annualized return', 'cagr formula'],
    route: '/calculators/cagr-calculator',
    formula: 'CAGR = \\left( \\frac{End \\, Value}{Start \\, Value} \\right)^{\\frac{1}{n}} - 1',
    formulaExplanation: 'Where n is the number of years between the initial investment and the final valuation.',
    inputs: [
      { id: 'startValue', label: 'Initial Investment Value', type: 'currency', defaultValue: 100000, min: 100, max: 1000000000, step: 1000, helpText: 'Starting capital or beginning value.' },
      { id: 'endValue', label: 'Final Maturity Value', type: 'currency', defaultValue: 320000, min: 100, max: 1000000000, step: 1000, helpText: 'Ending value after n years.' },
      { id: 'years', label: 'Period (Years)', type: 'number', defaultValue: 8, min: 0.1, max: 50, step: 0.5, suffix: 'Years', helpText: 'Duration of the investment.' },
    ],
    calculate: (inputs) => {
      const start = Number(inputs.startValue) || 100000;
      const end = Number(inputs.endValue) || 100000;
      const years = Number(inputs.years) || 1;
      const { cagr, absoluteReturn } = calculateCAGR(start, end, years);
      const totalGain = end - start;

      return {
        primaryOutput: {
          label: 'Compound Annual Growth Rate (CAGR)',
          value: cagr,
          format: 'percent',
          subtext: `Smoothed annual return over ${years} years`,
        },
        breakdownOutputs: [
          { label: 'Initial Value', value: start, format: 'currency' },
          { label: 'Ending Value', value: end, format: 'currency' },
          { label: 'Net Capital Gain', value: totalGain, format: 'currency' },
          { label: 'Absolute Total Return', value: absoluteReturn, format: 'percent' },
          { label: 'Annual Compound Rate', value: cagr, format: 'percent' },
        ],
        chartData: [
          { name: 'Initial Capital', value: start, color: '#2563EB' },
          { name: 'Capital Appreciation', value: Math.max(0, totalGain), color: '#10B981' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Ending to Starting Ratio', detail: `₹${end.toLocaleString()} ÷ ₹${start.toLocaleString()} = ${(end / start).toFixed(4)}` },
          { step: '2. Raise to Exponent (1/n)', detail: `(${(end / start).toFixed(4)})^(1/${years}) = ${(Math.pow(end / start, 1 / years)).toFixed(4)}` },
          { step: '3. Subtract 1 & Convert to Percent', detail: `[${(Math.pow(end / start, 1 / years)).toFixed(4)} - 1] × 100 = ${cagr}%` },
        ],
        meaningExplanation:
          `CAGR dampens the erratic year-to-year swings of investments, giving you the steady annual interest rate that would have grown your money from ₹${start.toLocaleString()} to ₹${end.toLocaleString()} over ${years} years.`,
      };
    },
    faq: [
      { question: 'What is the difference between CAGR and Absolute Return?', answer: 'Absolute return only measures the total percentage gained regardless of time. CAGR measures annualized return, making an 80% gain over 3 years comparable to an 80% gain over 10 years.' },
    ],
    assumptions: ['Assumes profits were fully reinvested throughout the term.', 'Does not account for cash inflows/outflows in between (use XIRR for multiple cashflows).'],
    tips: ['Use CAGR to compare mutual funds against benchmark indices like Nifty 50 or S&P 500 over 5 to 10 year cycles.'],
    commonMistakes: ['Using simple division (Absolute Return / Years) which ignores compounding and drastically overestimates true performance.'],
    stepByStepExample: {
      scenario: '₹1,00,000 grew to ₹3,20,000 in 8 years',
      inputs: { 'Start Value': '₹1,00,000', 'End Value': '₹3,20,000', 'Tenure': '8 Years' },
      calculation: '(3,20,000 / 1,00,000)^(1/8) - 1 = (3.2)^0.125 - 1 = 15.65%.',
      outcome: 'CAGR: 15.65% per year | Absolute Gain: 220%.',
    },
    diagram: {
      title: 'CAGR Geometric Smoothing',
      steps: ['Beginning Capital', 'Annual Volatile Fluctuations', 'Final Realized Value', 'Mathematically Smoothed Compound Line'],
    },
    relatedCalculators: ['sip-calculator', 'lumpsum-calculator', 'percentage-calculator'],
    seoTitle: 'CAGR Calculator – Calculate Compound Annual Growth Rate Online',
    metaDescription: 'Calculate Compound Annual Growth Rate (CAGR) and absolute returns for investments, mutual funds, stocks, and business growth.',
    lastUpdated: '2026-09-05',
  },

  // 12. Gratuity Calculator
  {
    id: 'gratuity-calculator',
    slug: 'gratuity-calculator',
    title: 'Gratuity Calculator',
    shortDescription: 'Calculate gratuity payout under Payment of Gratuity Act, 1972 based on last drawn basic salary and continuous years of service.',
    category: 'salary',
    subcategory: 'Retirement Benefits',
    keywords: ['gratuity calculator', 'payment of gratuity act', 'gratuity formula', 'gratuity eligibility'],
    route: '/calculators/gratuity-calculator',
    formula: 'Gratuity = \\frac{15 \\times Last \\, Drawn \\, Basic \\times Tenure}{26}',
    formulaExplanation: 'Where 26 represents working days in a month, and 15 represents 15 days of wages for every completed year of service.',
    inputs: [
      { id: 'basicSalary', label: 'Last Drawn Monthly Basic + DA', type: 'currency', defaultValue: 60000, min: 1000, max: 2000000, step: 1000, helpText: 'Monthly Basic Salary plus Dearness Allowance (DA).' },
      { id: 'years', label: 'Completed Years of Service', type: 'number', defaultValue: 7, min: 1, max: 45, step: 1, suffix: 'Years', helpText: 'Continuous service with the same employer.' },
    ],
    calculate: (inputs) => {
      const basic = Number(inputs.basicSalary) || 0;
      const years = Number(inputs.years) || 1;
      const res = calculateGratuity(basic, years);

      return {
        primaryOutput: {
          label: 'Gratuity Payable',
          value: res.gratuityAmount,
          format: 'currency',
          subtext: res.eligible ? 'Tax-free statutory payout (Limit ₹20L)' : 'Minimum 5 years required',
        },
        breakdownOutputs: [
          { label: 'Last Drawn Basic Salary', value: basic, format: 'currency' },
          { label: 'Years of Service', value: years, format: 'number', suffix: ' Years' },
          { label: 'Eligibility Status', value: res.eligible ? 'Eligible' : 'Not Yet Eligible', format: 'text' },
          { label: 'Statutory Tax Exemption Cap', value: 2000000, format: 'currency' },
        ],
        chartData: [
          { name: 'Gratuity Payout', value: res.gratuityAmount || res.estimatedGratuity, color: '#16A34A' },
          { name: 'Remaining Tax-Free Headroom', value: Math.max(0, 2000000 - (res.gratuityAmount || res.estimatedGratuity)), color: '#E2E8F0' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Formula Basis', detail: `(15 × Last Basic × Years) ÷ 26` },
          { step: '2. Calculation', detail: `(15 × ₹${basic.toLocaleString()} × ${years}) ÷ 26 = ₹${(res.gratuityAmount || res.estimatedGratuity).toLocaleString()}` },
          { step: '3. Legal Eligibility', detail: res.message },
        ],
        meaningExplanation:
          'Gratuity is a statutory monetary reward paid by an employer to employees who have rendered at least 5 continuous years of dedicated service upon resignation, retirement, or superannuation.',
      };
    },
    faq: [
      { question: 'Is gratuity taxable in India?', answer: 'Gratuity received by government employees is fully tax-exempt. For private sector employees covered under the Act, gratuity up to ₹20,00,000 is 100% tax-free.' },
      { question: 'What if I complete 4 years and 7 months?', answer: 'Under court rulings and common labor practices, service exceeding 6 months in the 5th year is rounded up to 5 full years for gratuity eligibility.' },
    ],
    assumptions: ['Employee covered under Payment of Gratuity Act, 1972.', 'Standard 26 working day divisor.'],
    tips: ['Ensure your HR records reflect the exact date of joining and relieving to capture fractional service rounding correctly.'],
    commonMistakes: ['Including special allowances or bonuses in the gratuity calculation (only Basic + DA qualify).'],
    stepByStepExample: {
      scenario: 'Basic salary ₹60,000 after 7 years of service',
      inputs: { 'Basic Salary': '₹60,000', 'Tenure': '7 Years' },
      calculation: '(15 × 60,000 × 7) / 26 = 63,00,000 / 26 = ₹2,42,308.',
      outcome: 'Gratuity Payout: ₹2,42,308 (completely tax-free).',
    },
    diagram: {
      title: 'Gratuity Entitlement Ladder',
      steps: ['Continuous Service (5+ Years)', 'Last Drawn Basic + DA', 'Multiply by 15/26 per Year', 'Tax-Exempt Settlement'],
    },
    relatedCalculators: ['salary-calculator', 'epf-calculator', 'retirement-calculator'],
    seoTitle: 'Gratuity Calculator – Check Gratuity Amount & Eligibility Rules',
    metaDescription: 'Calculate your exact gratuity payout under Payment of Gratuity Act 1972. Check eligibility conditions and statutory tax-exemption caps.',
    lastUpdated: '2026-09-08',
  },

  // 13. Statistics Dataset Analyzer
  {
    id: 'statistics-calculator',
    slug: 'statistics-calculator',
    title: 'Statistics & Dataset Analyzer',
    shortDescription: 'Analyze any numerical dataset to calculate Mean, Median, Mode, Standard Deviation, Variance, Range, and Quartiles.',
    category: 'statistics',
    subcategory: 'Descriptive Statistics',
    keywords: ['statistics calculator', 'mean median mode calculator', 'standard deviation calculator', 'variance calculator', 'iqr calculator', 'dataset analyzer'],
    route: '/calculators/statistics-calculator',
    formula: '\\bar{x} = \\frac{\\sum x}{n} \\quad | \\quad s = \\sqrt{\\frac{\\sum (x - \\bar{x})^2}{n - 1}}',
    formulaExplanation: 'Computes sample and population central tendencies, dispersion, and quartiles from raw series data.',
    inputs: [
      { id: 'dataInput', label: 'Dataset (Comma or Space Separated)', type: 'textarea', defaultValue: '12, 18, 24, 28, 32, 35, 42, 45, 50, 50, 56, 64, 72, 85', helpText: 'Paste or type numbers separated by commas, spaces, or newlines.' },
    ],
    calculate: (inputs) => {
      const rawText = String(inputs.dataInput || '');
      const numbers = rawText
        .split(/[,\s\n]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n) && isFinite(n));

      const stats = calculateDatasetStats(numbers);

      return {
        primaryOutput: {
          label: 'Sample Mean (Average)',
          value: stats.mean,
          format: 'number',
          subtext: `Median: ${stats.median} · Sample Std Dev: ${stats.stdDevSample}`,
        },
        breakdownOutputs: [
          { label: 'Sample Size (Count n)', value: stats.count, format: 'number' },
          { label: 'Sum of Values (Σx)', value: stats.sum, format: 'number' },
          { label: 'Arithmetic Mean (x̄)', value: stats.mean, format: 'number' },
          { label: 'Median (Middle Value)', value: stats.median, format: 'number' },
          { label: 'Mode (Most Frequent)', value: stats.mode, format: 'text' },
          { label: 'Minimum', value: stats.min, format: 'number' },
          { label: 'Maximum', value: stats.max, format: 'number' },
          { label: 'Range (Max - Min)', value: stats.range, format: 'number' },
          { label: 'Sample Std Deviation (s)', value: stats.stdDevSample, format: 'number' },
          { label: 'Population Std Deviation (σ)', value: stats.stdDevPop, format: 'number' },
          { label: 'Sample Variance (s²)', value: stats.varianceSample, format: 'number' },
          { label: 'First Quartile (Q1)', value: stats.q1, format: 'number' },
          { label: 'Third Quartile (Q3)', value: stats.q3, format: 'number' },
          { label: 'Interquartile Range (IQR)', value: stats.iqr, format: 'number' },
        ],
        chartData: [
          { name: 'Min', value: stats.min, color: '#94A3B8' },
          { name: 'Q1', value: stats.q1, color: '#38BDF8' },
          { name: 'Median', value: stats.median, color: '#2563EB' },
          { name: 'Q3', value: stats.q3, color: '#0EA5E9' },
          { name: 'Max', value: stats.max, color: '#14B8A6' },
        ],
        chartType: 'bar',
        breakdownSteps: [
          { step: '1. Sorted Dataset', detail: numbers.slice(0, 10).join(', ') + (numbers.length > 10 ? `... (${numbers.length} values total)` : '') },
          { step: '2. Mean Computation', detail: `Sum (${stats.sum}) ÷ Count (${stats.count}) = ${stats.mean}` },
          { step: '3. Dispersion', detail: `Sample variance s² = ${stats.varianceSample} → Std Dev s = ${stats.stdDevSample}` },
        ],
        meaningExplanation:
          'Descriptive statistics quantify both the central cluster of your data (Mean & Median) and its spread (Standard Deviation & IQR) to evaluate volatility and consistency.',
      };
    },
    faq: [
      { question: 'When should I use Sample vs Population Standard Deviation?', answer: 'Use Sample Standard Deviation (divided by n - 1) when your data represents a sample of a larger group. Use Population (divided by n) when you have recorded all possible members.' },
    ],
    assumptions: ['Data is numerical and non-empty.'],
    tips: ['If your dataset has extreme outliers, the Median gives a more trustworthy representation of central tendency than the Mean.'],
    commonMistakes: ['Confusing variance with standard deviation (standard deviation is in original units; variance is in squared units).'],
    stepByStepExample: {
      scenario: 'Analyzing scores: 10, 20, 30, 40, 50',
      inputs: { 'Data': '10, 20, 30, 40, 50' },
      calculation: 'Sum = 150. Count = 5. Mean = 30. Median = 30. Sample Std Dev = 15.81.',
      outcome: 'Mean: 30 | Std Dev: 15.81 | Range: 40.',
    },
    diagram: {
      title: 'Statistical Distribution Pipeline',
      steps: ['Input Raw Data Array', 'Sort in Ascending Order', 'Calculate Central Tendency (Mean/Median)', 'Calculate Dispersion (Variance/Std Dev)'],
    },
    relatedCalculators: ['percentage-calculator', 'cagr-calculator'],
    seoTitle: 'Statistics Dataset Analyzer – Mean, Median, Mode & Standard Deviation',
    metaDescription: 'Instant statistics calculator. Paste your dataset to calculate mean, median, mode, sample and population standard deviation, variance, and IQR.',
    lastUpdated: '2026-09-02',
  },

  // 14. Break-Even Calculator
  {
    id: 'break-even-calculator',
    slug: 'break-even-calculator',
    title: 'Break-Even Point Calculator',
    shortDescription: 'Calculate the sales volume and revenue required to cover fixed and variable business costs with zero loss.',
    category: 'business',
    subcategory: 'Commercial Finance',
    keywords: ['break even calculator', 'break even analysis', 'bep calculator', 'contribution margin', 'profit calculator'],
    route: '/calculators/break-even-calculator',
    formula: 'BEP_{units} = \\frac{Fixed \\, Costs}{Price - Variable \\, Cost}',
    formulaExplanation: 'Where Contribution Margin per unit = Unit Sale Price - Variable Cost per unit.',
    inputs: [
      { id: 'fixedCosts', label: 'Total Fixed Costs', type: 'currency', defaultValue: 150000, min: 100, max: 100000000, step: 5000, helpText: 'Rent, salaries, insurance, software, depreciation.' },
      { id: 'unitPrice', label: 'Selling Price Per Unit', type: 'currency', defaultValue: 500, min: 1, max: 1000000, step: 10, helpText: 'Price charged to customer per product/service.' },
      { id: 'variableCost', label: 'Variable Cost Per Unit', type: 'currency', defaultValue: 200, min: 0, max: 1000000, step: 10, helpText: 'Direct material, packaging, and shipping costs per unit.' },
    ],
    calculate: (inputs) => {
      const fixed = Number(inputs.fixedCosts) || 0;
      const price = Number(inputs.unitPrice) || 1;
      const variable = Number(inputs.variableCost) || 0;

      const marginPerUnit = Math.max(0, price - variable);
      const marginRatio = price > 0 ? (marginPerUnit / price) * 100 : 0;
      const bepUnits = marginPerUnit > 0 ? Math.ceil(fixed / marginPerUnit) : 0;
      const bepRevenue = bepUnits * price;

      return {
        primaryOutput: {
          label: 'Break-Even Volume',
          value: `${bepUnits.toLocaleString()} Units`,
          format: 'text',
          subtext: `Break-Even Sales Revenue: ₹${bepRevenue.toLocaleString()}`,
        },
        breakdownOutputs: [
          { label: 'Total Fixed Overhead', value: fixed, format: 'currency' },
          { label: 'Unit Contribution Margin', value: marginPerUnit, format: 'currency' },
          { label: 'Contribution Margin Ratio', value: roundTo(marginRatio, 1), format: 'percent' },
          { label: 'Break-Even Units to Sell', value: bepUnits, format: 'number', suffix: ' Units' },
          { label: 'Break-Even Sales Turnover', value: bepRevenue, format: 'currency' },
        ],
        chartData: [
          { name: 'Fixed Overhead Costs', value: fixed, color: '#DC2626' },
          { name: 'Contribution Margin', value: marginPerUnit * bepUnits, color: '#16A34A' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Unit Contribution Margin', detail: `Selling Price (₹${price}) - Variable Cost (₹${variable}) = ₹${marginPerUnit}/unit` },
          { step: '2. Contribution Ratio', detail: `(₹${marginPerUnit} ÷ ₹${price}) × 100 = ${roundTo(marginRatio, 1)}%` },
          { step: '3. Break-Even Units', detail: `Fixed Costs (₹${fixed.toLocaleString()}) ÷ ₹${marginPerUnit} = ${bepUnits} units` },
        ],
        meaningExplanation:
          `You must produce and sell at least ${bepUnits.toLocaleString()} units (generating ₹${bepRevenue.toLocaleString()} in revenue) to cover all fixed and variable expenses. Every unit sold past this threshold generates pure net profit of ₹${marginPerUnit}.`,
      };
    },
    faq: [
      { question: 'What is contribution margin?', answer: 'Contribution margin is the revenue remaining from each sale after paying for variable direct costs. It contributes directly toward paying off fixed overheads and generating profit.' },
    ],
    assumptions: ['Fixed costs remain constant across the evaluated production volume.', 'Selling price and unit variable cost remain static.'],
    tips: ['Lowering variable production costs or increasing prices directly reduces the number of units needed to break even.'],
    commonMistakes: ['Classifying variable labor as fixed cost or ignoring packaging/delivery fees in unit costs.'],
    stepByStepExample: {
      scenario: 'Fixed costs ₹1,50,000, Price ₹500, Variable Cost ₹200',
      inputs: { 'Fixed Costs': '₹1,50,000', 'Price': '₹500', 'Variable Cost': '₹200' },
      calculation: 'Contribution = ₹500 - ₹200 = ₹300. BEP = ₹1,50,000 / ₹300 = 500 units.',
      outcome: 'Break-Even: 500 units | Break-Even Sales: ₹2,50,000.',
    },
    diagram: {
      title: 'Break-Even Analysis',
      steps: ['Fixed Costs Baseline', 'Variable Costs Accrual', 'Total Cost vs Revenue Crossover', 'Profitable Operating Zone'],
    },
    relatedCalculators: ['gst-calculator', 'percentage-calculator'],
    seoTitle: 'Break-Even Calculator – Break-Even Point in Units & Sales Revenue',
    metaDescription: 'Calculate the exact break-even point in units and sales revenue. Determine contribution margins and target profitability margins.',
    lastUpdated: '2026-09-04',
  },

  // 15. Age Calculator
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    title: 'Age Calculator',
    shortDescription: 'Calculate exact age in years, months, days, total hours, and upcoming birthday countdown with leap year precision.',
    category: 'date-time',
    subcategory: 'Chronology & Age',
    keywords: ['age calculator', 'exact age calculator', 'chronological age', 'birthday calculator', 'date of birth'],
    route: '/calculators/age-calculator',
    formula: 'Age = TargetDate - DateOfBirth \\, (with \\, exact \\, calendar \\, adjustments)',
    formulaExplanation: 'Accurately computes date difference accounting for variable month days (28, 29, 30, 31) and leap years.',
    inputs: [
      { id: 'dob', label: 'Date of Birth', type: 'date', defaultValue: '1998-05-15', helpText: 'Select your birth date.' },
      { id: 'targetDate', label: 'Age as of Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0], helpText: 'Date at which age is evaluated (defaults to today).' },
    ],
    calculate: (inputs) => {
      const dobStr = inputs.dob || '1998-05-15';
      const targetStr = inputs.targetDate || new Date().toISOString().split('T')[0];

      const birth = new Date(dobStr);
      const target = new Date(targetStr);

      if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
        return {
          primaryOutput: { label: 'Age', value: 'Invalid Date Range', format: 'text' },
          breakdownOutputs: [],
          meaningExplanation: 'Date of birth must be prior to the target date.',
        };
      }

      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        // Days in previous month
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffTime = Math.abs(target.getTime() - birth.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;

      // Next Birthday
      let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < target) {
        nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
      }
      const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

      return {
        primaryOutput: {
          label: 'Exact Chronological Age',
          value: `${years} Years, ${months} Months, ${days} Days`,
          format: 'text',
          subtext: `Next birthday in ${daysToNextBday} days`,
        },
        breakdownOutputs: [
          { label: 'Age in Years', value: years, format: 'number', suffix: ' Years' },
          { label: 'Age in Months', value: years * 12 + months, format: 'number', suffix: ' Months' },
          { label: 'Total Lived Weeks', value: totalWeeks, format: 'number', suffix: ' Weeks' },
          { label: 'Total Lived Days', value: totalDays, format: 'number', suffix: ' Days' },
          { label: 'Total Hours', value: totalHours, format: 'number', suffix: ' Hours' },
          { label: 'Days Until Next Birthday', value: daysToNextBday, format: 'number', suffix: ' Days' },
        ],
        chartData: [
          { name: 'Completed Years', value: years, color: '#2563EB' },
          { name: 'Completed Months', value: months, color: '#0EA5E9' },
          { name: 'Completed Days', value: days, color: '#14B8A6' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Year Difference', detail: `${target.getFullYear()} - ${birth.getFullYear()} = ${target.getFullYear() - birth.getFullYear()}` },
          { step: '2. Month/Day Adjustment', detail: `Normalized for calendar month lengths` },
          { step: '3. Total Milestones', detail: `${totalDays.toLocaleString()} days or ${totalHours.toLocaleString()} hours on Earth` },
        ],
        meaningExplanation:
          `You are exactly ${years} years, ${months} months, and ${days} days old today. You will celebrate your next birthday on ${nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      };
    },
    faq: [
      { question: 'How does the calculator handle leap years?', answer: 'The calculator accounts for leap years (including February 29th) using standard astronomical Gregorian calendar logic.' },
    ],
    assumptions: ['Uses the Gregorian calendar system.'],
    tips: ['Government recruitment, insurance applications, and school admissions often specify an exact cutoff age date.'],
    commonMistakes: ['Simply dividing total days by 365, which miscalculates age because of leap years.'],
    stepByStepExample: {
      scenario: 'Born May 15, 1998 as of today',
      inputs: { 'DOB': '1998-05-15', 'As of': '2026-10-01' },
      calculation: '2026 - 1998 = 28 years. Oct - May = 4 months. 1 - 15 = adjust 16 days.',
      outcome: 'Age: 28 Years, 4 Months, 16 Days.',
    },
    diagram: {
      title: 'Age Calculation Chronology',
      steps: ['Date of Birth', 'Calendar Alignment (Leap Years)', 'Month Day Borrowing', 'Exact Years Months Days Result'],
    },
    relatedCalculators: ['retirement-calculator', 'percentage-calculator'],
    seoTitle: 'Age Calculator – Exact Age in Years, Months, Days & Hours',
    metaDescription: 'Find your exact age today in years, months, days, hours, and minutes. See countdown to your upcoming birthday.',
    lastUpdated: '2026-09-01',
  },

  // 16. Fuel Trip Cost Calculator
  {
    id: 'fuel-cost-calculator',
    slug: 'fuel-cost-calculator',
    title: 'Fuel Trip Cost & Mileage Calculator',
    shortDescription: 'Calculate travel fuel cost, total fuel required in liters, and cost per kilometer for road trips and vehicle commutes.',
    category: 'auto-travel',
    subcategory: 'Trip & Fuel',
    keywords: ['fuel cost calculator', 'petrol cost calculator', 'mileage calculator', 'trip cost calculator', 'diesel cost'],
    route: '/calculators/fuel-cost-calculator',
    formula: 'Cost = \\left( \\frac{Distance}{Mileage} \\right) \\times Fuel \\, Price',
    formulaExplanation: 'Where Distance is in km, Mileage is in km per liter, and Fuel Price is user-entered current fuel rate.',
    inputs: [
      { id: 'distance', label: 'Trip Distance (km)', type: 'number', defaultValue: 450, min: 1, max: 20000, step: 5, suffix: 'km', helpText: 'One-way or round-trip driving distance.' },
      { id: 'mileage', label: 'Vehicle Mileage (km/L)', type: 'number', defaultValue: 16, min: 1, max: 100, step: 0.5, suffix: 'km/L', helpText: 'Average fuel efficiency of your car or bike.' },
      { id: 'fuelPrice', label: 'Fuel Price (Per Liter)', type: 'currency', defaultValue: 96.5, min: 10, max: 500, step: 0.5, helpText: 'Enter your local fuel price (petrol/diesel).' },
      { id: 'passengers', label: 'Number of Travelers (for split)', type: 'number', defaultValue: 3, min: 1, max: 50, step: 1, helpText: 'Number of people sharing the trip cost.' },
    ],
    calculate: (inputs) => {
      const dist = Number(inputs.distance) || 0;
      const mil = Number(inputs.mileage) || 1;
      const price = Number(inputs.fuelPrice) || 0;
      const pass = Math.max(1, Number(inputs.passengers) || 1);

      const fuelNeeded = mil > 0 ? dist / mil : 0;
      const totalCost = fuelNeeded * price;
      const costPerKm = dist > 0 ? totalCost / dist : 0;
      const costPerPerson = totalCost / pass;

      return {
        primaryOutput: {
          label: 'Total Trip Fuel Cost',
          value: roundTo(totalCost, 0),
          format: 'currency',
          subtext: `Cost per person: ₹${roundTo(costPerPerson, 0).toLocaleString()} (${pass} travelers)`,
        },
        breakdownOutputs: [
          { label: 'Total Distance', value: dist, format: 'number', suffix: ' km' },
          { label: 'Vehicle Fuel Economy', value: mil, format: 'number', suffix: ' km/L' },
          { label: 'Total Fuel Required', value: roundTo(fuelNeeded, 1), format: 'number', suffix: ' Liters' },
          { label: 'Fuel Price Entered', value: price, format: 'currency', suffix: '/L' },
          { label: 'Cost Per Kilometer', value: roundTo(costPerKm, 2), format: 'currency', suffix: '/km' },
          { label: 'Cost Per Passenger', value: roundTo(costPerPerson, 0), format: 'currency' },
        ],
        chartData: [
          { name: 'Fuel Expenditure', value: totalCost, color: '#2563EB' },
        ],
        chartType: 'donut',
        breakdownSteps: [
          { step: '1. Fuel Consumption', detail: `${dist} km ÷ ${mil} km/L = ${fuelNeeded.toFixed(1)} liters` },
          { step: '2. Total Expense', detail: `${fuelNeeded.toFixed(1)} L × ₹${price} = ₹${roundTo(totalCost, 0).toLocaleString()}` },
          { step: '3. Per Passenger Split', detail: `₹${roundTo(totalCost, 0).toLocaleString()} ÷ ${pass} people = ₹${roundTo(costPerPerson, 0).toLocaleString()}` },
        ],
        meaningExplanation:
          `For a ${dist} km trip with a mileage of ${mil} km/L, your vehicle will consume approximately ${fuelNeeded.toFixed(1)} liters of fuel, costing ₹${roundTo(totalCost, 0).toLocaleString()} in total.`,
      };
    },
    faq: [
      { question: 'Why should I enter my own fuel price?', answer: 'Fuel prices fluctuate by region, state taxes, and international crude changes. Entering your actual pump price gives exact costs.' },
    ],
    assumptions: ['Constant highway/city fuel efficiency as entered.'],
    tips: ['Maintaining optimal tire pressure and driving under 90 km/h improves highway fuel efficiency by 15% to 20%.'],
    commonMistakes: ['Using ARAI certified lab mileage instead of realistic city/highway real-world mileage.'],
    stepByStepExample: {
      scenario: '450 km road trip, 16 km/L mileage, ₹96.50/L petrol, 3 passengers',
      inputs: { 'Distance': '450 km', 'Mileage': '16 km/L', 'Fuel Price': '₹96.50', 'Passengers': '3' },
      calculation: 'Fuel = 450 / 16 = 28.125 L. Total = 28.125 × 96.50 = ₹2,714. Per person = ₹905.',
      outcome: 'Fuel Cost: ₹2,714 | Per Person: ₹905.',
    },
    diagram: {
      title: 'Road Trip Fuel Math',
      steps: ['Route Distance (km)', 'Divide by Real-World Mileage (km/L)', 'Multiply by Pump Fuel Price', 'Split Across Traveling Friends'],
    },
    relatedCalculators: ['break-even-calculator', 'percentage-calculator'],
    seoTitle: 'Fuel Cost Calculator – Calculate Road Trip Petrol & Mileage Costs',
    metaDescription: 'Calculate the total fuel cost and fuel volume required for your road trip. Calculate cost per kilometer and split costs among passengers.',
    lastUpdated: '2026-09-11',
  },
];

export function getAllCalculators(): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY;
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter((c) => c.category === category);
}

export function getFeaturedCalculators(): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter((c) => c.featured);
}
