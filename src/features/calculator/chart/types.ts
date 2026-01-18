export type ThresholdType = 'CASS' | 'CAS';

export interface ChartDataPoint {
  income: number;
  effectiveRate: number;
  total: number;
  cas: number;
  cass: number;
  incomeTax: number;
}

export interface HoveredThreshold {
  type: ThresholdType;
  value: number;
  label: string;
  salaries: number;
  x: number;
  cssY: number;
  threshold?: number;
  y?: number;
}

export interface HoveredDataPoint {
  point: ChartDataPoint;
  x: number;
  y: number;
  cssX: number;
  cssY: number;
}
