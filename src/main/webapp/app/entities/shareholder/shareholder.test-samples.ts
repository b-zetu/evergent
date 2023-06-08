import { IShareholder, NewShareholder } from './shareholder.model';

export const sampleWithRequiredData: IShareholder = {
  id: 80337,
};

export const sampleWithPartialData: IShareholder = {
  id: 9153,
  shareholderIdDC: 39689,
  firstName: 'Stella',
  lastName: 'Hartmann',
  sharesNo: 83799,
  countryResidence: 'Books Investment',
  villageResidence: 78717,
  foreignLocalityResidence: 'Wooden',
  streetResidence: 'Granite',
};

export const sampleWithFullData: IShareholder = {
  id: 77605,
  shareholderIdDC: 15469,
  cnp: 'Automotive Human partnerships',
  firstName: 'Annie',
  lastName: 'Homenick',
  sharesNo: 83475,
  isPf: false,
  isResident: true,
  taxValue: 88160,
  status: 'Seychelles Baby',
  countryResidence: 'deposit',
  countyResidence: 75142,
  cityResidence: 88611,
  villageResidence: 71341,
  foreignLocalityResidence: 'Wooden productize',
  streetResidence: 'Borders Market',
  streetNo: 'payment content Progressive',
};

export const sampleWithNewData: NewShareholder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
