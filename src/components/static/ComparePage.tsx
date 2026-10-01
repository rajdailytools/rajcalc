import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateEMI, calculateSIP } from '../../utils/mathEngine';
import { formatCurrency, formatPercent, roundTo } from '../../utils/formatters';
import { Layers, ArrowRight, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import { AuthorBox } from '../common/AuthorBox';

export const ComparePage: React.FC = () => {
  const { currency, navigate } = useApp();
  const [mode, setMode] = useState<'loan' | 'invest'>('loan');

  // Scenario A Loan
  const [loanA_P, setLoanA_P] = useState(2500000);
  const [loanA_r, setLoanA_r] = useState(8.5);
  const [loanA_t, setLoanA_t] = useState(20);

  // Scenario B Loan
  const [loanB_P, setLoanB_P] = useState(2500000);
  const [loanB_r, setLoanB_r] = useState(7.9);
  const [loanB_t, setLoanB_t] = useState(20);

  // Scenario A Invest
  const [invA_p, setInvA_p] = useState(10000);
  const [invA_r, setInvA_r] = useState(12);
  const [invA_t, setInvA_t] = useState(15);

  // Scenario B Invest
  const [invB_p, setInvB_p] = useState(15000);
  const [invB_r, setInvB_r] = useState(12);
  const [invB_t, setInvB_t] = useState(15);

  // Calculations
  const loanA = calculateEMI(loanA_P, loanA_r, loanA_t);
  const loanB = calculateEMI(loanB_P, loanB_r, loanB_t);
  const loanInterestDiff = loanA.totalInterest - loanB.totalInterest;
  const loanEmiDiff = loanA.emi - loanB.emi;

  const invA = calculateSIP(invA_p, invA_r, invA_t);
  const invB = calculateSIP(invB_p, invB_r, invB_t);
  const invCorpusDiff = invB.maturityValue - invA.maturityValue;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          Financial Comparison Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Scenario Comparison
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Evaluate two distinct financial scenarios side-by-side with real interest savings and wealth multipliers.
        </p>
      </div>

      {/* Switcher */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
        <button
          onClick={() => setMode('loan')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'loan'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Compare Loan Offers
        </button>
        <button
          onClick={() => setMode('invest')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'invest'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Compare Investment Strategies
        </button>
      </div>

      {/* Loan Comparison View */}
      {mode === 'loan' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Scenario A Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Scenario A</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Standard Offer</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Loan Principal ({currency})</label>
                <input
                  type="number"
                  value={loanA_P}
                  onChange={(e) => setLoanA_P(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.05"
                  value={loanA_r}
                  onChange={(e) => setLoanA_r(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Tenure (Years)</label>
                <input
                  type="number"
                  value={loanA_t}
                  onChange={(e) => setLoanA_t(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Monthly EMI</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(loanA.emi, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Interest Outgo</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(loanA.totalInterest, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Cost of Loan</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(loanA.totalPayment, currency)}</strong>
                </div>
              </div>
            </div>

            {/* Scenario B Card */}
            <div className="p-6 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-sky-900">
                <h3 className="font-bold text-base text-sky-950 dark:text-sky-200">Scenario B</h3>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">Negotiated / Alternative</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Loan Principal ({currency})</label>
                <input
                  type="number"
                  value={loanB_P}
                  onChange={(e) => setLoanB_P(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.05"
                  value={loanB_r}
                  onChange={(e) => setLoanB_r(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Tenure (Years)</label>
                <input
                  type="number"
                  value={loanB_t}
                  onChange={(e) => setLoanB_t(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-sky-100 dark:border-sky-900 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Monthly EMI</span>
                  <strong className="font-mono text-sky-700 dark:text-sky-300">{formatCurrency(loanB.emi, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Interest Outgo</span>
                  <strong className="font-mono text-sky-700 dark:text-sky-300">{formatCurrency(loanB.totalInterest, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Cost of Loan</span>
                  <strong className="font-mono text-sky-700 dark:text-sky-300">{formatCurrency(loanB.totalPayment, currency)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Savings Callout */}
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                Net Difference in Total Interest
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                {loanInterestDiff >= 0
                  ? `Scenario B Saves ${formatCurrency(loanInterestDiff, currency)}`
                  : `Scenario A Saves ${formatCurrency(Math.abs(loanInterestDiff), currency)}`}
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1">
                Monthly EMI difference: {formatCurrency(Math.abs(loanEmiDiff), currency)} / month
              </p>
            </div>
            <button
              onClick={() => navigate('/calculators/emi-calculator')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Open Full Amortization Schedule →
            </button>
          </div>
        </div>
      )}

      {/* Investment Comparison View */}
      {mode === 'invest' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Scenario A Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Strategy A
              </h3>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Monthly Deposit ({currency})</label>
                <input
                  type="number"
                  value={invA_p}
                  onChange={(e) => setInvA_p(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={invA_r}
                  onChange={(e) => setInvA_r(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Duration (Years)</label>
                <input
                  type="number"
                  value={invA_t}
                  onChange={(e) => setInvA_t(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Invested</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(invA.totalInvested, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Maturity Corpus</span>
                  <strong className="font-mono text-blue-600 dark:text-blue-400">{formatCurrency(invA.maturityValue, currency)}</strong>
                </div>
              </div>
            </div>

            {/* Scenario B Card */}
            <div className="p-6 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-teal-950 dark:text-teal-200 pb-3 border-b border-teal-100 dark:border-teal-900">
                Strategy B
              </h3>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Monthly Deposit ({currency})</label>
                <input
                  type="number"
                  value={invB_p}
                  onChange={(e) => setInvB_p(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={invB_r}
                  onChange={(e) => setInvB_r(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Duration (Years)</label>
                <input
                  type="number"
                  value={invB_t}
                  onChange={(e) => setInvB_t(Number(e.target.value))}
                  className="mt-1 w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-teal-100 dark:border-teal-900 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Invested</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(invB.totalInvested, currency)}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Maturity Corpus</span>
                  <strong className="font-mono text-teal-600 dark:text-teal-400">{formatCurrency(invB.maturityValue, currency)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Corpus Callout */}
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider block mb-1">
                Net Wealth Multiplier Difference
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-teal-700 dark:text-teal-400">
                {invCorpusDiff >= 0
                  ? `Strategy B Builds ${formatCurrency(invCorpusDiff, currency)} Extra Wealth`
                  : `Strategy A Builds ${formatCurrency(Math.abs(invCorpusDiff), currency)} Extra Wealth`}
              </div>
            </div>
            <button
              onClick={() => navigate('/calculators/sip-calculator')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Open Full SIP Calculator →
            </button>
          </div>
        </div>
      )}

      {/* Author Box */}
      <AuthorBox />

    </div>
  );
};
