import { CategoryInfo } from '../types/calculator';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'finance',
    name: 'Finance & Loans',
    slug: 'finance',
    iconName: 'Landmark',
    shortDescription: 'Calculate EMIs, home loans, loan affordability, prepayments, and amortizations.',
    detailedDescription:
      'Plan your debt smartly with accurate loan EMI calculations, prepayment impact modeling, and comprehensive amortization schedules for home, car, personal, and business loans.',
  },
  {
    id: 'investment',
    name: 'Investment & Mutual Funds',
    slug: 'investment',
    iconName: 'TrendingUp',
    shortDescription: 'SIP, Step-Up SIP, Lumpsum, Mutual Fund returns, CAGR, and Compound Interest.',
    detailedDescription:
      'Model compounding wealth growth with precision. Explore regular and step-up SIPs, lumpsum deposits, annualized compound growth rates (CAGR), and systematic withdrawal plans (SWP).',
  },
  {
    id: 'savings',
    name: 'Savings & Govt Schemes',
    slug: 'savings',
    iconName: 'PiggyBank',
    shortDescription: 'PPF, EPF, NPS, Fixed Deposits, Recurring Deposits, and Post Office schemes.',
    detailedDescription:
      'Accurate estimators for government-backed savings options adhering to official interest formulas for PPF (15-year rules), EPF employee-employer split, NPS corpus, FD, and RD.',
  },
  {
    id: 'tax',
    name: 'Income Tax',
    slug: 'tax',
    iconName: 'Receipt',
    shortDescription: 'Compare Old vs New Tax Regimes (FY 2026-27), slabs, standard deductions, and cess.',
    detailedDescription:
      'Transparent income tax calculators updated for the latest fiscal years (FY 2026-27 / AY 2027-28). Compare old vs new regimes, HRA exemptions, Section 80C, 80D, and 87A rebate eligibility.',
  },
  {
    id: 'gst',
    name: 'GST & Business Tax',
    slug: 'gst',
    iconName: 'Percent',
    shortDescription: 'GST inclusive, exclusive, CGST, SGST, IGST split, and invoice calculations.',
    detailedDescription:
      'Easily calculate Goods and Services Tax for all tax brackets (5%, 12%, 18%, 28%) with reverse tax calculations, intrastate vs interstate splits, and invoice breakdowns.',
  },
  {
    id: 'salary',
    name: 'Salary & Income',
    slug: 'salary',
    iconName: 'Wallet',
    shortDescription: 'CTC to In-Hand salary, PF deductions, Gratuity, HRA, and bonus calculators.',
    detailedDescription:
      'Demystify your salary offer letter. Convert annual CTC into monthly take-home salary with accurate breakdowns of Basic pay, HRA, Employee PF, Employer PF, Professional Tax, and Gratuity.',
  },
  {
    id: 'retirement',
    name: 'Retirement & FIRE',
    slug: 'retirement',
    iconName: 'ShieldCheck',
    shortDescription: 'Retirement corpus, FIRE, Coast FIRE, inflation-adjusted post-retirement expenses.',
    detailedDescription:
      'Plan your financial independence with realistic retirement corpus modeling accounting for longevity, pre- and post-retirement returns, and monthly lifestyle expense inflation.',
  },
  {
    id: 'inflation',
    name: 'Inflation & Money Value',
    slug: 'inflation',
    iconName: 'Flame',
    shortDescription: 'Future value of money, real rate of return, and purchasing power erosion.',
    detailedDescription:
      'Understand how inflation diminishes cash over 10, 20, or 30 years. Calculate the true purchasing power of your future corpus and evaluate real (inflation-adjusted) investment returns.',
  },
  {
    id: 'math',
    name: 'Math & Numbers',
    slug: 'math',
    iconName: 'Binary',
    shortDescription: 'Percentage increase/decrease, ratios, fractions, LCM/HCF, powers, and roots.',
    detailedDescription:
      'Everyday and advanced mathematical tools: percentage changes, ratios, prime factorizations, greatest common divisors, factorials, permutations, and algebraic calculations.',
  },
  {
    id: 'property',
    name: 'Construction & Property',
    slug: 'property',
    iconName: 'Building',
    shortDescription: 'Area conversion, construction cost estimator, bricks, cement, and rental yield.',
    detailedDescription:
      'Estimate civil construction material quantities (cement bags, bricks, sand), carpet to super built-up area conversion, and property investment metrics like gross and net rental yield.',
  },
  {
    id: 'auto-travel',
    name: 'Auto & Travel',
    slug: 'auto-travel',
    iconName: 'Car',
    shortDescription: 'Fuel trip cost, mileage (km/l), EV charging cost vs petrol, running cost.',
    detailedDescription:
      'Calculate fuel expenses for road trips, measure actual vehicle fuel economy, compare electric vehicle (EV) charging costs against gasoline, and compute vehicle cost per kilometer.',
  },
  {
    id: 'education',
    name: 'Education & Grades',
    slug: 'education',
    iconName: 'GraduationCap',
    shortDescription: 'CGPA to percentage, attendance target calculator, GPA, and marks percentages.',
    detailedDescription:
      'Academic tools for school and college students: convert CGPA to percentage using university formulas, calculate required attendance to reach 75% or 80%, and track semester marks.',
  },
  {
    id: 'date-time',
    name: 'Date & Time',
    slug: 'date-time',
    iconName: 'Calendar',
    shortDescription: 'Age calculator, days between dates, working business days, and time conversion.',
    detailedDescription:
      'Precise date math handling leap years and variable month lengths: compute exact age in years, months, and days, count working business days between deadlines, and time duration math.',
  },
  {
    id: 'statistics',
    name: 'Statistics & Data',
    slug: 'statistics',
    iconName: 'BarChart2',
    shortDescription: 'Mean, median, mode, standard deviation, variance, IQR, and dataset analyzer.',
    detailedDescription:
      'Paste your dataset directly to analyze summary statistics: mean, median, modes, sample & population standard deviation, variance, range, first and third quartiles, and IQR.',
  },
  {
    id: 'business',
    name: 'Business & Everyday',
    slug: 'business',
    iconName: 'Briefcase',
    shortDescription: 'Break-even point, profit margin vs markup, tip split, and ROI calculators.',
    detailedDescription:
      'Commercial decision tools: calculate business break-even sales volume, differentiate profit margin from markup, calculate return on investment (ROI), and split bills cleanly.',
  },
];

export function getCategoryById(id: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
