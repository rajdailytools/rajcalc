import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileText, AlertTriangle, Eye, Accessibility, Copyright } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer' | 'copyright' | 'advertising' | 'accessibility';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { navigate } = useApp();

  const legalContent = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'October 1, 2026',
      icon: ShieldCheck,
      sections: [
        {
          heading: '1. Commitment to Client-Side Privacy',
          content:
            'RajCalc operates on a strict privacy-first foundation. Unlike conventional financial portals, all calculations—including your entered salary, loan principal amounts, personal expenses, and investment goals—are processed entirely on your local device (client-side in your browser). No personal financial numbers are ever sent to, processed by, or stored on our servers.',
        },
        {
          heading: '2. LocalStorage Usage',
          content:
            'We use your browser’s localStorage solely to enhance your personal convenience, including storing your selected visual theme (Dark or Light Mode), preferred default currency, saved favorite calculators, and recent calculation history. This data never leaves your device and can be cleared at any time by clearing your browser cache or clicking "Clear History" in the application.',
        },
        {
          heading: '3. Web Analytics & Cookies',
          content:
            'RajCalc does not use invasive tracking cookies, browser fingerprinting, or cross-site tracking beacons. Any general web server logs maintain strictly anonymized diagnostic connection information (such as HTTP status codes and user-agent strings) required for site security and uptime stability.',
        },
        {
          heading: '4. Third-Party Integrations',
          content:
            'We do not sell, rent, or trade your personal information. When you use external links or share features, you are subject to the policies of the respective recipient platforms.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'October 1, 2026',
      icon: FileText,
      sections: [
        {
          heading: '1. Acceptance of Terms',
          content:
            'By accessing or using RajCalc (https://rajcalc.com), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please do not use the website.',
        },
        {
          heading: '2. Purpose of Calculations',
          content:
            'RajCalc provides computational estimators for informational, educational, and preliminary planning purposes. All calculations depend on mathematical models and user-supplied parameters. They do not constitute formal bank offers, tax filings, legal opinions, or investment underwriting.',
        },
        {
          heading: '3. Intellectual Property',
          content:
            'The RajCalc name, logo, custom user interface design, original diagrams, and underlying computational code are the intellectual property of Raj Singh Sengar. You may not scrape, republish, mirror, or repackage our proprietary code without explicit prior permission.',
        },
        {
          heading: '4. Limitation of Liability',
          content:
            'Under no circumstances shall RajCalc or its founder be held liable for any direct, indirect, incidental, or consequential financial losses, interest differentials, or tax penalties resulting from decisions made based on calculator outputs.',
        },
      ],
    },
    disclaimer: {
      title: 'Financial & Informational Disclaimer',
      lastUpdated: 'October 1, 2026',
      icon: AlertTriangle,
      sections: [
        {
          heading: '1. Not Financial, Tax, or Legal Advice',
          content:
            'The content, tools, and calculation results presented on RajCalc are provided strictly for general informational and personal planning purposes. Nothing on this website constitutes personalized financial advice, wealth management recommendations, accounting counsel, or legal representation.',
        },
        {
          heading: '2. Variation in Official Bank and Statutory Rates',
          content:
            'While our formulas follow rigorous reducing balance, compound growth, and government-notified schedules (e.g., PPF, EPF, and Income Tax slabs), actual real-world outcomes may vary. Commercial banks, NBFCs, credit card issuers, and tax authorities may apply different rounding conventions, daily vs. monthly rests, processing fees, service charges, or statutory cess.',
        },
        {
          heading: '3. Verification Recommended',
          content:
            'Users must always verify final numbers with licensed financial advisors, chartered accountants (CA), or authorized loan officers before signing binding loan agreements or submitting official income tax returns.',
        },
      ],
    },
    copyright: {
      title: 'Copyright Notice',
      lastUpdated: 'October 1, 2026',
      icon: Copyright,
      sections: [
        {
          heading: '1. Ownership of Intellectual Property',
          content:
            'All text, graphics, user interface layouts, interactive diagrams, and proprietary JavaScript calculation logic on RajCalc are protected by international copyright laws. Copyright © 2026 RajCalc. All rights reserved. Created and maintained by Raj Singh Sengar.',
        },
        {
          heading: '2. Permitted Use',
          content:
            'You are encouraged to use RajCalc for personal calculations, educational study, and professional scenario analysis. You may print and share generated calculation reports with appropriate attribution to https://rajcalc.com.',
        },
        {
          heading: '3. Prohibited Use',
          content:
            'Automated scraping of calculator content, re-hosting identical calculator tools on commercial competitor domains, or passing off RajCalc algorithms as your own proprietary software is strictly prohibited.',
        },
      ],
    },
    advertising: {
      title: 'Advertising & Editorial Policy',
      lastUpdated: 'October 1, 2026',
      icon: Eye,
      sections: [
        {
          heading: '1. Independence of Calculations',
          content:
            'RajCalc maintains strict editorial independence. No financial institution, lender, fintech startup, or mutual fund asset management company (AMC) can pay to alter the output or mathematical logic of our calculators.',
        },
        {
          heading: '2. Clear Separation of Content',
          content:
            'If any non-intrusive contextual advertising or affiliate links are displayed in the future to help offset platform hosting expenses, they will be clearly labeled as sponsored or promotional, never masquerading as objective calculator results.',
        },
        {
          heading: '3. No Deceptive Dark Patterns',
          content:
            'We pledge never to implement deceptive "calculate" buttons that trick users into submitting lead generation forms or purchasing unwanted loans.',
        },
      ],
    },
    accessibility: {
      title: 'Accessibility Statement',
      lastUpdated: 'October 1, 2026',
      icon: Accessibility,
      sections: [
        {
          heading: '1. Accessibility Commitment',
          content:
            'RajCalc is committed to ensuring digital accessibility for all users, including individuals with visual, motor, auditory, or cognitive disabilities. We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.',
        },
        {
          heading: '2. Implemented Accessibility Features',
          content:
            'Our website features semantic HTML elements, high-contrast color palettes for both light and dark themes, visible keyboard focus indicators (`focus-visible`), touch targets of at least 44px on mobile, full screen-reader friendly labels, and tabular numerical font formatting to prevent layout jitter.',
        },
        {
          heading: '3. Feedback & Contact',
          content:
            'If you experience any accessibility barriers while using any calculator on RajCalc, please contact us at rajdailytools@gmail.com and we will remediate the issue promptly.',
        },
      ],
    },
  };

  const current = legalContent[type] || legalContent.privacy;
  const Icon = current.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          <Icon className="w-4 h-4" />
          <span>Legal & Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {current.title}
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">
          Last updated: {current.lastUpdated} · Official domain: https://rajcalc.com
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {current.sections.map((sec, idx) => (
          <section key={idx} className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {sec.heading}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {sec.content}
            </p>
          </section>
        ))}
      </div>

      {/* Footer navigation between legal pages */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs">
        <button
          onClick={() => navigate('/privacy-policy')}
          className="text-slate-500 hover:text-blue-600"
        >
          Privacy Policy
        </button>
        <span>·</span>
        <button onClick={() => navigate('/terms')} className="text-slate-500 hover:text-blue-600">
          Terms of Service
        </button>
        <span>·</span>
        <button onClick={() => navigate('/disclaimer')} className="text-slate-500 hover:text-blue-600">
          Financial Disclaimer
        </button>
        <span>·</span>
        <button onClick={() => navigate('/copyright')} className="text-slate-500 hover:text-blue-600">
          Copyright Notice
        </button>
        <span>·</span>
        <button onClick={() => navigate('/advertising-policy')} className="text-slate-500 hover:text-blue-600">
          Advertising Policy
        </button>
        <span>·</span>
        <button onClick={() => navigate('/accessibility')} className="text-slate-500 hover:text-blue-600">
          Accessibility
        </button>
      </div>

    </div>
  );
};
