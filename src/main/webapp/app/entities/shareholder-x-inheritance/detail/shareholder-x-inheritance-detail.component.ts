import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';

@Component({
  selector: 'jhi-shareholder-x-inheritance-detail',
  templateUrl: './shareholder-x-inheritance-detail.component.html',
})
export class ShareholderXInheritanceDetailComponent implements OnInit {
  shareholderXInheritance: IShareholderXInheritance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholderXInheritance }) => {
      this.shareholderXInheritance = shareholderXInheritance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
