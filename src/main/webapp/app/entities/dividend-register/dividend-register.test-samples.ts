import dayjs from 'dayjs/esm';

import { IDividendRegister, NewDividendRegister } from './dividend-register.model';

export const sampleWithRequiredData: IDividendRegister = {
  id: 33878,
};

export const sampleWithPartialData: IDividendRegister = {
  id: 56278,
  referenceDate: dayjs('2023-06-07'),
  dividendGrossValue: 11148,
};

export const sampleWithFullData: IDividendRegister = {
  id: 75951,
  referenceDate: dayjs('2023-06-08'),
  dividendGrossValue: 23390,
  status: 'Soft',
};

export const sampleWithNewData: NewDividendRegister = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
