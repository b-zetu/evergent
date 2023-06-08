import { IDividendCalculation, NewDividendCalculation } from './dividend-calculation.model';

export const sampleWithRequiredData: IDividendCalculation = {
  id: 71343,
};

export const sampleWithPartialData: IDividendCalculation = {
  id: 85506,
  totalNetAmount: 55235,
  totalGrossAmount: 35467,
};

export const sampleWithFullData: IDividendCalculation = {
  id: 73277,
  totalNetAmount: 1405,
  taxAmountCalculated: 777,
  totalGrossAmount: 38460,
};

export const sampleWithNewData: NewDividendCalculation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
