import dayjs from 'dayjs/esm';

export interface IVoteProposal {
  id: number;
  title?: string | null;
  text?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewVoteProposal = Omit<IVoteProposal, 'id'> & { id: null };
