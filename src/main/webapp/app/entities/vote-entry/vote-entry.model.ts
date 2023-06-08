import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';

export interface IVoteEntry {
  id: number;
  shareholder?: Pick<IShareholder, 'id'> | null;
  voteProposal?: Pick<IVoteProposal, 'id'> | null;
}

export type NewVoteEntry = Omit<IVoteEntry, 'id'> & { id: null };
