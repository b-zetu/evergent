import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ShareholderFormService, ShareholderFormGroup } from './shareholder-form.service';
import { IShareholder } from '../shareholder.model';
import { ShareholderService } from '../service/shareholder.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

@Component({
  selector: 'jhi-shareholder-update',
  templateUrl: './shareholder-update.component.html',
})
export class ShareholderUpdateComponent implements OnInit {
  isSaving = false;
  shareholder: IShareholder | null = null;

  paymentOptionsSharedCollection: IPaymentOption[] = [];

  editForm: ShareholderFormGroup = this.shareholderFormService.createShareholderFormGroup();

  constructor(
    protected shareholderService: ShareholderService,
    protected shareholderFormService: ShareholderFormService,
    protected paymentOptionService: PaymentOptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePaymentOption = (o1: IPaymentOption | null, o2: IPaymentOption | null): boolean =>
    this.paymentOptionService.comparePaymentOption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholder }) => {
      this.shareholder = shareholder;
      if (shareholder) {
        this.updateForm(shareholder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shareholder = this.shareholderFormService.getShareholder(this.editForm);
    if (shareholder.id !== null) {
      this.subscribeToSaveResponse(this.shareholderService.update(shareholder));
    } else {
      this.subscribeToSaveResponse(this.shareholderService.create(shareholder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShareholder>>): void {
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

  protected updateForm(shareholder: IShareholder): void {
    this.shareholder = shareholder;
    this.shareholderFormService.resetForm(this.editForm, shareholder);

    this.paymentOptionsSharedCollection = this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(
      this.paymentOptionsSharedCollection,
      shareholder.paymentOption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paymentOptionService
      .query()
      .pipe(map((res: HttpResponse<IPaymentOption[]>) => res.body ?? []))
      .pipe(
        map((paymentOptions: IPaymentOption[]) =>
          this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(paymentOptions, this.shareholder?.paymentOption)
        )
      )
      .subscribe((paymentOptions: IPaymentOption[]) => (this.paymentOptionsSharedCollection = paymentOptions));
  }
}
