import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CalculatorFinderModal } from './components/common/CalculatorFinderModal';
import { UniversalCalculatorModal } from './components/common/UniversalCalculatorModal';

// Pages
import { HomePage } from './components/home/HomePage';
import { CalculatorPage } from './components/calculator/CalculatorPage';
import { CategoryPage } from './components/static/CategoryPage';
import { ComparePage } from './components/static/ComparePage';
import { GoalPlannerPage } from './components/static/GoalPlannerPage';
import { GuidesPage } from './components/static/GuidesPage';
import { GuideDetailPage } from './components/static/GuideDetailPage';
import { AboutPage } from './components/static/AboutPage';
import { ContactPage } from './components/static/ContactPage';
import { LegalPage } from './components/static/LegalPage';
import { NotFoundPage } from './components/static/NotFoundPage';
import { SitemapPage } from './components/static/SitemapPage';

// Registry
import { getCalculatorBySlug } from './data/calculatorRegistry';
import { CATEGORIES } from './data/categories';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // Normalize path
  const path = currentPath.replace(/\/+$/, '') || '/';

  // Dynamic SEO title & Meta Description update
  useEffect(() => {
    let title = 'RajCalc – Smart Calculations. Simple Answers.';
    let description =
      'Calculate loans, investments, taxes, salary, retirement, math, and everyday finances with fast, transparent, and easy-to-understand calculators.';

    if (path.startsWith('/calculators/')) {
      const slug = path.replace('/calculators/', '');
      const calc = getCalculatorBySlug(slug);
      if (calc) {
        title = `${calc.seoTitle} | RajCalc`;
        description = calc.metaDescription;
      }
    } else if (path.startsWith('/category/')) {
      const catSlug = path.replace('/category/', '');
      const cat = CATEGORIES.find((c) => c.slug === catSlug);
      if (cat) {
        title = `${cat.name} Calculators – Free Online Tools | RajCalc`;
        description = cat.detailedDescription;
      }
    } else if (path === '/categories') {
      title = 'All 15 Calculator Categories | RajCalc';
      description = 'Explore all 15 specialized calculator categories on RajCalc.';
    } else if (path === '/compare') {
      title = 'Financial Scenario Comparison Tool | RajCalc';
      description = 'Compare loan offers and investment compounding strategies side-by-side with exact savings calculations.';
    } else if (path === '/goal-planner') {
      title = 'Financial Goal Planner & SIP Target Calculator | RajCalc';
      description = 'Calculate required monthly savings to achieve your life goals on time.';
    } else if (path === '/guides') {
      title = 'Financial & Math Guides | RajCalc';
      description = 'Understand the mathematical mechanisms of reducing balance interest, SIP rupee cost averaging, and income tax slabs.';
    } else if (path === '/about') {
      title = 'About RajCalc – Founder & Mission | RajCalc';
      description = 'Learn about RajCalc, founded by Raj Singh Sengar (B.Sc. + ITI), dedicated to transparent, privacy-first calculation.';
    } else if (path === '/contact') {
      title = 'Contact Support & Feedback | RajCalc';
      description = 'Get in touch with RajCalc for suggestions, corrections, or custom calculator requests.';
    } else if (path === '/privacy-policy') {
      title = 'Privacy Policy – Zero Server Transmission | RajCalc';
      description = 'RajCalc processes all financial calculations client-side in your browser for absolute data privacy.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [path]);

  // Route matching
  const renderCurrentView = () => {
    // 1. Homepage
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    // 2. Calculator Pages (/calculators/:slug)
    if (path.startsWith('/calculators/')) {
      const slug = path.replace('/calculators/', '');
      const calc = getCalculatorBySlug(slug);
      if (calc) {
        return <CalculatorPage calc={calc} />;
      }
      return <NotFoundPage />;
    }

    // 3. Category Hub (/category/:slug)
    if (path.startsWith('/category/')) {
      const catSlug = path.replace('/category/', '');
      return <CategoryPage categorySlug={catSlug} />;
    }

    // 4. Categories Directory (/categories)
    if (path === '/categories') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-150">
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              All 15 Calculator Categories
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Browse our complete computational suite across finance, investments, mathematics, and everyday tools.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-xs group"
              >
                <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.detailedDescription}
                </p>
                <div className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Explore {cat.name} →
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 5. Compare Tool
    if (path === '/compare') {
      return <ComparePage />;
    }

    // 6. Goal Planner Tool
    if (path === '/goal-planner') {
      return <GoalPlannerPage />;
    }

    // 7. Guides
    if (path === '/guides') {
      return <GuidesPage />;
    }
    if (path.startsWith('/guides/')) {
      const guideSlug = path.replace('/guides/', '');
      return <GuideDetailPage guideSlug={guideSlug} />;
    }

    // 8. Static & Legal
    if (path === '/about') return <AboutPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/privacy-policy') return <LegalPage type="privacy" />;
    if (path === '/terms') return <LegalPage type="terms" />;
    if (path === '/disclaimer') return <LegalPage type="disclaimer" />;
    if (path === '/copyright') return <LegalPage type="copyright" />;
    if (path === '/advertising-policy') return <LegalPage type="advertising" />;
    if (path === '/accessibility') return <LegalPage type="accessibility" />;
    if (path === '/sitemap') return <SitemapPage />;

    // 9. 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Header />
      <main className="grow">{renderCurrentView()}</main>
      <Footer />

      {/* Global Modals */}
      <SearchModal />
      <CalculatorFinderModal />
      <UniversalCalculatorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
