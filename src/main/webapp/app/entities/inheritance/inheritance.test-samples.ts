import dayjs from 'dayjs/esm';

import { IInheritance, NewInheritance } from './inheritance.model';

export const sampleWithRequiredData: IInheritance = {
  id: 85213,
};

export const sampleWithPartialData: IInheritance = {
  id: 50905,
  operationDate: dayjs('2023-06-07'),
  documentNumber: 'reboot',
};

export const sampleWithFullData: IInheritance = {
  id: 16141,
  operationDate: dayjs('2023-06-07'),
  documentNumber: 'radical',
  documentDate: dayjs('2023-06-08'),
  sharesNo: 99107,
  status: 'COM',
};

export const sampleWithNewData: NewInheritance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
