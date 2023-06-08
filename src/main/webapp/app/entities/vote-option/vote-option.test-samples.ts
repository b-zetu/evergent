import { IVoteOption, NewVoteOption } from './vote-option.model';

export const sampleWithRequiredData: IVoteOption = {
  id: 75501,
};

export const sampleWithPartialData: IVoteOption = {
  id: 49346,
  text: 'sensor payment approach',
};

export const sampleWithFullData: IVoteOption = {
  id: 68293,
  code: 'transmitting Avon',
  text: 'Toys Jewelery',
};

export const sampleWithNewData: NewVoteOption = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
