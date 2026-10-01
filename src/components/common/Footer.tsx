import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { CATEGORIES } from '../../data/categories';
import { ShieldCheck, Heart, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  const handleNav = (path: string) => {
    navigate(path);
  };

  const popularCalculators = [
    { title: 'Loan EMI Calculator', slug: 'emi-calculator' },
    { title: 'Home Loan EMI', slug: 'home-loan-emi-calculator' },
    { title: 'SIP Calculator', slug: 'sip-calculator' },
    { title: 'Step-Up SIP', slug: 'step-up-sip-calculator' },
    { title: 'Income Tax FY 2026-27', slug: 'income-tax-calculator' },
    { title: 'GST Calculator', slug: 'gst-calculator' },
    { title: 'CTC to In-Hand Salary', slug: 'salary-calculator' },
    { title: 'PPF Scheme Calculator', slug: 'ppf-calculator' },
    { title: 'Retirement & FIRE', slug: 'retirement-calculator' },
  ];

  const legalLinks = [
    { label: 'About RajCalc', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Use', path: '/terms' },
    { label: 'Financial Disclaimer', path: '/disclaimer' },
    { label: 'Copyright Notice', path: '/copyright' },
    { label: 'Advertising Policy', path: '/advertising-policy' },
    { label: 'Accessibility Statement', path: '/accessibility' },
    { label: 'HTML Sitemap', path: '/sitemap' },
  ];

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand & Founder */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              RajCalc is a dedicated, high-precision calculation platform covering Finance, Loans, Investments, Taxes, Salary, Retirement, Math, and Everyday calculations. Fast, transparent, and completely free.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-white mb-0.5">Founder & Creator</div>
              <div>Raj Singh Sengar · <span className="text-slate-500">B.Sc. + ITI</span></div>
              <p className="mt-1 text-slate-500 text-[11px]">Building independent, accessible, privacy-friendly computational tools.</p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(`/category/${cat.slug}`);
                    }}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/categories"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/categories');
                  }}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All 15 Categories →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Calculators */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {popularCalculators.map((calc) => (
                <li key={calc.slug}>
                  <a
                    href={`/calculators/${calc.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(`/calculators/${calc.slug}`);
                    }}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {calc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.path);
                    }}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Important Financial & Informational Disclaimer</span>
          </div>
          RajCalc provides mathematical, financial, and educational estimates for informational planning purposes only. Calculations do not constitute individualized legal, tax, investment, or banking advice. Actual outcomes depend on terms set by financial institutions, market volatility, or official government regulations. All calculations run client-side on your device for absolute privacy.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="font-semibold text-slate-700 dark:text-slate-200">RajCalc</strong>. All rights reserved. Created by <span className="font-medium text-slate-700 dark:text-slate-300">Raj Singh Sengar</span>.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:rajdailytools@gmail.com"
              className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </a>
            <span>·</span>
            <span>https://rajcalc.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
