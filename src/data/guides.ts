export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    qualification: string;
  };
  content: string[];
  keyTakeaways: string[];
  relatedCalculators: string[]; // slugs
}

export const GUIDES: GuideArticle[] = [
  {
    id: 'how-to-reduce-home-loan-interest',
    slug: 'how-to-reduce-home-loan-interest',
    title: 'How to Cut Home Loan Interest by Up to 40% with Strategic Prepayments',
    excerpt:
      'Understanding the mathematical mechanics of reducing balance interest and how making even one extra EMI per year saves lakhs in interest.',
    category: 'Finance & Loans',
    readTime: '6 min read',
    date: 'September 2026',
    author: {
      name: 'Raj Singh Sengar',
      role: 'Founder & Creator',
      qualification: 'B.Sc. + ITI',
    },
    keyTakeaways: [
      'In a 20-year home loan at 8.5%, total interest paid often matches or exceeds the principal borrowed.',
      'Prepaying just 1 additional EMI every calendar year reduces tenure from 20 years down to approximately 16 years.',
      'Increasing your monthly EMI by 5% each year alongside salary appraisals cuts total interest outgo by over 35%.',
      'All prepayments in reducing balance loans reduce the principal directly, preventing future compounding interest on that amount.',
    ],
    content: [
      'When you take a 20-year home loan of ₹50 Lakh at an 8.5% interest rate, your monthly EMI comes to approximately ₹43,391. Over 240 months, you will repay ₹1.04 Crore—meaning you pay ₹54.1 Lakh purely in interest, more than the principal itself!',
      'The reason for this immense interest burden lies in how amortization schedules operate. During the initial 5 to 7 years, over 70% of each monthly installment goes toward servicing accumulated interest, and only a small fraction reduces your principal debt balance.',
      'Strategy 1: The One Extra EMI Trick. By paying just 13 installments a year instead of 12 (or prepaying one full EMI once a year from an annual bonus or tax refund), you directly trim the principal. On a ₹50L loan, this simple habit saves over ₹12 Lakh in interest and retires the loan nearly 4 years ahead of schedule.',
      'Strategy 2: The 5% Annual EMI Step-Up. As your career progresses and your compensation increases, instruct your bank to increase your monthly EMI by 5% to 8% annually. This accelerates debt reduction exponentially, bringing a 20-year liability down to under 12 years.',
      'Always confirm with your lender that there are zero prepayment penalties on floating rate home loans, as mandated by the Reserve Bank of India (RBI).',
    ],
    relatedCalculators: ['home-loan-emi-calculator', 'emi-calculator'],
  },
  {
    id: 'sip-vs-lumpsum-investment-guide',
    slug: 'sip-vs-lumpsum-investment-guide',
    title: 'SIP vs Lumpsum: The Mathematical Compounding Comparison',
    excerpt:
      'Explore how Rupee Cost Averaging protects against market volatility and when lumpsum deployment outperforms systematic installments.',
    category: 'Investment',
    readTime: '5 min read',
    date: 'September 2026',
    author: {
      name: 'Raj Singh Sengar',
      role: 'Founder & Creator',
      qualification: 'B.Sc. + ITI',
    },
    keyTakeaways: [
      'SIP leverages Rupee Cost Averaging, allowing you to acquire more units during market dips and fewer units during peaks.',
      'In a secular bull market, lumpsum mathematically beats SIP because 100% of the capital compounds from day one.',
      'For salaried professionals with monthly cashflow, Step-Up SIP provides the highest real-world wealth generation.',
      'Never pause SIPs during severe market crashes—that is mathematically when your capital purchases units at peak value discounts.',
    ],
    content: [
      'One of the most frequent debates in personal finance is whether to invest a lump sum or deploy money gradually through a Systematic Investment Plan (SIP).',
      'From a purely statistical perspective, in an upward trending asset class, lumpsum investment historically outperforms SIP roughly 65% of the time. This is because all capital begins compounding immediately rather than sitting in cash yielding low interest.',
      'However, behavioral psychology is rarely purely mathematical. If an investor deploys a large lump sum right before a 20% market correction, fear often leads them to panic and sell at the bottom. A SIP eliminates this emotional hazard entirely.',
      'Through Rupee Cost Averaging, your fixed monthly allocation automatically purchases more mutual fund units when Net Asset Values (NAV) are depressed and fewer units when NAVs are high. Over a 10 to 15 year horizon, this disciplined accumulation builds tremendous compounded wealth.',
    ],
    relatedCalculators: ['sip-calculator', 'step-up-sip-calculator', 'cagr-calculator'],
  },
  {
    id: 'old-vs-new-tax-regime-complete-guide',
    slug: 'old-vs-new-tax-regime-complete-guide',
    title: 'Old vs New Tax Regime: The Decision Framework for FY 2026-27',
    excerpt:
      'Evaluate your salary structure, Section 80C, 80D, HRA deductions, and standard deduction of ₹75,000 to choose the optimal tax regime.',
    category: 'Tax',
    readTime: '7 min read',
    date: 'September 2026',
    author: {
      name: 'Raj Singh Sengar',
      role: 'Founder & Creator',
      qualification: 'B.Sc. + ITI',
    },
    keyTakeaways: [
      'Under the New Tax Regime for salaried taxpayers, the standard deduction is ₹75,000.',
      'With the Section 87A rebate, annual gross income up to ₹7.75 Lakh is completely tax-free under the New Regime.',
      'The breakeven deduction threshold where Old Regime becomes beneficial is approximately ₹3.75 Lakh to ₹4.0 Lakh.',
      'Unless you have substantial rent (HRA) and home loan interest (Section 24b), the New Regime usually yields higher in-hand cash.',
    ],
    content: [
      'Choosing between the Old and New Tax Regime is no longer guesswork. The government has positioned the New Tax Regime as the default choice with concessional tax slabs and zero requirement for investment proofs.',
      'Key Highlights of the New Tax Regime: Salaried individuals receive a flat standard deduction of ₹75,000. Under Section 87A rebate rules, taxable income up to ₹7,00,000 pays zero tax. Combining standard deduction and rebate means any salaried individual earning up to ₹7,75,000 pays ₹0 income tax.',
      'When Does the Old Regime Win? The Old Tax Regime only becomes beneficial if your total eligible exemptions exceed the breakeven threshold. For example, if you claim: Section 80C (₹1.5 Lakh) + Section 80D Mediclaim (₹25,000) + HRA Rent Exemption (₹1.5 Lakh) + Standard Deduction (₹50,000) = ₹3.75 Lakh in total deductions.',
      'If your aggregate deductions fall below this threshold, shifting to the New Regime will almost certainly increase your net monthly in-hand salary with zero paperwork hassle.',
    ],
    relatedCalculators: ['income-tax-calculator', 'salary-calculator'],
  },
];

export function getAllGuides(): GuideArticle[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
