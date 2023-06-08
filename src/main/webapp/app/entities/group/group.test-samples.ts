import { IGroup, NewGroup } from './group.model';

export const sampleWithRequiredData: IGroup = {
  id: 82913,
};

export const sampleWithPartialData: IGroup = {
  id: 53984,
};

export const sampleWithFullData: IGroup = {
  id: 48998,
  name: 'Account Infrastructure withdrawal',
  code: 'calculating benchmark',
};

export const sampleWithNewData: NewGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
