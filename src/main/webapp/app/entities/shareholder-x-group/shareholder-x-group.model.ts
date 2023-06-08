import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IGroup } from 'app/entities/group/group.model';

export interface IShareholderXGroup {
  id: number;
  shareholder?: Pick<IShareholder, 'id'> | null;
  group?: Pick<IGroup, 'id'> | null;
}

export type NewShareholderXGroup = Omit<IShareholderXGroup, 'id'> & { id: null };
