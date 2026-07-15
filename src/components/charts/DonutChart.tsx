import React, { useRef, useState, useEffect } from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  height?: number;
  formatValue?: (val: number) => string;
  title: string;
  desc: string;
}

export function DonutChart({
  data,
  height = 300,
  formatValue = (val) => val.toString(),
  title,
  desc,
}: DonutChartProps) {
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

  if (data.length === 0 || width === 0) {
    return <div ref={containerRef} style={{ height }} className="w-full flex items-center justify-center text-gray-400">No data available</div>;
  }

  const padding = 20;
  const size = Math.min(width, height) - padding * 2;
  const cx = width / 2;
  const cy = height / 2;
  
  const strokeWidth = size * 0.2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  let currentOffset = 0;
  const slices = data.map((d) => {
    const value = Math.max(d.value, 0.0001); // Prevent 0 width which breaks drawing
    const percentage = value / totalValue;
    const strokeLength = percentage * circumference;
    const offset = currentOffset;
    currentOffset += strokeLength;
    return { ...d, percentage, strokeLength, offset };
  });

  // To display tooltip at mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ height }}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Hidden table for accessibility */}
      <table className="sr-only">
        <caption>{title} - {desc}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.label}</td>
              <td>{formatValue(d.value)}</td>
              <td>{((d.value / totalValue) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <svg width={width} height={height} className="overflow-visible" role="img" aria-labelledby="donut-title donut-desc">
        <title id="donut-title">{title}</title>
        <desc id="donut-desc">{desc}</desc>

        {/* Rotate by -90deg so the first slice starts at the top */}
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {slices.map((slice, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={`slice-${i}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${slice.strokeLength} ${circumference}`}
                strokeDashoffset={-slice.offset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                  animation: `spinIn 1s ease-out forwards`,
                }}
              />
            );
          })}
        </g>
        
        {/* Center Text */}
        <text x={cx} y={cy - 10} textAnchor="middle" className="text-gray-400 text-xs font-semibold" fill="currentColor">
          Total
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" className="text-gray-900 dark:text-white font-bold" fill="currentColor">
          {formatValue(totalValue)}
        </text>
      </svg>

      {/* Custom Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        {data.map((d, i) => (
          <div key={`legend-${i}`} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
            <span>{d.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg py-1 px-2 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4"
          style={{
            left: mousePos.x,
            top: mousePos.y,
          }}
        >
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data[hoveredIndex].color }}></span>
            {data[hoveredIndex].label}
          </div>
          <div>{formatValue(data[hoveredIndex].value)}</div>
          <div className="text-gray-400 text-[10px]">
            {((data[hoveredIndex].value / totalValue) * 100).toFixed(1)}%
          </div>
        </div>
      )}

      <style>{`
        @keyframes spinIn {
          from { stroke-dasharray: 0 ${circumference}; }
        }
      `}</style>
    </div>
  );
}
