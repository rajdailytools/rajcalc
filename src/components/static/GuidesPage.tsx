import React from 'react';
import { useApp } from '../../context/AppContext';
import { GUIDES } from '../../data/guides';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { AuthorBox } from '../common/AuthorBox';

export const GuidesPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          Knowledge Base & Learning Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Financial & Mathematical Guides
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Deepen your computational understanding. Clear explanations of loan amortizations, compounding formulas, tax slab mechanisms, and wealth planning strategies.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GUIDES.map((guide) => (
          <article
            key={guide.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{guide.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {guide.title}
              </h2>

              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {guide.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">By {guide.author.name}</span>
              <button
                onClick={() => navigate(`/guides/${guide.slug}`)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Author Box */}
      <AuthorBox />

    </div>
  );
};
