import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorDefinition } from '../../types/calculator';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { ResponsiveDonutChart } from '../charts/ResponsiveDonutChart';
import { ResponsiveLineChart } from '../charts/ResponsiveLineChart';
import { AuthorBox } from '../common/AuthorBox';
import {
  Heart,
  Share2,
  Printer,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  AlertTriangle,
  Layers,
  Sliders,
  Copy,
} from 'lucide-react';
import { getCategoryById } from '../../data/categories';
import { getCalculatorBySlug } from '../../data/calculatorRegistry';

interface CalculatorPageProps {
  calc: CalculatorDefinition;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ calc }) => {
  const {
    currency,
    favorites,
    toggleFavorite,
    isFavorite,
    addToHistory,
    navigate,
  } = useApp();

  // Primary Inputs State
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    calc.inputs.forEach((inp) => {
      initial[inp.id] = inp.defaultValue;
    });
    return initial;
  });

  // Scenario Comparison Mode
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareInputs, setCompareInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    calc.inputs.forEach((inp) => {
      initial[inp.id] = inp.defaultValue;
    });
    return initial;
  });

  // UI accordion toggles
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync inputs when calculator changes
  useEffect(() => {
    const initial: Record<string, any> = {};
    calc.inputs.forEach((inp) => {
      initial[inp.id] = inp.defaultValue;
    });
    setInputs(initial);
    setCompareInputs(initial);
    setCompareMode(false);
  }, [calc.slug]);

  // Handle Input Changes
  const handleInputChange = (id: string, val: any) => {
    setInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleCompareInputChange = (id: string, val: any) => {
    setCompareInputs((prev) => ({ ...prev, [id]: val }));
  };

  const resetInputs = () => {
    const initial: Record<string, any> = {};
    calc.inputs.forEach((inp) => {
      initial[inp.id] = inp.defaultValue;
    });
    setInputs(initial);
  };

  // Run Calculations
  const result = useMemo(() => {
    try {
      return calc.calculate(inputs, { currency });
    } catch {
      return {
        primaryOutput: { label: 'Calculation Error', value: '—', format: 'text' as const },
        breakdownOutputs: [],
        meaningExplanation: 'Please check your inputs for validity.',
      };
    }
  }, [calc, inputs, currency]);

  // Run Comparison Calculation
  const compareResult = useMemo(() => {
    if (!compareMode) return null;
    try {
      return calc.calculate(compareInputs, { currency });
    } catch {
      return null;
    }
  }, [calc, compareInputs, compareMode, currency]);

  // Log calculation to History
  useEffect(() => {
    if (result && result.primaryOutput.value !== '—') {
      const timer = setTimeout(() => {
        addToHistory({
          calculatorId: calc.id,
          calculatorTitle: calc.title,
          slug: calc.slug,
          inputs,
          primaryResult: `${result.primaryOutput.label}: ${result.primaryOutput.value}`,
          currency,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [result, calc.id, calc.slug, calc.title, currency]);

  // Helper formatter
  const renderFormatted = (val: number | string, format: string) => {
    if (typeof val === 'string' && isNaN(Number(val))) return val;
    if (format === 'currency') return formatCurrency(val, currency);
    if (format === 'percent') return formatPercent(val);
    if (format === 'number') return formatNumber(val);
    return val;
  };

  // Share calculation URL
  const handleShare = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const categoryInfo = getCategoryById(calc.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4" aria-label="Breadcrumb">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Home
        </a>
        <span aria-hidden="true">/</span>
        <a
          href={`/category/${calc.category}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/category/${calc.category}`);
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {categoryInfo?.name || calc.category}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {calc.title}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>{calc.subcategory}</span>
            <span>·</span>
            <span className="text-slate-400 font-normal">Updated {calc.lastUpdated}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {calc.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDescription}
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleFavorite(calc.slug)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isFavorite(calc.slug)
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorite(calc.slug) ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite(calc.slug) ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy share link"
            aria-label="Share calculation"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors print-hide"
            title="Print calculation report"
            aria-label="Print report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector: Single vs Compare */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setCompareMode(false)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              !compareMode
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Single Calculation
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              compareMode
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Scenarios (A vs B)</span>
          </button>
        </div>

        <button
          onClick={resetInputs}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Calculation Engine Layout (Two-Column Desktop) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Interactive Inputs */}
        <div className={`space-y-6 ${compareMode ? 'lg:col-span-6' : 'lg:col-span-7'}`}>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs print-card">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {compareMode ? 'Scenario A Parameters' : 'Calculation Parameters'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Currency: {currency}</span>
            </div>

            <div className="space-y-5">
              {calc.inputs.map((inp) => {
                const currentVal = inputs[inp.id] !== undefined ? inputs[inp.id] : inp.defaultValue;

                return (
                  <div key={inp.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`input-${inp.id}`}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                      >
                        <span>{inp.label}</span>
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {inp.type === 'currency'
                          ? formatCurrency(currentVal, currency)
                          : inp.type === 'percent'
                          ? `${currentVal}%`
                          : `${currentVal} ${inp.suffix || ''}`}
                      </span>
                    </div>

                    {/* Number / Currency / Percent Input with Slider */}
                    {(inp.type === 'currency' || inp.type === 'number' || inp.type === 'percent') && (
                      <div className="space-y-2">
                        <div className="relative">
                          {inp.type === 'currency' && (
                            <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">
                              {currency}
                            </span>
                          )}
                          <input
                            id={`input-${inp.id}`}
                            type="number"
                            value={currentVal}
                            min={inp.min}
                            max={inp.max}
                            step={inp.step || 1}
                            onChange={(e) => handleInputChange(inp.id, Number(e.target.value))}
                            className={`w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono tabular-nums ${
                              inp.type === 'currency' ? 'pl-14 pr-4' : 'px-3.5'
                            }`}
                          />
                        </div>

                        {/* What-If Slider */}
                        {inp.min !== undefined && inp.max !== undefined && (
                          <div className="px-1">
                            <input
                              type="range"
                              min={inp.min}
                              max={inp.max}
                              step={inp.step || 1}
                              value={currentVal}
                              onChange={(e) => handleInputChange(inp.id, Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              aria-label={`${inp.label} slider`}
                            />
                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                              <span>
                                {inp.type === 'currency'
                                  ? formatCurrency(inp.min, currency, { compact: true })
                                  : `${inp.min}${inp.suffix || ''}`}
                              </span>
                              <span>
                                {inp.type === 'currency'
                                  ? formatCurrency(inp.max, currency, { compact: true })
                                  : `${inp.max}${inp.suffix || ''}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Select Dropdown */}
                    {inp.type === 'select' && inp.options && (
                      <select
                        id={`input-${inp.id}`}
                        value={currentVal}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        {inp.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Date Picker */}
                    {inp.type === 'date' && (
                      <input
                        id={`input-${inp.id}`}
                        type="date"
                        value={currentVal}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    )}

                    {/* Textarea */}
                    {inp.type === 'textarea' && (
                      <textarea
                        id={`input-${inp.id}`}
                        rows={4}
                        value={currentVal}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {inp.helpText && (
                      <p className="text-[11px] text-slate-400 leading-tight">{inp.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario B Parameters if Compare Mode is ON */}
          {compareMode && (
            <div className="p-6 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/60 shadow-xs print-card">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-100 dark:border-sky-900">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="font-bold text-sm text-sky-900 dark:text-sky-200">
                    Scenario B Parameters
                  </h3>
                </div>
                <span className="text-xs text-sky-500 font-mono">Alternate Comparison</span>
              </div>

              <div className="space-y-5">
                {calc.inputs.map((inp) => {
                  const currentVal =
                    compareInputs[inp.id] !== undefined ? compareInputs[inp.id] : inp.defaultValue;

                  return (
                    <div key={`compare-${inp.id}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`compare-input-${inp.id}`}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {inp.label}
                        </label>
                        <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300">
                          {inp.type === 'currency'
                            ? formatCurrency(currentVal, currency)
                            : inp.type === 'percent'
                            ? `${currentVal}%`
                            : `${currentVal} ${inp.suffix || ''}`}
                        </span>
                      </div>

                      {(inp.type === 'currency' || inp.type === 'number' || inp.type === 'percent') && (
                        <div className="space-y-2">
                          <input
                            id={`compare-input-${inp.id}`}
                            type="number"
                            value={currentVal}
                            min={inp.min}
                            max={inp.max}
                            step={inp.step || 1}
                            onChange={(e) =>
                              handleCompareInputChange(inp.id, Number(e.target.value))
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono tabular-nums"
                          />

                          {inp.min !== undefined && inp.max !== undefined && (
                            <input
                              type="range"
                              min={inp.min}
                              max={inp.max}
                              step={inp.step || 1}
                              value={currentVal}
                              onChange={(e) =>
                                handleCompareInputChange(inp.id, Number(e.target.value))
                              }
                              className="w-full h-1.5 bg-sky-200 dark:bg-sky-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
                            />
                          )}
                        </div>
                      )}

                      {inp.type === 'select' && inp.options && (
                        <select
                          id={`compare-input-${inp.id}`}
                          value={currentVal}
                          onChange={(e) => handleCompareInputChange(inp.id, e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sm font-semibold text-slate-900 dark:text-white"
                        >
                          {inp.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Premium Result Card & Charts */}
        <div className={`space-y-6 ${compareMode ? 'lg:col-span-6' : 'lg:col-span-5'}`}>
          
          {/* Main Primary Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-700 text-white shadow-lg relative overflow-hidden print-card">
            <div className="relative z-10">
              <span className="text-xs font-semibold text-sky-100 uppercase tracking-wider block mb-1">
                {result.primaryOutput.label}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums">
                {renderFormatted(result.primaryOutput.value, result.primaryOutput.format)}
              </div>
              {result.primaryOutput.subtext && (
                <p className="text-xs text-sky-100 mt-2 font-medium">
                  {result.primaryOutput.subtext}
                </p>
              )}
            </div>

            {/* Subtle background glow */}
            <div
              className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* If Comparison Mode: Side-by-Side Delta Card */}
          {compareMode && compareResult && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Scenario Comparison Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">Scenario A</span>
                  <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                    {renderFormatted(result.primaryOutput.value, result.primaryOutput.format)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">Scenario B</span>
                  <div className="text-base font-bold font-mono text-sky-600 dark:text-sky-400">
                    {renderFormatted(compareResult.primaryOutput.value, compareResult.primaryOutput.format)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Breakdown Stats Grid */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs print-card">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Detailed Breakdown
            </h4>
            <div className="space-y-3">
              {result.breakdownOutputs.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block">
                      {item.label}
                    </span>
                    {item.subtext && (
                      <span className="text-[10px] text-slate-400">{item.subtext}</span>
                    )}
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {renderFormatted(item.value, item.format)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Chart Card */}
          {result.chartData && result.chartData.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Visual Composition
              </h4>
              <ResponsiveDonutChart data={result.chartData} currency={currency} />
            </div>
          )}

          {/* Area / Growth Trajectory Chart */}
          {result.seriesData && result.seriesData.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Timeline Trajectory
              </h4>
              <ResponsiveLineChart
                data={result.seriesData}
                currency={currency}
                lines={[
                  { key: 'Principal', color: '#2563EB', label: 'Principal Paid' },
                  { key: 'Balance', color: '#0EA5E9', label: 'Remaining Balance' },
                  { key: 'Invested', color: '#2563EB', label: 'Invested Capital' },
                  { key: 'Total Value', color: '#10B981', label: 'Total Value' },
                ].filter((l) => result.seriesData && result.seriesData[0] && result.seriesData[0][l.key] !== undefined)}
              />
            </div>
          )}

          {/* Explanation Callout */}
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 mb-1">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>What This Result Means</span>
            </div>
            {result.meaningExplanation}
          </div>

        </div>
      </div>

      {/* 5. Step-by-Step Calculation Breakdown */}
      {result.breakdownSteps && result.breakdownSteps.length > 0 && (
        <section className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Step-by-Step Calculation Walkthrough
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.breakdownSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {step.step}
                </div>
                <div className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Formula Explorer (Collapsible) */}
      <section className="mt-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <button
          onClick={() => setFormulaOpen(!formulaOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          aria-expanded={formulaOpen}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              fx
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Mathematical Formula Explorer
            </span>
          </div>
          {formulaOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {formulaOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto">
              <code>{calc.formula}</code>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {calc.formulaExplanation}
            </p>
          </div>
        )}
      </section>

      {/* 7. Visual Process Flowchart Diagram */}
      {calc.diagram && (
        <section className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {calc.diagram.title}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 overflow-x-auto py-2">
            {calc.diagram.steps.map((st, i) => (
              <React.Fragment key={i}>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center w-full sm:w-auto sm:flex-1 shrink-0">
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold block mb-1">
                    0{i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {st}
                  </span>
                </div>
                {i < calc.diagram.steps.length - 1 && (
                  <ArrowRight className="hidden sm:block w-4 h-4 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* 8. Quick Reference Data Table */}
      {result.quickTable && (
        <section className="mt-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Schedule & Reference Table
            </h3>
            <button
              onClick={() => setTableOpen(!tableOpen)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {tableOpen ? 'Collapse Table' : 'Expand Table'}
            </button>
          </div>

          {tableOpen && (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {result.quickTable.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`py-3 px-4 font-semibold text-slate-700 dark:text-slate-200 ${
                          i > 0 ? 'text-right' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.quickTable.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 font-mono transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-4 tabular-nums ${
                            cIdx === 0
                              ? 'font-sans font-semibold text-slate-900 dark:text-white'
                              : 'text-right text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {typeof cell === 'number' && cIdx > 0
                            ? formatNumber(cell)
                            : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* 9. Real-World Worked Example */}
      {calc.stepByStepExample && (
        <section className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Real-Life Case Study Example
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">
            Scenario: {calc.stepByStepExample.scenario}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Sample Parameters Used:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 font-mono">
                {Object.entries(calc.stepByStepExample.inputs).map(([k, v]) => (
                  <li key={k}>
                    {k}: <strong className="text-slate-900 dark:text-white">{v}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <span className="font-bold text-blue-900 dark:text-blue-300 block mb-2">
                Derived Outcome:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {calc.stepByStepExample.calculation}
              </p>
              <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-900/60 font-bold text-blue-700 dark:text-blue-400">
                {calc.stepByStepExample.outcome}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. Assumptions & Tips Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Assumptions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-3">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Key Assumptions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
            {calc.assumptions.map((as, i) => (
              <li key={i}>{as}</li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-3">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>Optimization Tips</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
            {calc.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-400 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Common Pitfalls</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
            {calc.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 11. Frequently Asked Questions (FAQ) */}
      {calc.faq && calc.faq.length > 0 && (
        <section className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {calc.faq.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
              >
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {item.question}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. Related Calculators */}
      {calc.relatedCalculators && calc.relatedCalculators.length > 0 && (
        <section className="mt-12">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Related Calculators You May Find Helpful
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {calc.relatedCalculators.map((relSlug) => {
              const relCalc = getCalculatorBySlug(relSlug);
              if (!relCalc) return null;

              return (
                <a
                  key={relSlug}
                  href={`/calculators/${relSlug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/calculators/${relSlug}`);
                  }}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xs transition-all block group"
                >
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                    {relCalc.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {relCalc.shortDescription}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 13. Author Box */}
      <div className="mt-12">
        <AuthorBox />
      </div>

    </div>
  );
};
