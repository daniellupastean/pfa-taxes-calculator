import React from 'react';

interface TaxZone {
  start: number;
  end: number;
  color: string;
  opacity: number;
  label: string;
}

interface ChartZoneBackgroundProps {
  zones: TaxZone[];
  scaleX: (income: number) => number;
  chartHeight: number;
}

export const ChartZoneBackground: React.FC<ChartZoneBackgroundProps> = ({
  zones,
  scaleX,
  chartHeight,
}) => {
  return (
    <g opacity="0.15">
      {zones.map((zone, index) => {
        const x = scaleX(zone.start);
        const width = scaleX(zone.end) - scaleX(zone.start);

        return (
          <rect
            key={index}
            x={x}
            y={0}
            width={width}
            height={chartHeight}
            fill={zone.color}
            opacity={zone.opacity}
          />
        );
      })}
    </g>
  );
};
