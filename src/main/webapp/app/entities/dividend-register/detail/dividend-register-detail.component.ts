import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDividendRegister } from '../dividend-register.model';

@Component({
  selector: 'jhi-dividend-register-detail',
  templateUrl: './dividend-register-detail.component.html',
})
export class DividendRegisterDetailComponent implements OnInit {
  dividendRegister: IDividendRegister | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendRegister }) => {
      this.dividendRegister = dividendRegister;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
