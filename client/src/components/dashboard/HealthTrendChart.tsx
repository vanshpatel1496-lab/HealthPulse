import React, { useState } from 'react';
import { VitalTrendPoint } from '@healthpulse/shared';
import { TrendingUp } from 'lucide-react';

interface HealthTrendChartProps {
  trends: {
    sevenDays: VitalTrendPoint[];
    thirtyDays: VitalTrendPoint[];
    threeMonths: VitalTrendPoint[];
  };
}

type Period = '7d' | '30d' | '3m';
type MetricKey = 'heartRate' | 'systolic' | 'sleepHours' | 'spo2';

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({ trends }) => {
  const [period, setPeriod] = useState<Period>('7d');
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('systolic');

  const dataPoints =
    period === '7d'
      ? trends.sevenDays
      : period === '30d'
      ? trends.thirtyDays
      : trends.threeMonths;

  const metricConfigs: Record<
    MetricKey,
    {
      label: string;
      unit: string;
      color: string;
      targetRange: string;
      minTarget: number;
      maxTarget: number;
      getValue: (p: VitalTrendPoint) => number;
    }
  > = {
    systolic: {
      label: 'Systolic Blood Pressure',
      unit: 'mmHg',
      color: '#0F766E', // primary teal
      targetRange: 'Target 110–120 mmHg',
      minTarget: 110,
      maxTarget: 120,
      getValue: (p) => p.systolic,
    },
    heartRate: {
      label: 'Resting Heart Rate',
      unit: 'bpm',
      color: '#E11D48', // rose
      targetRange: 'Target 60–72 bpm',
      minTarget: 60,
      maxTarget: 72,
      getValue: (p) => p.heartRate,
    },
    sleepHours: {
      label: 'Sleep Duration',
      unit: 'hrs',
      color: '#4F46E5', // indigo
      targetRange: 'Target 7.0–9.0 hrs',
      minTarget: 7.0,
      maxTarget: 9.0,
      getValue: (p) => p.sleepHours,
    },
    spo2: {
      label: 'Blood Oxygen (SpO2)',
      unit: '%',
      color: '#0284C7', // sky
      targetRange: 'Reference 95–100%',
      minTarget: 95,
      maxTarget: 100,
      getValue: (p) => p.spo2,
    },
  };

  const activeConfig = metricConfigs[selectedMetric];
  const values = dataPoints.map(activeConfig.getValue);
  const minVal = Math.floor(Math.min(...values, activeConfig.minTarget) * 0.95);
  const maxVal = Math.ceil(Math.max(...values, activeConfig.maxTarget) * 1.05);
  const valRange = maxVal - minVal || 1;

  const chartWidth = 560;
  const chartHeight = 180;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;

  const getX = (index: number) =>
    padLeft + (index / (dataPoints.length - 1 || 1)) * plotWidth;

  const getY = (val: number) =>
    padTop + plotHeight - ((val - minVal) / valRange) * plotHeight;

  const lineCoordinates = dataPoints.map((p, idx) => {
    const val = activeConfig.getValue(p);
    return `${getX(idx)},${getY(val)}`;
  });

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-clinical-card space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            Physiological Health Trends
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-period telemetry trajectory with clinical reference range
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          {(
            [
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '3m', label: '3 Months' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setPeriod(item.key)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors min-h-[32px] focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                period === item.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Metric Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(Object.keys(metricConfigs) as MetricKey[]).map((key) => {
          const cfg = metricConfigs[key];
          const isSelected = selectedMetric === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border min-h-[36px] focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isSelected ? '#FFFFFF' : cfg.color }}
              />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Line Chart Viewport */}
      <div className="w-full overflow-x-auto pt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 min-w-[480px] overflow-visible"
          role="img"
          aria-label={`${activeConfig.label} trend chart over ${period}`}
        >
          {/* Target Reference Range Band */}
          <rect
            x={padLeft}
            y={Math.min(getY(activeConfig.maxTarget), getY(activeConfig.minTarget))}
            width={plotWidth}
            height={Math.abs(getY(activeConfig.maxTarget) - getY(activeConfig.minTarget))}
            fill="#0D9488"
            fillOpacity="0.08"
          />

          {/* Target Reference Baseline Line */}
          <line
            x1={padLeft}
            y1={getY(activeConfig.minTarget)}
            x2={padLeft + plotWidth}
            y2={getY(activeConfig.minTarget)}
            stroke="#0D9488"
            strokeDasharray="4 4"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Grid lines & Y Axis labels */}
          <text
            x={padLeft - 8}
            y={padTop + 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono"
          >
            {maxVal}
          </text>
          <text
            x={padLeft - 8}
            y={padTop + plotHeight / 2 + 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono"
          >
            {Math.round((maxVal + minVal) / 2)}
          </text>
          <text
            x={padLeft - 8}
            y={padTop + plotHeight + 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono"
          >
            {minVal}
          </text>

          {/* Trend Polyline */}
          <polyline
            fill="none"
            stroke={activeConfig.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={lineCoordinates.join(' ')}
          />

          {/* Data Points with Values & X-Axis Labels */}
          {dataPoints.map((point, idx) => {
            const val = activeConfig.getValue(point);
            const x = getX(idx);
            const y = getY(val);

            return (
              <g key={idx}>
                {/* Data point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#FFFFFF"
                  stroke={activeConfig.color}
                  strokeWidth="2"
                />
                {/* Value tooltip label above point */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-700 font-bold font-mono"
                >
                  {val}
                </text>
                {/* X Axis Date Label */}
                <text
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-500 font-medium"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend and Accessible Dual-Coded Labels */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-1 rounded"
              style={{ backgroundColor: activeConfig.color }}
            />
            <span className="font-semibold text-slate-800">
              {activeConfig.label} ({activeConfig.unit})
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-teal-100 border border-teal-300 rounded-sm" />
            <span className="text-slate-500">{activeConfig.targetRange}</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Showing {dataPoints.length} telemetry recordings
        </span>
      </div>
    </div>
  );
};
