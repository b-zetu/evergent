import dayjs from 'dayjs/esm';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';

export interface ILegalHold {
  id: number;
  beneficiaryName?: string | null;
  type?: string | null;
  totalAmount?: number | null;
  amountLeft?: number | null;
  poprireNumber?: string | null;
  poprireDate?: dayjs.Dayjs | null;
  poprireDocumentNumber?: string | null;
  poprireDocumentDate?: dayjs.Dayjs | null;
  sistareNumber?: string | null;
  sistareDate?: dayjs.Dayjs | null;
  sistareIntrareNumber?: string | null;
  sistareIntrareDate?: dayjs.Dayjs | null;
  status?: string | null;
  shareholder?: Pick<IShareholder, 'id'> | null;
  paymentOption?: Pick<IPaymentOption, 'id'> | null;
}

export type NewLegalHold = Omit<ILegalHold, 'id'> & { id: null };
