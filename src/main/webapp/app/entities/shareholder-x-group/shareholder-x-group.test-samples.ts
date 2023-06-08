import { IShareholderXGroup, NewShareholderXGroup } from './shareholder-x-group.model';

export const sampleWithRequiredData: IShareholderXGroup = {
  id: 18693,
};

export const sampleWithPartialData: IShareholderXGroup = {
  id: 19095,
};

export const sampleWithFullData: IShareholderXGroup = {
  id: 11829,
};

export const sampleWithNewData: NewShareholderXGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
