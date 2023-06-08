import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommunication } from '../communication.model';

@Component({
  selector: 'jhi-communication-detail',
  templateUrl: './communication-detail.component.html',
})
export class CommunicationDetailComponent implements OnInit {
  communication: ICommunication | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ communication }) => {
      this.communication = communication;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
