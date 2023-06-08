import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DividendCalculationFormService } from './dividend-calculation-form.service';
import { DividendCalculationService } from '../service/dividend-calculation.service';
import { IDividendCalculation } from '../dividend-calculation.model';
import { IDividendShareholder } from 'app/entities/dividend-shareholder/dividend-shareholder.model';
import { DividendShareholderService } from 'app/entities/dividend-shareholder/service/dividend-shareholder.service';

import { DividendCalculationUpdateComponent } from './dividend-calculation-update.component';

describe('DividendCalculation Management Update Component', () => {
  let comp: DividendCalculationUpdateComponent;
  let fixture: ComponentFixture<DividendCalculationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dividendCalculationFormService: DividendCalculationFormService;
  let dividendCalculationService: DividendCalculationService;
  let dividendShareholderService: DividendShareholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DividendCalculationUpdateComponent],
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
      .overrideTemplate(DividendCalculationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendCalculationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dividendCalculationFormService = TestBed.inject(DividendCalculationFormService);
    dividendCalculationService = TestBed.inject(DividendCalculationService);
    dividendShareholderService = TestBed.inject(DividendShareholderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DividendShareholder query and add missing value', () => {
      const dividendCalculation: IDividendCalculation = { id: 456 };
      const dividendShareholder: IDividendShareholder = { id: 98172 };
      dividendCalculation.dividendShareholder = dividendShareholder;

      const dividendShareholderCollection: IDividendShareholder[] = [{ id: 62394 }];
      jest.spyOn(dividendShareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: dividendShareholderCollection })));
      const additionalDividendShareholders = [dividendShareholder];
      const expectedCollection: IDividendShareholder[] = [...additionalDividendShareholders, ...dividendShareholderCollection];
      jest.spyOn(dividendShareholderService, 'addDividendShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dividendCalculation });
      comp.ngOnInit();

      expect(dividendShareholderService.query).toHaveBeenCalled();
      expect(dividendShareholderService.addDividendShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        dividendShareholderCollection,
        ...additionalDividendShareholders.map(expect.objectContaining)
      );
      expect(comp.dividendShareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dividendCalculation: IDividendCalculation = { id: 456 };
      const dividendShareholder: IDividendShareholder = { id: 53775 };
      dividendCalculation.dividendShareholder = dividendShareholder;

      activatedRoute.data = of({ dividendCalculation });
      comp.ngOnInit();

      expect(comp.dividendShareholdersSharedCollection).toContain(dividendShareholder);
      expect(comp.dividendCalculation).toEqual(dividendCalculation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendCalculation>>();
      const dividendCalculation = { id: 123 };
      jest.spyOn(dividendCalculationFormService, 'getDividendCalculation').mockReturnValue(dividendCalculation);
      jest.spyOn(dividendCalculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendCalculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendCalculation }));
      saveSubject.complete();

      // THEN
      expect(dividendCalculationFormService.getDividendCalculation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dividendCalculationService.update).toHaveBeenCalledWith(expect.objectContaining(dividendCalculation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendCalculation>>();
      const dividendCalculation = { id: 123 };
      jest.spyOn(dividendCalculationFormService, 'getDividendCalculation').mockReturnValue({ id: null });
      jest.spyOn(dividendCalculationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendCalculation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendCalculation }));
      saveSubject.complete();

      // THEN
      expect(dividendCalculationFormService.getDividendCalculation).toHaveBeenCalled();
      expect(dividendCalculationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendCalculation>>();
      const dividendCalculation = { id: 123 };
      jest.spyOn(dividendCalculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendCalculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dividendCalculationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDividendShareholder', () => {
      it('Should forward to dividendShareholderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dividendShareholderService, 'compareDividendShareholder');
        comp.compareDividendShareholder(entity, entity2);
        expect(dividendShareholderService.compareDividendShareholder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
