import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommunicationFormService } from './communication-form.service';
import { CommunicationService } from '../service/communication.service';
import { ICommunication } from '../communication.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';

import { CommunicationUpdateComponent } from './communication-update.component';

describe('Communication Management Update Component', () => {
  let comp: CommunicationUpdateComponent;
  let fixture: ComponentFixture<CommunicationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let communicationFormService: CommunicationFormService;
  let communicationService: CommunicationService;
  let shareholderService: ShareholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommunicationUpdateComponent],
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
      .overrideTemplate(CommunicationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommunicationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    communicationFormService = TestBed.inject(CommunicationFormService);
    communicationService = TestBed.inject(CommunicationService);
    shareholderService = TestBed.inject(ShareholderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const communication: ICommunication = { id: 456 };
      const shareholder: IShareholder = { id: 49383 };
      communication.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 81689 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ communication });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const communication: ICommunication = { id: 456 };
      const shareholder: IShareholder = { id: 92993 };
      communication.shareholder = shareholder;

      activatedRoute.data = of({ communication });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.communication).toEqual(communication);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommunication>>();
      const communication = { id: 123 };
      jest.spyOn(communicationFormService, 'getCommunication').mockReturnValue(communication);
      jest.spyOn(communicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ communication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: communication }));
      saveSubject.complete();

      // THEN
      expect(communicationFormService.getCommunication).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(communicationService.update).toHaveBeenCalledWith(expect.objectContaining(communication));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommunication>>();
      const communication = { id: 123 };
      jest.spyOn(communicationFormService, 'getCommunication').mockReturnValue({ id: null });
      jest.spyOn(communicationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ communication: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: communication }));
      saveSubject.complete();

      // THEN
      expect(communicationFormService.getCommunication).toHaveBeenCalled();
      expect(communicationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommunication>>();
      const communication = { id: 123 };
      jest.spyOn(communicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ communication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(communicationService.update).toHaveBeenCalled();
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
  });
});
