import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommunicationFormService, CommunicationFormGroup } from './communication-form.service';
import { ICommunication } from '../communication.model';
import { CommunicationService } from '../service/communication.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';

@Component({
  selector: 'jhi-communication-update',
  templateUrl: './communication-update.component.html',
})
export class CommunicationUpdateComponent implements OnInit {
  isSaving = false;
  communication: ICommunication | null = null;

  shareholdersSharedCollection: IShareholder[] = [];

  editForm: CommunicationFormGroup = this.communicationFormService.createCommunicationFormGroup();

  constructor(
    protected communicationService: CommunicationService,
    protected communicationFormService: CommunicationFormService,
    protected shareholderService: ShareholderService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ communication }) => {
      this.communication = communication;
      if (communication) {
        this.updateForm(communication);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const communication = this.communicationFormService.getCommunication(this.editForm);
    if (communication.id !== null) {
      this.subscribeToSaveResponse(this.communicationService.update(communication));
    } else {
      this.subscribeToSaveResponse(this.communicationService.create(communication));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommunication>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(communication: ICommunication): void {
    this.communication = communication;
    this.communicationFormService.resetForm(this.editForm, communication);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      communication.shareholder
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.communication?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));
  }
}
