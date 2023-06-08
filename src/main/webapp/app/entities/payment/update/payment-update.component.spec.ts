import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFormService } from './payment-form.service';
import { PaymentService } from '../service/payment.service';
import { IPayment } from '../payment.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IDividendCalculation } from 'app/entities/dividend-calculation/dividend-calculation.model';
import { DividendCalculationService } from 'app/entities/dividend-calculation/service/dividend-calculation.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

import { PaymentUpdateComponent } from './payment-update.component';

describe('Payment Management Update Component', () => {
  let comp: PaymentUpdateComponent;
  let fixture: ComponentFixture<PaymentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFormService: PaymentFormService;
  let paymentService: PaymentService;
  let shareholderService: ShareholderService;
  let dividendCalculationService: DividendCalculationService;
  let paymentOptionService: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PaymentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentFormService = TestBed.inject(PaymentFormService);
    paymentService = TestBed.inject(PaymentService);
    shareholderService = TestBed.inject(ShareholderService);
    dividendCalculationService = TestBed.inject(DividendCalculationService);
    paymentOptionService = TestBed.inject(PaymentOptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const payment: IPayment = { id: 456 };
      const shareholder: IShareholder = { id: 53793 };
      payment.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 60780 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DividendCalculation query and add missing value', () => {
      const payment: IPayment = { id: 456 };
      const dividendCalculation: IDividendCalculation = { id: 69226 };
      payment.dividendCalculation = dividendCalculation;

      const dividendCalculationCollection: IDividendCalculation[] = [{ id: 22299 }];
      jest.spyOn(dividendCalculationService, 'query').mockReturnValue(of(new HttpResponse({ body: dividendCalculationCollection })));
      const additionalDividendCalculations = [dividendCalculation];
      const expectedCollection: IDividendCalculation[] = [...additionalDividendCalculations, ...dividendCalculationCollection];
      jest.spyOn(dividendCalculationService, 'addDividendCalculationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(dividendCalculationService.query).toHaveBeenCalled();
      expect(dividendCalculationService.addDividendCalculationToCollectionIfMissing).toHaveBeenCalledWith(
        dividendCalculationCollection,
        ...additionalDividendCalculations.map(expect.objectContaining)
      );
      expect(comp.dividendCalculationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentOption query and add missing value', () => {
      const payment: IPayment = { id: 456 };
      const paymentOption: IPaymentOption = { id: 71944 };
      payment.paymentOption = paymentOption;

      const paymentOptionCollection: IPaymentOption[] = [{ id: 230 }];
      jest.spyOn(paymentOptionService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentOptionCollection })));
      const additionalPaymentOptions = [paymentOption];
      const expectedCollection: IPaymentOption[] = [...additionalPaymentOptions, ...paymentOptionCollection];
      jest.spyOn(paymentOptionService, 'addPaymentOptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(paymentOptionService.query).toHaveBeenCalled();
      expect(paymentOptionService.addPaymentOptionToCollectionIfMissing).toHaveBeenCalledWith(
        paymentOptionCollection,
        ...additionalPaymentOptions.map(expect.objectContaining)
      );
      expect(comp.paymentOptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const payment: IPayment = { id: 456 };
      const shareholder: IShareholder = { id: 40043 };
      payment.shareholder = shareholder;
      const dividendCalculation: IDividendCalculation = { id: 31003 };
      payment.dividendCalculation = dividendCalculation;
      const paymentOption: IPaymentOption = { id: 55689 };
      payment.paymentOption = paymentOption;

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.dividendCalculationsSharedCollection).toContain(dividendCalculation);
      expect(comp.paymentOptionsSharedCollection).toContain(paymentOption);
      expect(comp.payment).toEqual(payment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayment>>();
      const payment = { id: 123 };
      jest.spyOn(paymentFormService, 'getPayment').mockReturnValue(payment);
      jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payment }));
      saveSubject.complete();

      // THEN
      expect(paymentFormService.getPayment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentService.update).toHaveBeenCalledWith(expect.objectContaining(payment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayment>>();
      const payment = { id: 123 };
      jest.spyOn(paymentFormService, 'getPayment').mockReturnValue({ id: null });
      jest.spyOn(paymentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payment }));
      saveSubject.complete();

      // THEN
      expect(paymentFormService.getPayment).toHaveBeenCalled();
      expect(paymentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPayment>>();
      const payment = { id: 123 };
      jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareShareholder', () => {
      it('Should forward to shareholderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shareholderService, 'compareShareholder');
        comp.compareShareholder(entity, entity2);
        expect(shareholderService.compareShareholder).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDividendCalculation', () => {
      it('Should forward to dividendCalculationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dividendCalculationService, 'compareDividendCalculation');
        comp.compareDividendCalculation(entity, entity2);
        expect(dividendCalculationService.compareDividendCalculation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePaymentOption', () => {
      it('Should forward to paymentOptionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(paymentOptionService, 'comparePaymentOption');
        comp.comparePaymentOption(entity, entity2);
        expect(paymentOptionService.comparePaymentOption).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
