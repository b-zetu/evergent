import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IDividendRegister } from 'app/entities/dividend-register/dividend-register.model';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';

export interface IDividendShareholder {
  id: number;
  sharesNo?: number | null;
  isResident?: boolean | null;
  taxValue?: number | null;
  status?: string | null;
  shareholder?: Pick<IShareholder, 'id'> | null;
  dividendRegister?: Pick<IDividendRegister, 'id'> | null;
  paymentOption?: Pick<IPaymentOption, 'id'> | null;
}

export type NewDividendShareholder = Omit<IDividendShareholder, 'id'> & { id: null };
