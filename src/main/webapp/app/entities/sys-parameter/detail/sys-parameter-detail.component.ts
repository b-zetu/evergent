import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISysParameter } from '../sys-parameter.model';

@Component({
  selector: 'jhi-sys-parameter-detail',
  templateUrl: './sys-parameter-detail.component.html',
})
export class SysParameterDetailComponent implements OnInit {
  sysParameter: ISysParameter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sysParameter }) => {
      this.sysParameter = sysParameter;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
