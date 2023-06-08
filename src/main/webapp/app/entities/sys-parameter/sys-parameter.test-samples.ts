import { ISysParameter, NewSysParameter } from './sys-parameter.model';

export const sampleWithRequiredData: ISysParameter = {
  id: 77242,
};

export const sampleWithPartialData: ISysParameter = {
  id: 94151,
  value: 'concept digital Alabama',
};

export const sampleWithFullData: ISysParameter = {
  id: 42095,
  key: 'Multi-layered',
  value: 'virtual Books Franc',
};

export const sampleWithNewData: NewSysParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
