import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IInheritance } from 'app/entities/inheritance/inheritance.model';

export interface IShareholderXInheritance {
  id: number;
  deceased?: Pick<IShareholder, 'id'> | null;
  receiver?: Pick<IShareholder, 'id'> | null;
  inheritance?: Pick<IInheritance, 'id'> | null;
}

export type NewShareholderXInheritance = Omit<IShareholderXInheritance, 'id'> & { id: null };
