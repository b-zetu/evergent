import dayjs from 'dayjs/esm';

import { IVoteProposal, NewVoteProposal } from './vote-proposal.model';

export const sampleWithRequiredData: IVoteProposal = {
  id: 4508,
};

export const sampleWithPartialData: IVoteProposal = {
  id: 23421,
  title: 'Ouguiya AI e-services',
  startDate: dayjs('2023-06-08'),
  endDate: dayjs('2023-06-07'),
  status: 'Circle transparent',
};

export const sampleWithFullData: IVoteProposal = {
  id: 33893,
  title: 'interactive enhance Cotton',
  text: 'TCP interactive Colon',
  startDate: dayjs('2023-06-07'),
  endDate: dayjs('2023-06-07'),
  status: 'Berkshire Cambridgeshire Vision-oriented',
};

export const sampleWithNewData: NewVoteProposal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
