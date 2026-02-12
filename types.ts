
export type ContractType = 'Month-to-month' | 'One year' | 'Two year';

export interface Customer {
  id: string;
  tenure: number;
  monthlyCharges: number;
  totalCharges: number;
  churn: boolean;
  contract: ContractType;
  usageGB: number;
  lastActivityDate: string;
  clv: number;
  rfmScore: number;
  segment: string;
}

export interface RFMData {
  recency: number;
  frequency: number;
  monetary: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER'
}

export interface User {
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface ChurnPredictionResult {
  probability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}
