import { IPaymentOption, NewPaymentOption } from './payment-option.model';

export const sampleWithRequiredData: IPaymentOption = {
  id: 71398,
};

export const sampleWithPartialData: IPaymentOption = {
  id: 15740,
  type: 'Dollar firewall',
};

export const sampleWithFullData: IPaymentOption = {
  id: 12168,
  type: 'white',
  detail1: 'architectures Corporate',
  detail2: 'Account protocol',
};

export const sampleWithNewData: NewPaymentOption = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
