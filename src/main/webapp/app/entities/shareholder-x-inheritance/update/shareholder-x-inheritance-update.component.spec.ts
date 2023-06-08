import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShareholderXInheritanceFormService } from './shareholder-x-inheritance-form.service';
import { ShareholderXInheritanceService } from '../service/shareholder-x-inheritance.service';
import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IInheritance } from 'app/entities/inheritance/inheritance.model';
import { InheritanceService } from 'app/entities/inheritance/service/inheritance.service';

import { ShareholderXInheritanceUpdateComponent } from './shareholder-x-inheritance-update.component';

describe('ShareholderXInheritance Management Update Component', () => {
  let comp: ShareholderXInheritanceUpdateComponent;
  let fixture: ComponentFixture<ShareholderXInheritanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shareholderXInheritanceFormService: ShareholderXInheritanceFormService;
  let shareholderXInheritanceService: ShareholderXInheritanceService;
  let shareholderService: ShareholderService;
  let inheritanceService: InheritanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShareholderXInheritanceUpdateComponent],
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
      .overrideTemplate(ShareholderXInheritanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderXInheritanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shareholderXInheritanceFormService = TestBed.inject(ShareholderXInheritanceFormService);
    shareholderXInheritanceService = TestBed.inject(ShareholderXInheritanceService);
    shareholderService = TestBed.inject(ShareholderService);
    inheritanceService = TestBed.inject(InheritanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const shareholderXInheritance: IShareholderXInheritance = { id: 456 };
      const deceased: IShareholder = { id: 20598 };
      shareholderXInheritance.deceased = deceased;
      const receiver: IShareholder = { id: 7008 };
      shareholderXInheritance.receiver = receiver;

      const shareholderCollection: IShareholder[] = [{ id: 78402 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [deceased, receiver];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shareholderXInheritance });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Inheritance query and add missing value', () => {
      const shareholderXInheritance: IShareholderXInheritance = { id: 456 };
      const inheritance: IInheritance = { id: 23995 };
      shareholderXInheritance.inheritance = inheritance;

      const inheritanceCollection: IInheritance[] = [{ id: 10475 }];
      jest.spyOn(inheritanceService, 'query').mockReturnValue(of(new HttpResponse({ body: inheritanceCollection })));
      const additionalInheritances = [inheritance];
      const expectedCollection: IInheritance[] = [...additionalInheritances, ...inheritanceCollection];
      jest.spyOn(inheritanceService, 'addInheritanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shareholderXInheritance });
      comp.ngOnInit();

      expect(inheritanceService.query).toHaveBeenCalled();
      expect(inheritanceService.addInheritanceToCollectionIfMissing).toHaveBeenCalledWith(
        inheritanceCollection,
        ...additionalInheritances.map(expect.objectContaining)
      );
      expect(comp.inheritancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shareholderXInheritance: IShareholderXInheritance = { id: 456 };
      const deceased: IShareholder = { id: 35617 };
      shareholderXInheritance.deceased = deceased;
      const receiver: IShareholder = { id: 45760 };
      shareholderXInheritance.receiver = receiver;
      const inheritance: IInheritance = { id: 15205 };
      shareholderXInheritance.inheritance = inheritance;

      activatedRoute.data = of({ shareholderXInheritance });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(deceased);
      expect(comp.shareholdersSharedCollection).toContain(receiver);
      expect(comp.inheritancesSharedCollection).toContain(inheritance);
      expect(comp.shareholderXInheritance).toEqual(shareholderXInheritance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXInheritance>>();
      const shareholderXInheritance = { id: 123 };
      jest.spyOn(shareholderXInheritanceFormService, 'getShareholderXInheritance').mockReturnValue(shareholderXInheritance);
      jest.spyOn(shareholderXInheritanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXInheritance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholderXInheritance }));
      saveSubject.complete();

      // THEN
      expect(shareholderXInheritanceFormService.getShareholderXInheritance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shareholderXInheritanceService.update).toHaveBeenCalledWith(expect.objectContaining(shareholderXInheritance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXInheritance>>();
      const shareholderXInheritance = { id: 123 };
      jest.spyOn(shareholderXInheritanceFormService, 'getShareholderXInheritance').mockReturnValue({ id: null });
      jest.spyOn(shareholderXInheritanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXInheritance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholderXInheritance }));
      saveSubject.complete();

      // THEN
      expect(shareholderXInheritanceFormService.getShareholderXInheritance).toHaveBeenCalled();
      expect(shareholderXInheritanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXInheritance>>();
      const shareholderXInheritance = { id: 123 };
      jest.spyOn(shareholderXInheritanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXInheritance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shareholderXInheritanceService.update).toHaveBeenCalled();
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

    describe('compareInheritance', () => {
      it('Should forward to inheritanceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(inheritanceService, 'compareInheritance');
        comp.compareInheritance(entity, entity2);
        expect(inheritanceService.compareInheritance).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
