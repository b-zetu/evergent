import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ShareholderXInheritanceFormService, ShareholderXInheritanceFormGroup } from './shareholder-x-inheritance-form.service';
import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';
import { ShareholderXInheritanceService } from '../service/shareholder-x-inheritance.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IInheritance } from 'app/entities/inheritance/inheritance.model';
import { InheritanceService } from 'app/entities/inheritance/service/inheritance.service';

@Component({
  selector: 'jhi-shareholder-x-inheritance-update',
  templateUrl: './shareholder-x-inheritance-update.component.html',
})
export class ShareholderXInheritanceUpdateComponent implements OnInit {
  isSaving = false;
  shareholderXInheritance: IShareholderXInheritance | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  inheritancesSharedCollection: IInheritance[] = [];

  editForm: ShareholderXInheritanceFormGroup = this.shareholderXInheritanceFormService.createShareholderXInheritanceFormGroup();

  constructor(
    protected shareholderXInheritanceService: ShareholderXInheritanceService,
    protected shareholderXInheritanceFormService: ShareholderXInheritanceFormService,
    protected shareholderService: ShareholderService,
    protected inheritanceService: InheritanceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  compareInheritance = (o1: IInheritance | null, o2: IInheritance | null): boolean => this.inheritanceService.compareInheritance(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholderXInheritance }) => {
      this.shareholderXInheritance = shareholderXInheritance;
      if (shareholderXInheritance) {
        this.updateForm(shareholderXInheritance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shareholderXInheritance = this.shareholderXInheritanceFormService.getShareholderXInheritance(this.editForm);
    if (shareholderXInheritance.id !== null) {
      this.subscribeToSaveResponse(this.shareholderXInheritanceService.update(shareholderXInheritance));
    } else {
      this.subscribeToSaveResponse(this.shareholderXInheritanceService.create(shareholderXInheritance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShareholderXInheritance>>): void {
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

  protected updateForm(shareholderXInheritance: IShareholderXInheritance): void {
    this.shareholderXInheritance = shareholderXInheritance;
    this.shareholderXInheritanceFormService.resetForm(this.editForm, shareholderXInheritance);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      shareholderXInheritance.deceased,
      shareholderXInheritance.receiver
    );
    this.inheritancesSharedCollection = this.inheritanceService.addInheritanceToCollectionIfMissing<IInheritance>(
      this.inheritancesSharedCollection,
      shareholderXInheritance.inheritance
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
            shareholders,
            this.shareholderXInheritance?.deceased,
            this.shareholderXInheritance?.receiver
          )
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.inheritanceService
      .query()
      .pipe(map((res: HttpResponse<IInheritance[]>) => res.body ?? []))
      .pipe(
        map((inheritances: IInheritance[]) =>
          this.inheritanceService.addInheritanceToCollectionIfMissing<IInheritance>(inheritances, this.shareholderXInheritance?.inheritance)
        )
      )
      .subscribe((inheritances: IInheritance[]) => (this.inheritancesSharedCollection = inheritances));
  }
}
