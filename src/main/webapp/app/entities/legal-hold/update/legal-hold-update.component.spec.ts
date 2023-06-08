import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LegalHoldFormService } from './legal-hold-form.service';
import { LegalHoldService } from '../service/legal-hold.service';
import { ILegalHold } from '../legal-hold.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

import { LegalHoldUpdateComponent } from './legal-hold-update.component';

describe('LegalHold Management Update Component', () => {
  let comp: LegalHoldUpdateComponent;
  let fixture: ComponentFixture<LegalHoldUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let legalHoldFormService: LegalHoldFormService;
  let legalHoldService: LegalHoldService;
  let shareholderService: ShareholderService;
  let paymentOptionService: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LegalHoldUpdateComponent],
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
      .overrideTemplate(LegalHoldUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LegalHoldUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    legalHoldFormService = TestBed.inject(LegalHoldFormService);
    legalHoldService = TestBed.inject(LegalHoldService);
    shareholderService = TestBed.inject(ShareholderService);
    paymentOptionService = TestBed.inject(PaymentOptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const legalHold: ILegalHold = { id: 456 };
      const shareholder: IShareholder = { id: 55980 };
      legalHold.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 78291 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ legalHold });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentOption query and add missing value', () => {
      const legalHold: ILegalHold = { id: 456 };
      const paymentOption: IPaymentOption = { id: 60428 };
      legalHold.paymentOption = paymentOption;

      const paymentOptionCollection: IPaymentOption[] = [{ id: 31435 }];
      jest.spyOn(paymentOptionService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentOptionCollection })));
      const additionalPaymentOptions = [paymentOption];
      const expectedCollection: IPaymentOption[] = [...additionalPaymentOptions, ...paymentOptionCollection];
      jest.spyOn(paymentOptionService, 'addPaymentOptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ legalHold });
      comp.ngOnInit();

      expect(paymentOptionService.query).toHaveBeenCalled();
      expect(paymentOptionService.addPaymentOptionToCollectionIfMissing).toHaveBeenCalledWith(
        paymentOptionCollection,
        ...additionalPaymentOptions.map(expect.objectContaining)
      );
      expect(comp.paymentOptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const legalHold: ILegalHold = { id: 456 };
      const shareholder: IShareholder = { id: 57102 };
      legalHold.shareholder = shareholder;
      const paymentOption: IPaymentOption = { id: 95317 };
      legalHold.paymentOption = paymentOption;

      activatedRoute.data = of({ legalHold });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.paymentOptionsSharedCollection).toContain(paymentOption);
      expect(comp.legalHold).toEqual(legalHold);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalHold>>();
      const legalHold = { id: 123 };
      jest.spyOn(legalHoldFormService, 'getLegalHold').mockReturnValue(legalHold);
      jest.spyOn(legalHoldService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalHold });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalHold }));
      saveSubject.complete();

      // THEN
      expect(legalHoldFormService.getLegalHold).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(legalHoldService.update).toHaveBeenCalledWith(expect.objectContaining(legalHold));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalHold>>();
      const legalHold = { id: 123 };
      jest.spyOn(legalHoldFormService, 'getLegalHold').mockReturnValue({ id: null });
      jest.spyOn(legalHoldService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalHold: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalHold }));
      saveSubject.complete();

      // THEN
      expect(legalHoldFormService.getLegalHold).toHaveBeenCalled();
      expect(legalHoldService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILegalHold>>();
      const legalHold = { id: 123 };
      jest.spyOn(legalHoldService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalHold });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(legalHoldService.update).toHaveBeenCalled();
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
