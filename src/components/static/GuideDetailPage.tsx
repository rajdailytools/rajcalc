import React from 'react';
import { useApp } from '../../context/AppContext';
import { getGuideBySlug } from '../../data/guides';
import { getCalculatorBySlug } from '../../data/calculatorRegistry';
import { AuthorBox } from '../common/AuthorBox';
import { Clock, CheckCircle2, ArrowRight, Share2, Check } from 'lucide-react';

interface GuideDetailPageProps {
  guideSlug: string;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guideSlug }) => {
  const { navigate } = useApp();
  const guide = getGuideBySlug(guideSlug);
  const [copied, setCopied] = React.useState(false);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Guide Not Found</h2>
        <p className="text-slate-500 text-sm">The requested guide could not be located.</p>
        <button
          onClick={() => navigate('/guides')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          View All Guides
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-blue-600">
          Home
        </a>
        <span>/</span>
        <a href="/guides" onClick={(e) => { e.preventDefault(); navigate('/guides'); }} className="hover:text-blue-600">
          Guides
        </a>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 truncate font-medium">{guide.title}</span>
      </nav>

      {/* Guide Header */}
      <header className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>{guide.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400 font-normal">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTime}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {guide.title}
        </h1>

        <div className="text-xs text-slate-500">
          Published by <strong className="text-slate-700 dark:text-slate-300">{guide.author.name}</strong> ({guide.author.qualification}) · {guide.date}
        </div>
      </header>

      {/* Key Takeaways Callout */}
      <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-3">
        <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200 uppercase tracking-wider text-[11px]">
          Executive Key Takeaways
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {guide.keyTakeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Prose Content */}
      <div className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        {guide.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Recommended Calculators */}
      {guide.relatedCalculators && guide.relatedCalculators.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
            Test the Math with Dedicated Calculators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.relatedCalculators.map((slug) => {
              const c = getCalculatorBySlug(slug);
              if (!c) return null;
              return (
                <button
                  key={slug}
                  onClick={() => navigate(`/calculators/${slug}`)}
                  className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{c.shortDescription}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Author Attribution */}
      <AuthorBox />

    </article>
  );
};
