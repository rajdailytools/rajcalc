import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Home, ArrowRight, HelpCircle } from 'lucide-react';
import { CALCULATOR_REGISTRY } from '../../data/calculatorRegistry';

export const NotFoundPage: React.FC = () => {
  const { navigate, setIsSearchOpen } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-in fade-in duration-150">
      
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-2xl font-bold font-mono">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Calculator or Page Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The calculation formula or URL you were looking for does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search All Calculators</span>
        </button>
      </div>

      {/* Recommended Calculators */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Or try one of these popular calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CALCULATOR_REGISTRY.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/calculators/${c.slug}`)}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-colors text-left flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                  {c.title}
                </div>
                <div className="text-[10px] text-slate-400">{c.subcategory}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
