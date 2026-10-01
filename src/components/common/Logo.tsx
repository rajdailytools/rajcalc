import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
  variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  showTagline = false,
  variant = 'default',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Custom Vector Mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-teal-500 p-0.5 shadow-sm shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
          aria-hidden="true"
        >
          {/* Subtle Calculator Frame & Screen */}
          <rect x="5" y="5" width="30" height="30" rx="7" fill="#0F172A" fillOpacity="0.25" />
          <rect x="9" y="8" width="22" height="6" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
          
          {/* Stylized 'R' Stem & Loop */}
          <path
            d="M12 17H16C18.2 17 20 18.3 20 20.2C20 22.1 18.2 23.4 16 23.4H12V17Z"
            fill="#FFFFFF"
          />
          <rect x="12" y="17" width="3.5" height="15" rx="1.5" fill="#FFFFFF" />
          
          {/* Dynamic Financial Surge Arrow forming the leg of R */}
          <path
            d="M17 23L24 31H28L20 22.5Z"
            fill="#38BDF8"
          />
          
          {/* Mathematical Accent Dots */}
          <circle cx="26" cy="18" r="1.5" fill="#34D399" />
          <circle cx="26" cy="22" r="1.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className={`font-bold tracking-tight font-sans flex items-center ${textSizes[size]}`}>
            <span className={variant === 'white' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
              Raj
            </span>
            <span className={variant === 'white' ? 'text-slate-200' : 'text-slate-900 dark:text-white'}>
              Calc
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase mt-0.5">
              Smart Calculations
            </span>
          )}
        </div>
      )}
    </div>
  );
};
