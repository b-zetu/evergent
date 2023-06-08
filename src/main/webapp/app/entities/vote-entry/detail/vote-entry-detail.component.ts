import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoteEntry } from '../vote-entry.model';

@Component({
  selector: 'jhi-vote-entry-detail',
  templateUrl: './vote-entry-detail.component.html',
})
export class VoteEntryDetailComponent implements OnInit {
  voteEntry: IVoteEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteEntry }) => {
      this.voteEntry = voteEntry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
