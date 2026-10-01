import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CALCULATOR_REGISTRY, getFeaturedCalculators } from '../../data/calculatorRegistry';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';
import {
  Search,
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  Landmark,
  Receipt,
  Wallet,
  ShieldCheck,
  Binary,
  Clock,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';
import { AuthorBox } from '../common/AuthorBox';

export const HomePage: React.FC = () => {
  const {
    navigate,
    setIsSearchOpen,
    setIsFinderOpen,
    setIsUniversalOpen,
    history,
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const featured = getFeaturedCalculators();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setIsSearchOpen(true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-150">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent dark:from-blue-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>High-Precision Online Calculator Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Smart Calculations. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
              Simple Answers.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Calculate loans, investments, taxes, salary, percentages, retirement goals and more with fast, transparent and easy-to-understand calculators.
          </p>

          {/* Interactive Hero Search Form */}
          <div className="mt-8 max-w-xl mx-auto">
            <form
              onSubmit={handleHeroSubmit}
              onClick={() => setIsSearchOpen(true)}
              className="relative flex items-center cursor-pointer group"
            >
              <Search className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
              <input
                type="text"
                readOnly
                placeholder="Search home loan, SIP, income tax, salary, percentages..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 cursor-pointer group-hover:border-blue-500 transition-all focus:outline-hidden"
              />
              <span className="absolute right-3 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs">
                Search
              </span>
            </form>
          </div>

          {/* Quick Triggers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsUniversalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Universal Calc Panel</span>
            </button>

            <button
              onClick={() => setIsFinderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Calculator Finder</span>
            </button>

            <button
              onClick={() => navigate('/compare')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Scenario Comparison</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Popular Calculators Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="all-calculators">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Popular Tools
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Most Frequently Used Calculators
            </h2>
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Browse all calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((calc) => (
            <a
              key={calc.id}
              href={`/calculators/${calc.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/calculators/${calc.slug}`);
              }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {calc.subcategory}
                  </span>
                  <span className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {calc.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {calc.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Real-time Verified Math</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                  Calculate Now →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Recently Used Calculations (LocalStorage) */}
      {history.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Your Recent Calculations (Stored Privately in Browser)</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {history.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/calculators/${item.slug}`)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left shrink-0 hover:border-blue-500 transition-colors text-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {item.calculatorTitle}
                  </div>
                  <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 truncate max-w-[180px] mt-0.5">
                    {item.primaryResult}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Complete Categories Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Browse by Domain
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            15 Dedicated Calculator Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Every calculator follows a verified formula architecture with detailed breakdowns and assumptions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/category/${cat.slug}`);
              }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all block group"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {cat.shortDescription}
              </p>
              <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View tools</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. Popular Educational Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Learning Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Understand the Math Behind the Numbers
            </h2>
          </div>
          <button
            onClick={() => navigate('/guides')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Read all guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <article
              key={guide.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>{guide.category}</span>
                  <span>·</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {guide.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {guide.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">By {guide.author.name}</span>
                <button
                  onClick={() => navigate(`/guides/${guide.slug}`)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Why RajCalc Philosophy & Transparency Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Transparency & Privacy First
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Calculations Built on Rigorous Formulas, Never Biased Algorithms
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              RajCalc runs calculations 100% locally in your browser. We never collect or store your private salary, loan balances, or financial inputs on remote servers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Zero server transmission of financial data</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Configurable rates and year-aware tax slabs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Interactive What-If sliders and visual graphs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Full offline support with installable PWA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Author Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthorBox />
      </section>

    </div>
  );
};
