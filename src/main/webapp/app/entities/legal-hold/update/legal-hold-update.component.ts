import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LegalHoldFormService, LegalHoldFormGroup } from './legal-hold-form.service';
import { ILegalHold } from '../legal-hold.model';
import { LegalHoldService } from '../service/legal-hold.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

@Component({
  selector: 'jhi-legal-hold-update',
  templateUrl: './legal-hold-update.component.html',
})
export class LegalHoldUpdateComponent implements OnInit {
  isSaving = false;
  legalHold: ILegalHold | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  paymentOptionsSharedCollection: IPaymentOption[] = [];

  editForm: LegalHoldFormGroup = this.legalHoldFormService.createLegalHoldFormGroup();

  constructor(
    protected legalHoldService: LegalHoldService,
    protected legalHoldFormService: LegalHoldFormService,
    protected shareholderService: ShareholderService,
    protected paymentOptionService: PaymentOptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  comparePaymentOption = (o1: IPaymentOption | null, o2: IPaymentOption | null): boolean =>
    this.paymentOptionService.comparePaymentOption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalHold }) => {
      this.legalHold = legalHold;
      if (legalHold) {
        this.updateForm(legalHold);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const legalHold = this.legalHoldFormService.getLegalHold(this.editForm);
    if (legalHold.id !== null) {
      this.subscribeToSaveResponse(this.legalHoldService.update(legalHold));
    } else {
      this.subscribeToSaveResponse(this.legalHoldService.create(legalHold));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILegalHold>>): void {
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

  protected updateForm(legalHold: ILegalHold): void {
    this.legalHold = legalHold;
    this.legalHoldFormService.resetForm(this.editForm, legalHold);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      legalHold.shareholder
    );
    this.paymentOptionsSharedCollection = this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(
      this.paymentOptionsSharedCollection,
      legalHold.paymentOption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.legalHold?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.paymentOptionService
      .query()
      .pipe(map((res: HttpResponse<IPaymentOption[]>) => res.body ?? []))
      .pipe(
        map((paymentOptions: IPaymentOption[]) =>
          this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(paymentOptions, this.legalHold?.paymentOption)
        )
      )
      .subscribe((paymentOptions: IPaymentOption[]) => (this.paymentOptionsSharedCollection = paymentOptions));
  }
}
