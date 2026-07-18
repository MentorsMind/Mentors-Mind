import { PieChart } from 'lucide-react';

export interface BarDatum {
  label: string;
  value: number;
}

export function BarChart({
  data,
  color = '#3b82f6',
}: {
  data: BarDatum[];
  color?: string;
}) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-40" role="img" aria-label="Bar chart">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
          <div
            className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: color,
              minHeight: d.value > 0 ? '4px' : '0px',
            }}
          />
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export interface LineDataset {
  label: string;
  data: number[];
  color: string;
}

export function LineChart({
  labels,
  datasets,
}: {
  labels: string[];
  datasets: LineDataset[];
  formatValue?: (val: number) => string;
}) {
  const allValues = datasets.flatMap(d => d.data);
  const max = Math.max(1, ...allValues);
  const points = (values: number[]) =>
    values
      .map((v, i) => {
        const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 0;
        const y = 100 - (v / max) * 100;
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div className="h-40 flex flex-col">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full flex-1">
        {datasets.map((ds, di) => (
          <polyline
            key={di}
            points={points(ds.data)}
            fill="none"
            stroke={ds.color}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-gray-400 truncate">{l}</span>
        ))}
      </div>
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

const DONUT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export function DonutChart({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
        <PieChart className="w-10 h-10" />
        <span className="text-sm">No sessions yet</span>
      </div>
    );
  }

  let offset = 0;
  const segments = data
    .filter(d => d.value > 0)
    .map((d, i) => {
      const fraction = d.value / total;
      const dash = `${fraction * 100} ${100 - fraction * 100}`;
      const seg = (
        <circle
          key={i}
          cx="50"
          cy="50"
          r="15.915"
          fill="transparent"
          stroke={d.color || DONUT_COLORS[i % DONUT_COLORS.length]}
          strokeWidth="8"
          strokeDasharray={dash}
          strokeDashoffset={-offset * 100 + 25}
        />
      );
      offset += fraction;
      return seg;
    });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 42 42" className="w-28 h-28 shrink-0">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="8" />
        {segments}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color || DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="truncate">{d.label}</span>
            <span className="ml-auto font-medium text-gray-900 dark:text-white">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
