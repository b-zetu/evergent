import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';

export interface IShareholder {
  id: number;
  shareholderIdDC?: number | null;
  cnp?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  sharesNo?: number | null;
  isPf?: boolean | null;
  isResident?: boolean | null;
  taxValue?: number | null;
  status?: string | null;
  countryResidence?: string | null;
  countyResidence?: number | null;
  cityResidence?: number | null;
  villageResidence?: number | null;
  foreignLocalityResidence?: string | null;
  streetResidence?: string | null;
  streetNo?: string | null;
  paymentOption?: Pick<IPaymentOption, 'id'> | null;
}

export type NewShareholder = Omit<IShareholder, 'id'> & { id: null };
