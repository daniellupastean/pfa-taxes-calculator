import React from 'react';

interface ChartCurrentPointProps {
  currentX: number;
  currentY: number;
  chartHeight: number;
  currentEffectiveRate: number;
  maxIncome: number;
  grossIncome: number;
}

export const ChartCurrentPoint: React.FC<ChartCurrentPointProps> = ({
  currentX,
  currentY,
  chartHeight,
  currentEffectiveRate,
  maxIncome,
  grossIncome,
}) => {
  if (grossIncome <= 0 || grossIncome > maxIncome) {
    return null;
  }

  return (
    <g className="transition-all duration-300">
      <line
        x1={currentX}
        y1={chartHeight}
        x2={currentX}
        y2={currentY}
        stroke="var(--color-accent-secondary)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle
        cx={currentX}
        cy={currentY}
        r="6"
        fill="var(--color-accent-primary)"
        stroke="var(--color-surface)"
        strokeWidth="3"
        className="animate-pulse-slow"
      />
      <rect
        x={currentX - 55}
        y={currentY - 65}
        width="110"
        height="50"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="2"
        className="shadow-lg"
      />
      <text
        x={currentX}
        y={currentY - 40}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-2xl"
        fill="var(--color-text-primary)"
        style={{ fontWeight: 500 }}
      >
        {(Math.round(currentEffectiveRate * 10) / 10).toFixed(1)}%
      </text>
    </g>
  );
};
