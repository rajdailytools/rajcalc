export type CategoryId =
  | 'finance'
  | 'investment'
  | 'savings'
  | 'tax'
  | 'gst'
  | 'salary'
  | 'retirement'
  | 'inflation'
  | 'math'
  | 'property'
  | 'auto-travel'
  | 'education'
  | 'date-time'
  | 'statistics'
  | 'business';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  detailedDescription: string;
}

export type InputType = 'currency' | 'number' | 'percent' | 'select' | 'date' | 'text' | 'textarea';

export interface CalculatorInputConfig {
  id: string;
  label: string;
  type: InputType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  options?: { label: string; value: string | number }[];
}

export interface ChartItem {
  name: string;
  value: number;
  color?: string;
}

export interface SeriesPoint {
  period: number | string;
  [key: string]: any;
}

export interface CalculationResult {
  primaryOutput: {
    label: string;
    value: number | string;
    format: 'currency' | 'percent' | 'number' | 'text' | 'date';
    subtext?: string;
  };
  breakdownOutputs: {
    label: string;
    value: number | string;
    format: 'currency' | 'percent' | 'number' | 'text' | 'date';
    subtext?: string;
  }[];
  chartData?: ChartItem[];
  chartType?: 'donut' | 'line' | 'bar';
  seriesData?: SeriesPoint[];
  breakdownSteps?: { step: string; detail: string }[];
  meaningExplanation: string;
  quickTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  customComponentData?: any;
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: CategoryId;
  subcategory: string;
  keywords: string[];
  route: string;
  formula: string;
  formulaExplanation: string;
  inputs: CalculatorInputConfig[];
  calculate: (inputs: Record<string, any>, context?: { currency?: string; taxYear?: string }) => CalculationResult;
  faq: { question: string; answer: string }[];
  assumptions: string[];
  tips: string[];
  commonMistakes: string[];
  stepByStepExample: {
    scenario: string;
    inputs: Record<string, string>;
    calculation: string;
    outcome: string;
  };
  diagram: {
    title: string;
    steps: string[];
  };
  relatedCalculators: string[]; // slugs
  relatedGuides?: string[];
  seoTitle: string;
  metaDescription: string;
  lastUpdated: string;
  featured?: boolean;
}

export interface CalculationHistoryItem {
  id: string;
  calculatorId: string;
  calculatorTitle: string;
  slug: string;
  timestamp: number;
  inputs: Record<string, any>;
  primaryResult: string;
  currency: string;
}
