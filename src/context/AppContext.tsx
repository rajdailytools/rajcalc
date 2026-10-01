import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalculationHistoryItem } from '../types/calculator';
import { CurrencyConfig, SUPPORTED_CURRENCIES, getCurrencyConfig } from '../utils/formatters';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Currency
  currency: string;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: string) => void;
  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isFinderOpen: boolean;
  setIsFinderOpen: (open: boolean) => void;
  isUniversalOpen: boolean;
  setIsUniversalOpen: (open: boolean) => void;
  // Favorites
  favorites: string[]; // slugs
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  // History
  history: CalculationHistoryItem[];
  addToHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rajcalc_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rajcalc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rajcalc_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // 2. Currency
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rajcalc_currency') || 'INR';
    }
    return 'INR';
  });

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rajcalc_currency', code);
    }
  };

  const currencyConfig = getCurrencyConfig(currency);

  // 3. Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isUniversalOpen, setIsUniversalOpen] = useState(false);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('rajcalc_favorites');
        return stored ? JSON.parse(stored) : ['emi-calculator', 'sip-calculator', 'income-tax-calculator', 'salary-calculator'];
      } catch {
        return ['emi-calculator', 'sip-calculator'];
      }
    }
    return [];
  });

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajcalc_favorites', JSON.stringify(next));
      }
      return next;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  // 5. Calculation History
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('rajcalc_history');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const addToHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      // Keep last 30 calculations
      const filtered = prev.filter(
        (h) => !(h.slug === newItem.slug && JSON.stringify(h.inputs) === JSON.stringify(newItem.inputs))
      );
      const updated = [newItem, ...filtered].slice(0, 30);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajcalc_history', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajcalc_history', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rajcalc_history');
    }
  };

  // 6. Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return hash || window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || window.location.pathname || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currency,
        currencyConfig,
        setCurrency,
        isSearchOpen,
        setIsSearchOpen,
        isFinderOpen,
        setIsFinderOpen,
        isUniversalOpen,
        setIsUniversalOpen,
        favorites,
        toggleFavorite,
        isFavorite,
        history,
        addToHistory,
        removeHistoryItem,
        clearHistory,
        currentPath,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
