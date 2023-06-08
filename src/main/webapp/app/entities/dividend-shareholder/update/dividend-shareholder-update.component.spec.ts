import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DividendShareholderFormService } from './dividend-shareholder-form.service';
import { DividendShareholderService } from '../service/dividend-shareholder.service';
import { IDividendShareholder } from '../dividend-shareholder.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IDividendRegister } from 'app/entities/dividend-register/dividend-register.model';
import { DividendRegisterService } from 'app/entities/dividend-register/service/dividend-register.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

import { DividendShareholderUpdateComponent } from './dividend-shareholder-update.component';

describe('DividendShareholder Management Update Component', () => {
  let comp: DividendShareholderUpdateComponent;
  let fixture: ComponentFixture<DividendShareholderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dividendShareholderFormService: DividendShareholderFormService;
  let dividendShareholderService: DividendShareholderService;
  let shareholderService: ShareholderService;
  let dividendRegisterService: DividendRegisterService;
  let paymentOptionService: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DividendShareholderUpdateComponent],
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
      .overrideTemplate(DividendShareholderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendShareholderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dividendShareholderFormService = TestBed.inject(DividendShareholderFormService);
    dividendShareholderService = TestBed.inject(DividendShareholderService);
    shareholderService = TestBed.inject(ShareholderService);
    dividendRegisterService = TestBed.inject(DividendRegisterService);
    paymentOptionService = TestBed.inject(PaymentOptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const dividendShareholder: IDividendShareholder = { id: 456 };
      const shareholder: IShareholder = { id: 43479 };
      dividendShareholder.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 55458 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DividendRegister query and add missing value', () => {
      const dividendShareholder: IDividendShareholder = { id: 456 };
      const dividendRegister: IDividendRegister = { id: 3640 };
      dividendShareholder.dividendRegister = dividendRegister;

      const dividendRegisterCollection: IDividendRegister[] = [{ id: 59745 }];
      jest.spyOn(dividendRegisterService, 'query').mockReturnValue(of(new HttpResponse({ body: dividendRegisterCollection })));
      const additionalDividendRegisters = [dividendRegister];
      const expectedCollection: IDividendRegister[] = [...additionalDividendRegisters, ...dividendRegisterCollection];
      jest.spyOn(dividendRegisterService, 'addDividendRegisterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      expect(dividendRegisterService.query).toHaveBeenCalled();
      expect(dividendRegisterService.addDividendRegisterToCollectionIfMissing).toHaveBeenCalledWith(
        dividendRegisterCollection,
        ...additionalDividendRegisters.map(expect.objectContaining)
      );
      expect(comp.dividendRegistersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentOption query and add missing value', () => {
      const dividendShareholder: IDividendShareholder = { id: 456 };
      const paymentOption: IPaymentOption = { id: 70347 };
      dividendShareholder.paymentOption = paymentOption;

      const paymentOptionCollection: IPaymentOption[] = [{ id: 99683 }];
      jest.spyOn(paymentOptionService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentOptionCollection })));
      const additionalPaymentOptions = [paymentOption];
      const expectedCollection: IPaymentOption[] = [...additionalPaymentOptions, ...paymentOptionCollection];
      jest.spyOn(paymentOptionService, 'addPaymentOptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      expect(paymentOptionService.query).toHaveBeenCalled();
      expect(paymentOptionService.addPaymentOptionToCollectionIfMissing).toHaveBeenCalledWith(
        paymentOptionCollection,
        ...additionalPaymentOptions.map(expect.objectContaining)
      );
      expect(comp.paymentOptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dividendShareholder: IDividendShareholder = { id: 456 };
      const shareholder: IShareholder = { id: 42814 };
      dividendShareholder.shareholder = shareholder;
      const dividendRegister: IDividendRegister = { id: 9575 };
      dividendShareholder.dividendRegister = dividendRegister;
      const paymentOption: IPaymentOption = { id: 13918 };
      dividendShareholder.paymentOption = paymentOption;

      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.dividendRegistersSharedCollection).toContain(dividendRegister);
      expect(comp.paymentOptionsSharedCollection).toContain(paymentOption);
      expect(comp.dividendShareholder).toEqual(dividendShareholder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendShareholder>>();
      const dividendShareholder = { id: 123 };
      jest.spyOn(dividendShareholderFormService, 'getDividendShareholder').mockReturnValue(dividendShareholder);
      jest.spyOn(dividendShareholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendShareholder }));
      saveSubject.complete();

      // THEN
      expect(dividendShareholderFormService.getDividendShareholder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dividendShareholderService.update).toHaveBeenCalledWith(expect.objectContaining(dividendShareholder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendShareholder>>();
      const dividendShareholder = { id: 123 };
      jest.spyOn(dividendShareholderFormService, 'getDividendShareholder').mockReturnValue({ id: null });
      jest.spyOn(dividendShareholderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendShareholder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendShareholder }));
      saveSubject.complete();

      // THEN
      expect(dividendShareholderFormService.getDividendShareholder).toHaveBeenCalled();
      expect(dividendShareholderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendShareholder>>();
      const dividendShareholder = { id: 123 };
      jest.spyOn(dividendShareholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendShareholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dividendShareholderService.update).toHaveBeenCalled();
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

    describe('compareDividendRegister', () => {
      it('Should forward to dividendRegisterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dividendRegisterService, 'compareDividendRegister');
        comp.compareDividendRegister(entity, entity2);
        expect(dividendRegisterService.compareDividendRegister).toHaveBeenCalledWith(entity, entity2);
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
