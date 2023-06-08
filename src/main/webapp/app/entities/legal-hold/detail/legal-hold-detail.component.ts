import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILegalHold } from '../legal-hold.model';

@Component({
  selector: 'jhi-legal-hold-detail',
  templateUrl: './legal-hold-detail.component.html',
})
export class LegalHoldDetailComponent implements OnInit {
  legalHold: ILegalHold | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalHold }) => {
      this.legalHold = legalHold;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
