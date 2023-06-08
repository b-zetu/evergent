import { IDividendShareholder, NewDividendShareholder } from './dividend-shareholder.model';

export const sampleWithRequiredData: IDividendShareholder = {
  id: 2750,
};

export const sampleWithPartialData: IDividendShareholder = {
  id: 47568,
  isResident: false,
  taxValue: 58447,
  status: 'Virginia',
};

export const sampleWithFullData: IDividendShareholder = {
  id: 81226,
  sharesNo: 19599,
  isResident: false,
  taxValue: 46589,
  status: 'Infrastructure Product Usability',
};

export const sampleWithNewData: NewDividendShareholder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
