import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShareholderFormService } from './shareholder-form.service';
import { ShareholderService } from '../service/shareholder.service';
import { IShareholder } from '../shareholder.model';
import { IPaymentOption } from 'app/entities/payment-option/payment-option.model';
import { PaymentOptionService } from 'app/entities/payment-option/service/payment-option.service';

import { ShareholderUpdateComponent } from './shareholder-update.component';

describe('Shareholder Management Update Component', () => {
  let comp: ShareholderUpdateComponent;
  let fixture: ComponentFixture<ShareholderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shareholderFormService: ShareholderFormService;
  let shareholderService: ShareholderService;
  let paymentOptionService: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShareholderUpdateComponent],
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
      .overrideTemplate(ShareholderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shareholderFormService = TestBed.inject(ShareholderFormService);
    shareholderService = TestBed.inject(ShareholderService);
    paymentOptionService = TestBed.inject(PaymentOptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PaymentOption query and add missing value', () => {
      const shareholder: IShareholder = { id: 456 };
      const paymentOption: IPaymentOption = { id: 10707 };
      shareholder.paymentOption = paymentOption;

      const paymentOptionCollection: IPaymentOption[] = [{ id: 63984 }];
      jest.spyOn(paymentOptionService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentOptionCollection })));
      const additionalPaymentOptions = [paymentOption];
      const expectedCollection: IPaymentOption[] = [...additionalPaymentOptions, ...paymentOptionCollection];
      jest.spyOn(paymentOptionService, 'addPaymentOptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shareholder });
      comp.ngOnInit();

      expect(paymentOptionService.query).toHaveBeenCalled();
      expect(paymentOptionService.addPaymentOptionToCollectionIfMissing).toHaveBeenCalledWith(
        paymentOptionCollection,
        ...additionalPaymentOptions.map(expect.objectContaining)
      );
      expect(comp.paymentOptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shareholder: IShareholder = { id: 456 };
      const paymentOption: IPaymentOption = { id: 77697 };
      shareholder.paymentOption = paymentOption;

      activatedRoute.data = of({ shareholder });
      comp.ngOnInit();

      expect(comp.paymentOptionsSharedCollection).toContain(paymentOption);
      expect(comp.shareholder).toEqual(shareholder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholder>>();
      const shareholder = { id: 123 };
      jest.spyOn(shareholderFormService, 'getShareholder').mockReturnValue(shareholder);
      jest.spyOn(shareholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholder }));
      saveSubject.complete();

      // THEN
      expect(shareholderFormService.getShareholder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shareholderService.update).toHaveBeenCalledWith(expect.objectContaining(shareholder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholder>>();
      const shareholder = { id: 123 };
      jest.spyOn(shareholderFormService, 'getShareholder').mockReturnValue({ id: null });
      jest.spyOn(shareholderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholder }));
      saveSubject.complete();

      // THEN
      expect(shareholderFormService.getShareholder).toHaveBeenCalled();
      expect(shareholderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholder>>();
      const shareholder = { id: 123 };
      jest.spyOn(shareholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shareholderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
