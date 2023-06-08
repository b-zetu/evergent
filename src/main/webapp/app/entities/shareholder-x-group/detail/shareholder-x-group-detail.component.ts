import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShareholderXGroup } from '../shareholder-x-group.model';

@Component({
  selector: 'jhi-shareholder-x-group-detail',
  templateUrl: './shareholder-x-group-detail.component.html',
})
export class ShareholderXGroupDetailComponent implements OnInit {
  shareholderXGroup: IShareholderXGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholderXGroup }) => {
      this.shareholderXGroup = shareholderXGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
