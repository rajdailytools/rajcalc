import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { Search, Sun, Moon, Compass, Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../utils/formatters';

export const Header: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    currency,
    setCurrency,
    setIsSearchOpen,
    setIsFinderOpen,
    setIsUniversalOpen,
    navigate,
    currentPath,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Calculators', path: '/#all-calculators' },
    { label: 'Categories', path: '/categories' },
    { label: 'Scenario Compare', path: '/compare' },
    { label: 'Goal Planner', path: '/goal-planner' },
    { label: 'Guides', path: '/guides' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Mark */}
        <div className="flex items-center shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-0.5"
            aria-label="RajCalc Home"
          >
            <Logo size="md" showTagline={false} />
          </a>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.path);
                }}
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Calc shortcut */}
          <button
            onClick={() => setIsUniversalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            title="Universal Quick Calculator"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Universal Calc</span>
          </button>

          {/* Calculator Finder shortcut */}
          <button
            onClick={() => setIsFinderOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            title="Find the right calculator"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Finder</span>
          </button>

          {/* Global Search Button with ⌘K */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Search calculators"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Change Currency"
              aria-label="Select currency"
              aria-expanded={currencyDropdownOpen}
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                role="menu"
              >
                <div className="px-3 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Select Currency
                </div>
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      currency === c.code
                        ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-400">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                handleNav(link.path);
              }}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsUniversalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Universal Calc
            </button>
            <button
              onClick={() => {
                setIsFinderOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Calculator Finder
            </button>
          </div>

          <div className="pt-2">
            <PWAInstallButton />
          </div>
        </div>
      )}
    </header>
  );
};
