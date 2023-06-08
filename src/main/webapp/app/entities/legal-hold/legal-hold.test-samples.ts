import dayjs from 'dayjs/esm';

import { ILegalHold, NewLegalHold } from './legal-hold.model';

export const sampleWithRequiredData: ILegalHold = {
  id: 87128,
};

export const sampleWithPartialData: ILegalHold = {
  id: 39082,
  beneficiaryName: 'Auto deposit executive',
  type: 'Koruna Congolese seize',
  amountLeft: 53930,
  poprireDate: dayjs('2023-06-07'),
  poprireDocumentDate: dayjs('2023-06-08'),
  sistareNumber: 'New Cotton',
  sistareDate: dayjs('2023-06-08'),
  sistareIntrareNumber: 'systems Re-contextualized',
  sistareIntrareDate: dayjs('2023-06-07'),
  status: 'RAM Singapore national',
};

export const sampleWithFullData: ILegalHold = {
  id: 79225,
  beneficiaryName: 'Grocery synthesize',
  type: 'fuchsia',
  totalAmount: 54754,
  amountLeft: 78458,
  poprireNumber: 'Granite Orchestrator Executive',
  poprireDate: dayjs('2023-06-08'),
  poprireDocumentNumber: 'Hat',
  poprireDocumentDate: dayjs('2023-06-08'),
  sistareNumber: 'calculate Table',
  sistareDate: dayjs('2023-06-08'),
  sistareIntrareNumber: 'Global',
  sistareIntrareDate: dayjs('2023-06-08'),
  status: 'Handcrafted Gloves',
};

export const sampleWithNewData: NewLegalHold = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
