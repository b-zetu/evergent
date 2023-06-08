import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DividendCalculationFormService, DividendCalculationFormGroup } from './dividend-calculation-form.service';
import { IDividendCalculation } from '../dividend-calculation.model';
import { DividendCalculationService } from '../service/dividend-calculation.service';
import { IDividendShareholder } from 'app/entities/dividend-shareholder/dividend-shareholder.model';
import { DividendShareholderService } from 'app/entities/dividend-shareholder/service/dividend-shareholder.service';

@Component({
  selector: 'jhi-dividend-calculation-update',
  templateUrl: './dividend-calculation-update.component.html',
})
export class DividendCalculationUpdateComponent implements OnInit {
  isSaving = false;
  dividendCalculation: IDividendCalculation | null = null;

  dividendShareholdersSharedCollection: IDividendShareholder[] = [];

  editForm: DividendCalculationFormGroup = this.dividendCalculationFormService.createDividendCalculationFormGroup();

  constructor(
    protected dividendCalculationService: DividendCalculationService,
    protected dividendCalculationFormService: DividendCalculationFormService,
    protected dividendShareholderService: DividendShareholderService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDividendShareholder = (o1: IDividendShareholder | null, o2: IDividendShareholder | null): boolean =>
    this.dividendShareholderService.compareDividendShareholder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendCalculation }) => {
      this.dividendCalculation = dividendCalculation;
      if (dividendCalculation) {
        this.updateForm(dividendCalculation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dividendCalculation = this.dividendCalculationFormService.getDividendCalculation(this.editForm);
    if (dividendCalculation.id !== null) {
      this.subscribeToSaveResponse(this.dividendCalculationService.update(dividendCalculation));
    } else {
      this.subscribeToSaveResponse(this.dividendCalculationService.create(dividendCalculation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDividendCalculation>>): void {
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

  protected updateForm(dividendCalculation: IDividendCalculation): void {
    this.dividendCalculation = dividendCalculation;
    this.dividendCalculationFormService.resetForm(this.editForm, dividendCalculation);

    this.dividendShareholdersSharedCollection =
      this.dividendShareholderService.addDividendShareholderToCollectionIfMissing<IDividendShareholder>(
        this.dividendShareholdersSharedCollection,
        dividendCalculation.dividendShareholder
      );
  }

  protected loadRelationshipsOptions(): void {
    this.dividendShareholderService
      .query()
      .pipe(map((res: HttpResponse<IDividendShareholder[]>) => res.body ?? []))
      .pipe(
        map((dividendShareholders: IDividendShareholder[]) =>
          this.dividendShareholderService.addDividendShareholderToCollectionIfMissing<IDividendShareholder>(
            dividendShareholders,
            this.dividendCalculation?.dividendShareholder
          )
        )
      )
      .subscribe((dividendShareholders: IDividendShareholder[]) => (this.dividendShareholdersSharedCollection = dividendShareholders));
  }
}
