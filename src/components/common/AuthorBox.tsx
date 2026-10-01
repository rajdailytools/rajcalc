import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthorBox: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Raj Singh Sengar</h4>
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                B.Sc. + ITI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Founder & Creator of RajCalc
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-xl">
              Passionate about making mathematics, loans, and personal finance transparent and simple to understand. Every formula on RajCalc is carefully verified against standard reducing balance, compound growth, and statutory government models.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/about')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0"
        >
          <span>About RajCalc</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>No server-side transmission (Calculations run on your device)</span>
        </div>
        <div>·</div>
        <div>Single source of truth architecture</div>
        <div>·</div>
        <div>No sponsored biases or fake statistics</div>
      </div>
    </div>
  );
};
