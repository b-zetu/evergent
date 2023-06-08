import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DividendShareholderFormService, DividendShareholderFormGroup } from './dividend-shareholder-form.service';
import { IDividendShareholder } from '../dividend-shareholder.model';
import { DividendShareholderService } from '../service/dividend-shareholder.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IDividendRegister } from 'app/entities/dividend-register/dividend-register.model';
import { DividendRegisterService } from 'app/entities/dividend-register/service/dividend-register.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

@Component({
  selector: 'jhi-dividend-shareholder-update',
  templateUrl: './dividend-shareholder-update.component.html',
})
export class DividendShareholderUpdateComponent implements OnInit {
  isSaving = false;
  dividendShareholder: IDividendShareholder | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  dividendRegistersSharedCollection: IDividendRegister[] = [];
  paymentOptionsSharedCollection: IPaymentOption[] = [];

  editForm: DividendShareholderFormGroup = this.dividendShareholderFormService.createDividendShareholderFormGroup();

  constructor(
    protected dividendShareholderService: DividendShareholderService,
    protected dividendShareholderFormService: DividendShareholderFormService,
    protected shareholderService: ShareholderService,
    protected dividendRegisterService: DividendRegisterService,
    protected paymentOptionService: PaymentOptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  compareDividendRegister = (o1: IDividendRegister | null, o2: IDividendRegister | null): boolean =>
    this.dividendRegisterService.compareDividendRegister(o1, o2);

  comparePaymentOption = (o1: IPaymentOption | null, o2: IPaymentOption | null): boolean =>
    this.paymentOptionService.comparePaymentOption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendShareholder }) => {
      this.dividendShareholder = dividendShareholder;
      if (dividendShareholder) {
        this.updateForm(dividendShareholder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dividendShareholder = this.dividendShareholderFormService.getDividendShareholder(this.editForm);
    if (dividendShareholder.id !== null) {
      this.subscribeToSaveResponse(this.dividendShareholderService.update(dividendShareholder));
    } else {
      this.subscribeToSaveResponse(this.dividendShareholderService.create(dividendShareholder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDividendShareholder>>): void {
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

  protected updateForm(dividendShareholder: IDividendShareholder): void {
    this.dividendShareholder = dividendShareholder;
    this.dividendShareholderFormService.resetForm(this.editForm, dividendShareholder);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      dividendShareholder.shareholder
    );
    this.dividendRegistersSharedCollection = this.dividendRegisterService.addDividendRegisterToCollectionIfMissing<IDividendRegister>(
      this.dividendRegistersSharedCollection,
      dividendShareholder.dividendRegister
    );
    this.paymentOptionsSharedCollection = this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(
      this.paymentOptionsSharedCollection,
      dividendShareholder.paymentOption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.dividendShareholder?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.dividendRegisterService
      .query()
      .pipe(map((res: HttpResponse<IDividendRegister[]>) => res.body ?? []))
      .pipe(
        map((dividendRegisters: IDividendRegister[]) =>
          this.dividendRegisterService.addDividendRegisterToCollectionIfMissing<IDividendRegister>(
            dividendRegisters,
            this.dividendShareholder?.dividendRegister
          )
        )
      )
      .subscribe((dividendRegisters: IDividendRegister[]) => (this.dividendRegistersSharedCollection = dividendRegisters));

    this.paymentOptionService
      .query()
      .pipe(map((res: HttpResponse<IPaymentOption[]>) => res.body ?? []))
      .pipe(
        map((paymentOptions: IPaymentOption[]) =>
          this.paymentOptionService.addPaymentOptionToCollectionIfMissing<IPaymentOption>(
            paymentOptions,
            this.dividendShareholder?.paymentOption
          )
        )
      )
      .subscribe((paymentOptions: IPaymentOption[]) => (this.paymentOptionsSharedCollection = paymentOptions));
  }
}
