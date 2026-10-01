import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateLumpsum } from '../../utils/mathEngine';
import { formatCurrency, roundTo } from '../../utils/formatters';
import { Target, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ResponsiveDonutChart } from '../charts/ResponsiveDonutChart';
import { AuthorBox } from '../common/AuthorBox';

export const GoalPlannerPage: React.FC = () => {
  const { currency, navigate } = useApp();

  const [goalAmount, setGoalAmount] = useState<number>(5000000);
  const [currentSavings, setCurrentSavings] = useState<number>(500000);
  const [currentMonthlySIP, setCurrentMonthlySIP] = useState<number>(15000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(12);

  // Future value of existing savings
  const fvSavings = calculateLumpsum(currentSavings, rate, years).maturityValue;

  // Remaining shortfall at target year
  const remainingGoal = Math.max(0, goalAmount - fvSavings);

  // Required monthly SIP to bridge the shortfall
  const monthlyRate = rate / 12 / 100;
  const totalMonths = years * 12;

  let requiredMonthlySIP = 0;
  if (remainingGoal > 0 && monthlyRate > 0) {
    requiredMonthlySIP =
      (remainingGoal * monthlyRate) /
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate));
  } else if (remainingGoal > 0) {
    requiredMonthlySIP = remainingGoal / totalMonths;
  }

  // Future value of current monthly SIP
  let fvCurrentSIP = 0;
  if (monthlyRate > 0) {
    fvCurrentSIP =
      currentMonthlySIP *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
  } else {
    fvCurrentSIP = currentMonthlySIP * totalMonths;
  }

  const projectedTotal = fvSavings + fvCurrentSIP;
  const isGoalReached = projectedTotal >= goalAmount;
  const shortfallOrSurplus = projectedTotal - goalAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          Goal Architecture Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Financial Goal Planner
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Determine whether your current savings trajectory will reach your life milestone and calculate the exact monthly investment required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="lg:col-span-7 space-y-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Goal Parameters</h3>
            <span className="text-xs text-slate-400 font-mono">Currency: {currency}</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Goal Amount ({currency})
            </label>
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
              className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Existing Savings ({currency})
              </label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Monthly Investment ({currency})
              </label>
              <input
                type="number"
                value={currentMonthlySIP}
                onChange={(e) => setCurrentMonthlySIP(Number(e.target.value))}
                className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Time Horizon (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Expected Annual Return (% p.a.)
              </label>
              <input
                type="number"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Outcome Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div
            className={`p-6 rounded-2xl border shadow-lg text-white ${
              isGoalReached
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-500'
                : 'bg-gradient-to-br from-blue-600 to-slate-800 border-blue-500'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
              {isGoalReached ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>On Track to Reach Milestone</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-200" />
                  <span>Additional Savings Required</span>
                </>
              )}
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
              {isGoalReached
                ? `Surplus of ${formatCurrency(shortfallOrSurplus, currency)}`
                : `Need ${formatCurrency(roundTo(requiredMonthlySIP, 0), currency)}/mo`}
            </div>

            <p className="text-xs mt-2 text-slate-100 leading-relaxed">
              {isGoalReached
                ? `Your existing savings and monthly investment are projected to accumulate ${formatCurrency(roundTo(projectedTotal, 0), currency)} over ${years} years, surpassing your ${formatCurrency(goalAmount, currency)} target!`
                : `To hit your ${formatCurrency(goalAmount, currency)} milestone in ${years} years at ${rate}% CAGR, you need to invest a total of ${formatCurrency(roundTo(requiredMonthlySIP, 0), currency)} every month.`}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Projections Breakdown
            </h4>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Current Savings at Maturity</span>
              <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(roundTo(fvSavings, 0), currency)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Existing SIP at Maturity</span>
              <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(roundTo(fvCurrentSIP, 0), currency)}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Total Projected Wealth</span>
              <strong className="font-mono text-blue-600 dark:text-blue-400">{formatCurrency(roundTo(projectedTotal, 0), currency)}</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Target Goal Amount</span>
              <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(goalAmount, currency)}</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Author Box */}
      <AuthorBox />

    </div>
  );
};
