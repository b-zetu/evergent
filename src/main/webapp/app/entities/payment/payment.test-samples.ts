import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: 47537,
};

export const sampleWithPartialData: IPayment = {
  id: 74412,
  value: 47604,
};

export const sampleWithFullData: IPayment = {
  id: 34993,
  value: 88670,
};

export const sampleWithNewData: NewPayment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
