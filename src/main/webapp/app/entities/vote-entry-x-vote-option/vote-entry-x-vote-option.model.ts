import { IVoteEntry } from 'app/entities/vote-entry/vote-entry.model';
import { IVoteOption } from 'app/entities/vote-option/vote-option.model';

export interface IVoteEntryXVoteOption {
  id: number;
  voteEntry?: Pick<IVoteEntry, 'id'> | null;
  voteOption?: Pick<IVoteOption, 'id'> | null;
}

export type NewVoteEntryXVoteOption = Omit<IVoteEntryXVoteOption, 'id'> & { id: null };
