import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CALCULATOR_REGISTRY } from '../../data/calculatorRegistry';
import { Search, X, Calculator, ArrowRight, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const normalized = query.toLowerCase().trim();
  const filtered = normalized
    ? CALCULATOR_REGISTRY.filter((calc) => {
        return (
          calc.title.toLowerCase().includes(normalized) ||
          calc.shortDescription.toLowerCase().includes(normalized) ||
          calc.subcategory.toLowerCase().includes(normalized) ||
          calc.keywords.some((k) => k.toLowerCase().includes(normalized))
        );
      })
    : CALCULATOR_REGISTRY.slice(0, 8); // show popular initial items

  const handleSelect = (slug: string) => {
    navigate(`/calculators/${slug}`);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].slug);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search home loan, SIP, tax, salary, percentage..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No calculators found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((calc, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={calc.id}
                  onClick={() => handleSelect(calc.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-start justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span>{calc.title}</span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {calc.subcategory}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {calc.shortDescription}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400 translate-x-0.5'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Instant client-side index ({CALCULATOR_REGISTRY.length} verified calculators)</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};
