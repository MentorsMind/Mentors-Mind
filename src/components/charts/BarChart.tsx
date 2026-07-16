import React, { useRef, useState, useEffect } from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (val: number) => string;
  title: string;
  desc: string;
}

export function BarChart({
  data,
  color = '#10b981', // emerald-500
  height = 300,
  formatValue = (val) => val.toString(),
  title,
  desc,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Ensure there's data and width
  if (data.length === 0 || width === 0) {
    return <div ref={containerRef} style={{ height }} className="w-full flex items-center justify-center text-gray-400">No data available</div>;
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const numYAxisTicks = 5;
  const tickSpacing = chartHeight / (numYAxisTicks - 1);
  
  const barWidth = Math.max((chartWidth / data.length) * 0.6, 10);
  const barSpacing = chartWidth / data.length;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {/* Hidden table for accessibility */}
      <table className="sr-only">
        <caption>{title} - {desc}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.label}</td>
              <td>{formatValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <svg width={width} height={height} className="overflow-visible" role="img" aria-labelledby="bar-title bar-desc">
        <title id="bar-title">{title}</title>
        <desc id="bar-desc">{desc}</desc>

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

        {/* X Axis Line */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="currentColor"
          className="text-gray-300 dark:text-gray-600"
          strokeWidth="2"
        />

        {/* Bars & X Axis Labels */}
        {data.map((d, i) => {
          const x = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
          const barH = (d.value / maxValue) * chartHeight;
          const y = height - padding.bottom - barH;
          const isHovered = hoveredIndex === i;

          return (
            <g key={`bar-${i}`} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-gray-500 dark:text-gray-400 text-xs"
                fill="currentColor"
              >
                {d.label}
              </text>
              
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={color}
                className="transition-all duration-300 ease-out origin-bottom"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'bottom',
                  opacity: isHovered ? 1 : 0.8,
                  animation: 'growUp 0.8s ease-out forwards',
                }}
                rx={4}
                ry={4}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg py-1 px-2 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{
            left: padding.left + hoveredIndex * barSpacing + barSpacing / 2,
            top: height - padding.bottom - (data[hoveredIndex].value / maxValue) * chartHeight - 10,
          }}
        >
          <div className="font-semibold">{data[hoveredIndex].label}</div>
          <div>{formatValue(data[hoveredIndex].value)}</div>
          {/* Small triangle at bottom */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}

      <style>{`
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
