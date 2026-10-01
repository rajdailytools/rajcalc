import React, { useState } from 'react';
import { SeriesPoint } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';

interface LineChartProps {
  data: SeriesPoint[];
  lines: { key: string; color: string; label: string }[];
  currency?: string;
  height?: number;
}

export const ResponsiveLineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  currency = 'INR',
  height = 240,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const padding = { top: 20, right: 30, bottom: 35, left: 60 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Find max value across all lines
  let maxVal = 0;
  data.forEach((point) => {
    lines.forEach((line) => {
      const v = Number(point[line.key]) || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  if (maxVal === 0) maxVal = 1;

  // X coordinate
  const getX = (idx: number) => {
    return padding.left + (idx / (data.length - 1 || 1)) * chartW;
  };

  // Y coordinate
  const getY = (val: number) => {
    return padding.top + chartH - (val / maxVal) * chartH;
  };

  // Grid ticks
  const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[340px]"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-200 dark:text-slate-800"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {formatCurrency(tick, currency, { compact: true })}
                </text>
              </g>
            );
          })}

          {/* Area Fills and Lines */}
          {lines.map((line) => {
            const points = data.map((pt, i) => `${getX(i)},${getY(Number(pt[line.key]) || 0)}`).join(' ');
            const areaPoints = `${getX(0)},${getY(0)} ${points} ${getX(data.length - 1)},${getY(0)}`;

            return (
              <g key={line.key}>
                {/* Area Gradient */}
                <polygon
                  points={areaPoints}
                  fill={line.color}
                  fillOpacity="0.08"
                  className="transition-all duration-300"
                />
                {/* Smooth stroke */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Interactive vertical hover indicator */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoverIndex)}
              y1={padding.top}
              x2={getX(hoverIndex)}
              y2={padding.top + chartH}
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Transparent click/hover detection zones */}
          {data.map((pt, i) => (
            <rect
              key={i}
              x={getX(i) - chartW / (data.length * 2)}
              y={padding.top}
              width={chartW / data.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              className="cursor-pointer"
            />
          ))}

          {/* X axis labels (first, middle, last) */}
          <text
            x={padding.left}
            y={height - 10}
            textAnchor="start"
            className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
          >
            {data[0]?.period}
          </text>
          {data.length > 2 && (
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
            >
              {data[Math.floor(data.length / 2)]?.period}
            </text>
          )}
          <text
            x={width - padding.right}
            y={height - 10}
            textAnchor="end"
            className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
          >
            {data[data.length - 1]?.period}
          </text>
        </svg>

        {/* Floating Tooltip Box */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div className="absolute top-2 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs pointer-events-none z-10 font-mono">
            <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
              {data[hoverIndex].period}
            </div>
            {lines.map((line) => (
              <div key={line.key} className="flex items-center justify-between gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }} />
                  {line.label}:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(Number(data[hoverIndex][line.key]) || 0, currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md" style={{ backgroundColor: line.color }} />
            <span className="text-slate-600 dark:text-slate-300 font-medium">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
