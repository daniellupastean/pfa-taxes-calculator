import React from 'react';

interface ChartAxesProps {
  chartWidth: number;
  chartHeight: number;
}

export const ChartAxes: React.FC<ChartAxesProps> = ({ chartWidth, chartHeight }) => {
  return (
    <>
      <line
        x1={0}
        y1={chartHeight}
        x2={chartWidth}
        y2={chartHeight}
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
      />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={chartHeight}
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
      />
    </>
  );
};
