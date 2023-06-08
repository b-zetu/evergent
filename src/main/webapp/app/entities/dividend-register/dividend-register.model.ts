import dayjs from 'dayjs/esm';

export interface IDividendRegister {
  id: number;
  referenceDate?: dayjs.Dayjs | null;
  dividendGrossValue?: number | null;
  status?: string | null;
}

export type NewDividendRegister = Omit<IDividendRegister, 'id'> & { id: null };
