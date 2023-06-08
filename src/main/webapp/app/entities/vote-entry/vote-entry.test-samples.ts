import { IVoteEntry, NewVoteEntry } from './vote-entry.model';

export const sampleWithRequiredData: IVoteEntry = {
  id: 28565,
};

export const sampleWithPartialData: IVoteEntry = {
  id: 9517,
};

export const sampleWithFullData: IVoteEntry = {
  id: 59692,
};

export const sampleWithNewData: NewVoteEntry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
