import { IShareholderXInheritance, NewShareholderXInheritance } from './shareholder-x-inheritance.model';

export const sampleWithRequiredData: IShareholderXInheritance = {
  id: 4257,
};

export const sampleWithPartialData: IShareholderXInheritance = {
  id: 3454,
};

export const sampleWithFullData: IShareholderXInheritance = {
  id: 75805,
};

export const sampleWithNewData: NewShareholderXInheritance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
