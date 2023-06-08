import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDividendCalculation } from '../dividend-calculation.model';

@Component({
  selector: 'jhi-dividend-calculation-detail',
  templateUrl: './dividend-calculation-detail.component.html',
})
export class DividendCalculationDetailComponent implements OnInit {
  dividendCalculation: IDividendCalculation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendCalculation }) => {
      this.dividendCalculation = dividendCalculation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
