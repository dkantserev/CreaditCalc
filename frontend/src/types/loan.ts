export type LoanInput = { amount: number; annualRate: number; months: number; type: 'ANNUITY' | 'DIFFERENTIATED' };
export type Row = { month: number; payment: number; principal: number; interest: number; balance: number };
export type Result = {
    input: LoanInput; firstPayment: number; lastPayment: number; totalPayment: number;
    interest: number; schedule: Row[]
};
export type Comparison = { offers: Result[]; lowestInterestIndexes: number[]; lowestTotalIndexes: number[] };
