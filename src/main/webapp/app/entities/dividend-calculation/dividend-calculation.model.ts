import { IDividendShareholder } from 'app/entities/dividend-shareholder/dividend-shareholder.model';

export interface IDividendCalculation {
  id: number;
  totalNetAmount?: number | null;
  taxAmountCalculated?: number | null;
  totalGrossAmount?: number | null;
  dividendShareholder?: Pick<IDividendShareholder, 'id'> | null;
}

export type NewDividendCalculation = Omit<IDividendCalculation, 'id'> & { id: null };
