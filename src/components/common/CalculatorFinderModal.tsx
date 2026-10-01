import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Compass, ArrowRight, Landmark, TrendingUp, Receipt, Wallet, ShieldCheck, Binary, Car, Calendar, Briefcase } from 'lucide-react';

interface FinderDomain {
  id: string;
  name: string;
  icon: any;
  description: string;
  options: { label: string; subtext: string; slug: string }[];
}

export const CalculatorFinderModal: React.FC = () => {
  const { isFinderOpen, setIsFinderOpen, navigate } = useApp();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  if (!isFinderOpen) return null;

  const domains: FinderDomain[] = [
    {
      id: 'loan',
      name: 'Loans & EMI',
      icon: Landmark,
      description: 'Borrowing, monthly payments, debt payoff, or interest',
      options: [
        { label: 'Calculate Monthly Loan EMI', subtext: 'General reducing balance loan', slug: 'emi-calculator' },
        { label: 'Home Loan / Mortgage Plan', subtext: '15 to 30-year housing finance', slug: 'home-loan-emi-calculator' },
        { label: 'Compare Two Loan Offers', subtext: 'Different interest rates & tenures', slug: 'emi-calculator' },
      ],
    },
    {
      id: 'invest',
      name: 'Investments & Returns',
      icon: TrendingUp,
      description: 'Mutual funds, compounding wealth, or growth rate',
      options: [
        { label: 'Monthly SIP in Mutual Funds', subtext: 'Systematic rupee cost averaging', slug: 'sip-calculator' },
        { label: 'Step-Up / Top-Up SIP', subtext: 'Increase deposit with salary growth', slug: 'step-up-sip-calculator' },
        { label: 'Annual Compound Growth (CAGR)', subtext: 'Measure actual portfolio return', slug: 'cagr-calculator' },
        { label: 'Public Provident Fund (PPF)', subtext: 'Government 15-year tax-free plan', slug: 'ppf-calculator' },
      ],
    },
    {
      id: 'tax',
      name: 'Taxes & GST',
      icon: Receipt,
      description: 'Income tax regimes, deductions, slabs, or business GST',
      options: [
        { label: 'Compare Old vs New Tax Regime', subtext: 'Updated for FY 2026-27 / AY 2027-28', slug: 'income-tax-calculator' },
        { label: 'Add or Remove GST', subtext: '5%, 12%, 18%, 28% inclusive & exclusive', slug: 'gst-calculator' },
      ],
    },
    {
      id: 'salary',
      name: 'Salary & Compensation',
      icon: Wallet,
      description: 'Offer letter CTC, take-home pay, or gratuity',
      options: [
        { label: 'CTC to Monthly In-Hand Salary', subtext: 'Net take-home after PF & TDS', slug: 'salary-calculator' },
        { label: 'Gratuity Payout After 5+ Years', subtext: 'Under Payment of Gratuity Act', slug: 'gratuity-calculator' },
      ],
    },
    {
      id: 'retirement',
      name: 'Retirement & FIRE',
      icon: ShieldCheck,
      description: 'Corpus needed for financial independence',
      options: [
        { label: 'Retirement Corpus & Monthly SIP', subtext: 'Factor in inflation and longevity', slug: 'retirement-calculator' },
      ],
    },
    {
      id: 'math',
      name: 'Math & Everyday',
      icon: Binary,
      description: 'Percentages, datasets, trip fuel, or age',
      options: [
        { label: 'Percentage & % Difference', subtext: 'Fast percentage increase/decrease', slug: 'percentage-calculator' },
        { label: 'Statistics & Dataset Analyzer', subtext: 'Mean, median, standard deviation', slug: 'statistics-calculator' },
        { label: 'Road Trip Fuel Cost & Mileage', subtext: 'Cost per km and passenger split', slug: 'fuel-cost-calculator' },
        { label: 'Exact Age & Birthday Countdown', subtext: 'Years, months, days, and hours', slug: 'age-calculator' },
      ],
    },
  ];

  const currentDomainObj = domains.find((d) => d.id === selectedDomain);

  const handleLaunch = (slug: string) => {
    navigate(`/calculators/${slug}`);
    setIsFinderOpen(false);
    setSelectedDomain(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => {
        setIsFinderOpen(false);
        setSelectedDomain(null);
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Calculator Finder</h3>
              <p className="text-xs text-slate-500">What do you want to calculate?</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsFinderOpen(false);
              setSelectedDomain(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!selectedDomain ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Step 1: Choose a Category
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {domains.map((dom) => {
                  const Icon = dom.icon;
                  return (
                    <button
                      key={dom.id}
                      onClick={() => setSelectedDomain(dom.id)}
                      className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {dom.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {dom.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 2: Choose Exact Calculation
                </span>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Back to Categories
                </button>
              </div>

              <div className="space-y-2">
                {currentDomainObj?.options.map((opt) => (
                  <button
                    key={opt.slug}
                    onClick={() => handleLaunch(opt.slug)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {opt.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.subtext}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
