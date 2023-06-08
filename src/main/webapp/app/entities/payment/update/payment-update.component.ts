import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PaymentFormService, PaymentFormGroup } from './payment-form.service';
import { IPayment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IDividendCalculation } from 'app/entities/dividend-calculation/dividend-calculation.model';
import { DividendCalculationService } from 'app/entities/dividend-calculation/service/dividend-calculation.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;
  payment: IPayment | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  dividendCalculationsSharedCollection: IDividendCalculation[] = [];
  paymentOptionsSharedCollection: IPaymentOption[] = [];

  editForm: PaymentFormGroup = this.paymentFormService.createPaymentFormGroup();

  constructor(
    protected paymentService: PaymentService,
    protected paymentFormService: PaymentFormService,
    protected shareholderService: ShareholderService,
    protected dividendCalculationService: DividendCalculationService,
    protected paymentOptionService: PaymentOptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  compareDividendCalculation = (o1: IDividendCalculation | null, o2: IDividendCalculation | null): boolean =>
    this.dividendCalculationService.compareDividendCalculation(o1, o2);

  comparePaymentOption = (o1: IPaymentOption | null, o2: IPaymentOption | null): boolean =>
    this.paymentOptionService.comparePaymentOption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.payment = payment;
      if (payment) {
        this.updateForm(payment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.paymentFormService.getPayment(this.editForm);
    if (payment.id !== null) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
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

  protected updateForm(payment: IPayment): void {
    this.payment = payment;
    this.paymentFormService.resetForm(this.editForm, payment);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      payment.shareholder
    );
    this.dividendCalculationsSharedCollection =
      this.dividendCalculationService.addDividendCalculationToCollectionIfMissing<IDividendCalculation>(
        this.dividendCalculationsSharedCollection,
        payment.dividendCalculation
      );
    this.paymentOptionsSharedCollection = this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(
      this.paymentOptionsSharedCollection,
      payment.paymentOption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.payment?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.dividendCalculationService
      .query()
      .pipe(map((res: HttpResponse<IDividendCalculation[]>) => res.body ?? []))
      .pipe(
        map((dividendCalculations: IDividendCalculation[]) =>
          this.dividendCalculationService.addDividendCalculationToCollectionIfMissing<IDividendCalculation>(
            dividendCalculations,
            this.payment?.dividendCalculation
          )
        )
      )
      .subscribe((dividendCalculations: IDividendCalculation[]) => (this.dividendCalculationsSharedCollection = dividendCalculations));

    this.paymentOptionService
      .query()
      .pipe(map((res: HttpResponse<IPaymentOption[]>) => res.body ?? []))
      .pipe(
        map((paymentOptions: IPaymentOption[]) =>
          this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(paymentOptions, this.payment?.paymentOption)
        )
      )
      .subscribe((paymentOptions: IPaymentOption[]) => (this.paymentOptionsSharedCollection = paymentOptions));
  }
}
