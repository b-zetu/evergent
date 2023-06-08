import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoteProposal } from '../vote-proposal.model';

@Component({
  selector: 'jhi-vote-proposal-detail',
  templateUrl: './vote-proposal-detail.component.html',
})
export class VoteProposalDetailComponent implements OnInit {
  voteProposal: IVoteProposal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteProposal }) => {
      this.voteProposal = voteProposal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
