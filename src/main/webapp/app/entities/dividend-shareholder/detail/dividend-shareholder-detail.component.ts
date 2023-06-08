import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDividendShareholder } from '../dividend-shareholder.model';

@Component({
  selector: 'jhi-dividend-shareholder-detail',
  templateUrl: './dividend-shareholder-detail.component.html',
})
export class DividendShareholderDetailComponent implements OnInit {
  dividendShareholder: IDividendShareholder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendShareholder }) => {
      this.dividendShareholder = dividendShareholder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
