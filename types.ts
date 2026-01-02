
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  subCategory?: string;
  date: string;
  note: string;
}

export interface FinancialInsight {
  title: string;
  description: string;
  suggestion: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface UserProfile {
  name: string;
  gender: string;
  age: string;
  city: string;
  state: string;
  phone: string;
}
