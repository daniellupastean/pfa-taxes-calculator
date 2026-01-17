import React from 'react';

interface ChartThresholdLineProps {
    x: number;
    chartHeight: number;
    color: string;
    label: string;
    value: number;
    salaries: number;
    type: 'CASS' | 'CAS';
    onHover: (data: { type: 'CASS' | 'CAS'; value: number; label: string; x: number } | null) => void;
    padding: { left: number };
    t: (key: string) => string;
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
    t,
}) => {
    return (
        <g>
            <line
                x1={x}
                y1={0}
                x2={x}
                y2={chartHeight}
                stroke={color}
                strokeWidth="2"
                strokeDasharray="6 3"
                opacity="0.6"
            />
            <rect
                x={x - 10}
                y={0}
                width={20}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                    onHover({
                        type,
                        value,
                        label: `${label}: ${salaries} ${t('common.minimumSalaries')}`,
                        x: padding.left + x,
                    });
                }}
                onMouseLeave={() => onHover(null)}
            />
        </g>
    );
};
