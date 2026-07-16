import React, { useRef, useState, useEffect } from 'react';

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
  height?: number;
  formatValue?: (val: number) => string;
  title: string;
  desc: string;
}

export function LineChart({
  labels,
  datasets,
  height = 300,
  formatValue = (val) => val.toString(),
  title,
  desc,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ datasetIndex: number; dataIndex: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (labels.length === 0 || datasets.length === 0 || width === 0) {
    return <div ref={containerRef} style={{ height }} className="w-full flex items-center justify-center text-gray-400">No data available</div>;
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = datasets.flatMap(d => d.data);
  const maxValue = Math.max(...allValues, 1);
  const numYAxisTicks = 5;
  const tickSpacing = chartHeight / (numYAxisTicks - 1);
  const xSpacing = labels.length > 1 ? chartWidth / (labels.length - 1) : chartWidth;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {/* Hidden table for accessibility */}
      <table className="sr-only">
        <caption>{title} - {desc}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            {datasets.map((ds, i) => <th key={i} scope="col">{ds.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, i) => (
            <tr key={i}>
              <td>{label}</td>
              {datasets.map((ds, di) => <td key={di}>{formatValue(ds.data[i])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <svg width={width} height={height} className="overflow-visible" role="img" aria-labelledby="line-title line-desc">
        <title id="line-title">{title}</title>
        <desc id="line-desc">{desc}</desc>

        {/* Y Axis Grid Lines & Labels */}
        <g className="text-gray-400 dark:text-gray-500 text-xs" fill="currentColor">
          {Array.from({ length: numYAxisTicks }).map((_, i) => {
            const y = padding.top + i * tickSpacing;
            const val = maxValue - (i / (numYAxisTicks - 1)) * maxValue;
            return (
              <g key={`y-axis-${i}`}>
                <text x={padding.left - 10} y={y + 4} textAnchor="end">{formatValue(Math.round(val))}</text>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}
        </g>

        {/* X Axis Labels */}
        <g className="text-gray-500 dark:text-gray-400 text-xs" fill="currentColor">
          {labels.map((label, i) => {
            const x = padding.left + i * xSpacing;
            return (
              <text key={`x-axis-${i}`} x={x} y={height - padding.bottom + 20} textAnchor="middle">
                {label}
              </text>
            );
          })}
        </g>

        {/* Lines and Points */}
        {datasets.map((dataset, dsIndex) => {
          const points = dataset.data.map((val, i) => {
            const x = padding.left + i * xSpacing;
            const y = height - padding.bottom - (val / maxValue) * chartHeight;
            return { x, y, val };
          });
          
          const pathD = points.length > 0 
            ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
            : '';

          return (
            <g key={`dataset-${dsIndex}`}>
              <path
                d={pathD}
                fill="none"
                stroke={dataset.color}
                strokeWidth="3"
                className="animate-draw-line"
                style={{
                  strokeDasharray: '2000',
                  strokeDashoffset: '2000',
                  animation: 'drawLine 1.5s ease-out forwards',
                }}
              />
              {points.map((p, i) => {
                const isHovered = hoveredPoint?.datasetIndex === dsIndex && hoveredPoint?.dataIndex === i;
                return (
                  <circle
                    key={`point-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? dataset.color : 'white'}
                    stroke={dataset.color}
                    strokeWidth="2"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ datasetIndex: dsIndex, dataIndex: i })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ animation: `fadeIn 0.5s ease-out ${1.5 + (i * 0.1)}s both` }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div 
          className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg py-1 px-2 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: padding.left + hoveredPoint.dataIndex * xSpacing,
            top: height - padding.bottom - (datasets[hoveredPoint.datasetIndex].data[hoveredPoint.dataIndex] / maxValue) * chartHeight - 10,
          }}
        >
          <div className="font-semibold">{datasets[hoveredPoint.datasetIndex].label}</div>
          <div>{labels[hoveredPoint.dataIndex]}</div>
          <div style={{ color: datasets[hoveredPoint.datasetIndex].color }} className="font-bold">
            {formatValue(datasets[hoveredPoint.datasetIndex].data[hoveredPoint.dataIndex])}
          </div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}

      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
