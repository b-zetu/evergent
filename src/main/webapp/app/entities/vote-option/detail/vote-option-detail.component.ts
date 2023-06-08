import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoteOption } from '../vote-option.model';

@Component({
  selector: 'jhi-vote-option-detail',
  templateUrl: './vote-option-detail.component.html',
})
export class VoteOptionDetailComponent implements OnInit {
  voteOption: IVoteOption | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteOption }) => {
      this.voteOption = voteOption;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
