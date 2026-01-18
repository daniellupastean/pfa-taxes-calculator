import React, { useRef } from 'react';
import type { HoveredThreshold, ThresholdType } from '../types';

interface ChartThresholdLineProps {
  x: number;
  chartHeight: number;
  color: string;
  label: string;
  value: number;
  salaries: number;
  type: ThresholdType;
  onHover: (data: HoveredThreshold | null) => void;
  padding: { left: number };
}

export const ChartThresholdLine: React.FC<ChartThresholdLineProps> = ({
  x,
  chartHeight,
  color,
  label,
  value,
  salaries,
  type,
  onHover,
  padding,
}) => {
  const alignedX = Math.round(x);
  const lastDataRef = useRef<{
    type: ThresholdType;
    value: number;
    label: string;
    salaries: number;
    x: number;
  } | null>(null);

  const getCssY = (event: React.MouseEvent<SVGRectElement>) => {
    const rect = event.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
    return event.clientY - (rect?.top || 0);
  };

  return (
    <g>
      <line
        x1={alignedX}
        y1={0}
        x2={alignedX}
        y2={chartHeight}
        stroke={color}
        strokeWidth="2"
        strokeDasharray="6 3"
        opacity="0.6"
      />
      <rect
        x={alignedX - 10}
        y={0}
        width={20}
        height={chartHeight}
        fill="transparent"
        onMouseEnter={(e) => {
          const cssY = getCssY(e);
          const data = {
            type,
            value,
            label,
            salaries,
            x: padding.left + alignedX,
            cssY,
          };
          lastDataRef.current = { type, value, label, salaries, x: padding.left + alignedX };

          onHover(data);
        }}
        onMouseMove={(e) => {
          if (!lastDataRef.current) return;
          onHover({
            ...lastDataRef.current,
            cssY: getCssY(e),
          });
        }}
        onMouseLeave={() => {
          onHover(null);
          lastDataRef.current = null;
        }}
      />
    </g>
  );
};
