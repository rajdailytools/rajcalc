import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthorBox } from '../common/AuthorBox';
import { ShieldCheck, Cpu, Lock, Eye, Mail, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          About RajCalc
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Dedicated to Pure, Transparent Calculation
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          RajCalc is an independent online calculation platform built to bring clarity, speed, and accuracy to financial planning, mathematics, loans, taxes, and everyday computations.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Absolute Client-Side Privacy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All calculations occur exclusively in your web browser. Your private salary figures, debt balances, savings goals, and investment assets are never logged or transmitted to an external server.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Formula Transparency</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every calculator features an open Formula Explorer, step-by-step arithmetic substitution, and explicit disclosure of statutory assumptions (such as standard deductions or official compounding frequencies).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Sponsored Biases</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            RajCalc does not steer calculations to favor particular banking products, lenders, or investment houses. The results are mathematical truths derived from the exact numbers you input.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Synthetic Clutter</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            No fake review widgets, fabricated user counters, or intrusive popups. Just pristine tools designed to help you calculate, understand, and plan.
          </p>
        </div>

      </div>

      {/* Narrative Section */}
      <section className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Why Was RajCalc Created?</h2>
        <p>
          Too many online calculators today are cluttered with aggressive promotional loan offers, misleading flat-interest claims, and opaque black-box formulas that don&apos;t explain where numbers come from.
        </p>
        <p>
          RajCalc was developed as a clean, reliable alternative. Whether you are a first-time homebuyer evaluating your 20-year EMI, a salaried professional decoding your CTC offer letter, or a student solving percentage problems, RajCalc provides instant, honest answers with visual step-by-step clarity.
        </p>
      </section>

      {/* Founder Box */}
      <AuthorBox />

      {/* Contact Quick Link */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Have a Suggestion or Found a Bug?</h4>
          <p className="text-xs text-slate-500 mt-0.5">We welcome feedback, formula corrections, and calculator requests.</p>
        </div>
        <button
          onClick={() => navigate('/contact')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0"
        >
          Contact the Creator →
        </button>
      </div>

    </div>
  );
};
