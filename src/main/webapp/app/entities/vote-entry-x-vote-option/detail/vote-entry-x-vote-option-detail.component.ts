import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';

@Component({
  selector: 'jhi-vote-entry-x-vote-option-detail',
  templateUrl: './vote-entry-x-vote-option-detail.component.html',
})
export class VoteEntryXVoteOptionDetailComponent implements OnInit {
  voteEntryXVoteOption: IVoteEntryXVoteOption | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteEntryXVoteOption }) => {
      this.voteEntryXVoteOption = voteEntryXVoteOption;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
