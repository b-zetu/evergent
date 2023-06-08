import dayjs from 'dayjs/esm';

export interface IInheritance {
  id: number;
  operationDate?: dayjs.Dayjs | null;
  documentNumber?: string | null;
  documentDate?: dayjs.Dayjs | null;
  sharesNo?: number | null;
  status?: string | null;
}

export type NewInheritance = Omit<IInheritance, 'id'> & { id: null };
