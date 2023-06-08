import { IShareholder } from 'app/entities/shareholder/shareholder.model';

export interface ICommunication {
  id: number;
  type?: string | null;
  message?: string | null;
  status?: string | null;
  shareholder?: Pick<IShareholder, 'id'> | null;
}

export type NewCommunication = Omit<ICommunication, 'id'> & { id: null };
