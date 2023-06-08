import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShareholder } from '../shareholder.model';

@Component({
  selector: 'jhi-shareholder-detail',
  templateUrl: './shareholder-detail.component.html',
})
export class ShareholderDetailComponent implements OnInit {
  shareholder: IShareholder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholder }) => {
      this.shareholder = shareholder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
