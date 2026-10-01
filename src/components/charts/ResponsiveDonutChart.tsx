import React from 'react';
import { ChartItem } from '../../types/calculator';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface DonutChartProps {
  data: ChartItem[];
  currency?: string;
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const ResponsiveDonutChart: React.FC<DonutChartProps> = ({
  data,
  currency = 'INR',
  size = 220,
  centerLabel,
  centerValue,
}) => {
  const total = data.reduce((sum, item) => sum + (Math.max(0, item.value) || 0), 0);
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const defaultColors = ['#2563EB', '#0EA5E9', '#14B8A6', '#10B981', '#F59E0B', '#6366F1'];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4">
      {/* SVG Canvas */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90 transform"
          role="img"
          aria-label="Proportional breakdown chart"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Slices */}
          {total > 0 &&
            data.map((item, idx) => {
              const val = Math.max(0, item.value);
              const fraction = val / total;
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += fraction;

              const color = item.color || defaultColors[idx % defaultColors.length];

              return (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 line-clamp-1">
            {centerLabel || 'Total'}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white truncate max-w-full">
            {centerValue || formatCurrency(total, currency, { compact: true })}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full max-w-xs text-xs">
        {data.map((item, idx) => {
          const val = Math.max(0, item.value);
          const percent = total > 0 ? (val / total) * 100 : 0;
          const color = item.color || defaultColors[idx % defaultColors.length];

          return (
            <div key={item.name} className="flex items-center justify-between gap-3 py-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-slate-900 dark:text-white font-semibold tabular-nums">
                <span>{formatCurrency(val, currency, { compact: true })}</span>
                <span className="text-[11px] font-normal text-slate-400">
                  ({formatPercent(percent, 0)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
