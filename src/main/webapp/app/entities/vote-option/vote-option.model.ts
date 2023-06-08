import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';

export interface IVoteOption {
  id: number;
  code?: string | null;
  text?: string | null;
  voteProposal?: Pick<IVoteProposal, 'id'> | null;
}

export type NewVoteOption = Omit<IVoteOption, 'id'> & { id: null };
