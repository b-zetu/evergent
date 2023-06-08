import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInheritance } from '../inheritance.model';

@Component({
  selector: 'jhi-inheritance-detail',
  templateUrl: './inheritance-detail.component.html',
})
export class InheritanceDetailComponent implements OnInit {
  inheritance: IInheritance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inheritance }) => {
      this.inheritance = inheritance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
