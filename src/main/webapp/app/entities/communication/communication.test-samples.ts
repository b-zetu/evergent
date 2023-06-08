import { ICommunication, NewCommunication } from './communication.model';

export const sampleWithRequiredData: ICommunication = {
  id: 28754,
};

export const sampleWithPartialData: ICommunication = {
  id: 12881,
  message: 'Frozen',
};

export const sampleWithFullData: ICommunication = {
  id: 69539,
  type: 'mission-critical',
  message: 'Investment Senior',
  status: 'Belarussian Norfolk network',
};

export const sampleWithNewData: NewCommunication = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
