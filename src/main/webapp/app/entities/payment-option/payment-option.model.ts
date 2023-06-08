export interface IPaymentOption {
  id: number;
  type?: string | null;
  detail1?: string | null;
  detail2?: string | null;
}

export type NewPaymentOption = Omit<IPaymentOption, 'id'> & { id: null };
