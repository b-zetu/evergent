import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IDividendCalculation } from 'app/entities/dividend-calculation/dividend-calculation.model';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';

export interface IPayment {
  id: number;
  value?: number | null;
  shareholder?: Pick<IShareholder, 'id'> | null;
  dividendCalculation?: Pick<IDividendCalculation, 'id'> | null;
  paymentOption?: Pick<IPaymentOption, 'id'> | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
