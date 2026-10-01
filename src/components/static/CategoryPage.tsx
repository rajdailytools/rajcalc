import React from 'react';
import { useApp } from '../../context/AppContext';
import { getCategoryBySlug, CATEGORIES } from '../../data/categories';
import { getCalculatorsByCategory } from '../../data/calculatorRegistry';
import { GUIDES } from '../../data/guides';
import { ArrowRight, Calculator, CheckCircle2, BookOpen } from 'lucide-react';
import { AuthorBox } from '../common/AuthorBox';

interface CategoryPageProps {
  categorySlug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug }) => {
  const { navigate } = useApp();
  const cat = getCategoryBySlug(categorySlug) || CATEGORIES[0];
  const calcs = getCalculatorsByCategory(cat.id);
  const relatedGuides = GUIDES.filter((g) =>
    g.category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-150">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
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
          href="/categories"
          onClick={(e) => {
            e.preventDefault();
            navigate('/categories');
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Categories
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">{cat.name}</span>
      </nav>

      {/* Category Header */}
      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          Category Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {cat.name} Calculators
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {cat.detailedDescription}
        </p>
      </div>

      {/* Calculators Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Available {cat.name} Tools ({calcs.length})
          </h2>
        </div>

        {calcs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
            More calculators in this category are actively being verified. Check out our popular calculators on the homepage.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calcs.map((c) => (
              <a
                key={c.id}
                href={`/calculators/${c.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/calculators/${c.slug}`);
                }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {c.subcategory}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {c.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Open Calculator →
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Related Educational Guides */}
      {relatedGuides.length > 0 && (
        <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white mb-4">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Related Educational Guides</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedGuides.map((g) => (
              <button
                key={g.id}
                onClick={() => navigate(`/guides/${g.slug}`)}
                className="text-left p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">{g.title}</div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1">{g.excerpt}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Author Box */}
      <AuthorBox />

    </div>
  );
};
