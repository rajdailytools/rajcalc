import React from 'react';
import { useApp } from '../../context/AppContext';
import { CALCULATOR_REGISTRY } from '../../data/calculatorRegistry';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';
import { FileCode, ExternalLink } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const { navigate } = useApp();

  const staticPages = [
    { title: 'Home', path: '/' },
    { title: 'All Categories', path: '/categories' },
    { title: 'Scenario Comparison Tool', path: '/compare' },
    { title: 'Financial Goal Planner', path: '/goal-planner' },
    { title: 'Learning Hub & Guides', path: '/guides' },
    { title: 'About RajCalc', path: '/about' },
    { title: 'Contact Support', path: '/contact' },
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Financial Disclaimer', path: '/disclaimer' },
    { title: 'Copyright Notice', path: '/copyright' },
    { title: 'Advertising Policy', path: '/advertising-policy' },
    { title: 'Accessibility Statement', path: '/accessibility' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      
      <div className="pb-8 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Index & Navigation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            HTML Sitemap
          </h1>
          <p className="mt-2 text-xs text-slate-500 font-mono">
            Structured directory of all indexable pages on https://rajcalc.com
          </p>
        </div>

        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors w-fit"
        >
          <FileCode className="w-4 h-4" />
          <span>View XML Sitemap</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Static Core Pages */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Primary Platform Pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {staticPages.map((p) => (
            <button
              key={p.path}
              onClick={() => navigate(p.path)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Category Hubs (15 Domains)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/category/${c.slug}`)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Calculators Registry */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          All Calculators ({CALCULATOR_REGISTRY.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CALCULATOR_REGISTRY.map((calc) => (
            <button
              key={calc.id}
              onClick={() => navigate(`/calculators/${calc.slug}`)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {calc.title}
            </button>
          ))}
        </div>
      </section>

      {/* Educational Guides */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Guides & Learning Hub Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/guides/${g.slug}`)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {g.title}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
