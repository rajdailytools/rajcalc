import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { calculateEMI, calculateLumpsum, calculateSIP } from '../../utils/mathEngine';
import { formatCurrency, roundTo } from '../../utils/formatters';

export const UniversalCalculatorModal: React.FC = () => {
  const { isUniversalOpen, setIsUniversalOpen, currency, navigate } = useApp();

  const [amount, setAmount] = useState<number>(500000);
  const [rate, setRate] = useState<number>(10);
  const [timeYears, setTimeYears] = useState<number>(5);

  if (!isUniversalOpen) return null;

  // Real Multi-Model Calculations:
  // 1. Simple Interest
  const simpleInterest = (amount * rate * timeYears) / 100;
  const simpleTotal = amount + simpleInterest;

  // 2. Compound Interest (Compounded Annually)
  const compoundRes = calculateLumpsum(amount, rate, timeYears, 1);

  // 3. Loan EMI (as if borrowing Amount at Rate for Time)
  const emiRes = calculateEMI(amount, rate, timeYears);

  // 4. Monthly SIP (as if investing Amount / (timeYears * 12) or lump deposit)
  const sipRes = calculateSIP(roundTo(amount / (timeYears * 12), 0), rate, timeYears);

  const handleLaunch = (slug: string) => {
    navigate(`/calculators/${slug}`);
    setIsUniversalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsUniversalOpen(false)}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Universal Calculator Panel</h3>
              <p className="text-xs text-slate-500">Enter Amount, Rate & Time to evaluate 4 financial models simultaneously</p>
            </div>
          </div>
          <button
            onClick={() => setIsUniversalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Bar */}
        <div className="p-6 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Base Capital / Amount ({currency})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Annual Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Time Duration (Years)
            </label>
            <input
              type="number"
              value={timeYears}
              onChange={(e) => setTimeYears(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 4 Multi-Model Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Loan EMI */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                If Borrowed as a Loan
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Reducing Balance EMI</h4>
              <div className="mt-3 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(emiRes.emi, currency)}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total Interest: {formatCurrency(emiRes.totalInterest, currency)} · Total Repayment: {formatCurrency(emiRes.totalPayment, currency)}
              </p>
            </div>
            <button
              onClick={() => handleLaunch('emi-calculator')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Open EMI Calculator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Compound Growth */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                If Invested as Lumpsum
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Compound Interest Maturity</h4>
              <div className="mt-3 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(compoundRes.maturityValue, currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Interest Gain: {formatCurrency(compoundRes.totalGains, currency)} ({roundTo((compoundRes.totalGains / amount) * 100, 1)}% net gain)
              </p>
            </div>
            <button
              onClick={() => handleLaunch('cagr-calculator')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <span>Explore Growth Rates</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Simple Interest */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Fixed Deposit / Simple Return
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Simple Interest Total</h4>
              <div className="mt-3 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(simpleTotal, currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Simple Interest Earned: {formatCurrency(simpleInterest, currency)} at {rate}% flat
              </p>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Difference from Compound: {formatCurrency(compoundRes.maturityValue - simpleTotal, currency)} less
            </div>
          </div>

          {/* 4. Systematic SIP Equivalent */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                If Invested Systematically
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Equivalent Monthly SIP</h4>
              <div className="mt-3 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(sipRes.maturityValue, currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Deposit {formatCurrency(roundTo(amount / (timeYears * 12), 0), currency)}/mo for {timeYears} years
              </p>
            </div>
            <button
              onClick={() => handleLaunch('sip-calculator')}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Open SIP Calculator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
