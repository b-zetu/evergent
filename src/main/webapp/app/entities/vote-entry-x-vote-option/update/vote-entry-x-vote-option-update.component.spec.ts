import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoteEntryXVoteOptionFormService } from './vote-entry-x-vote-option-form.service';
import { VoteEntryXVoteOptionService } from '../service/vote-entry-x-vote-option.service';
import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import { IVoteEntry } from 'app/entities/vote-entry/vote-entry.model';
import { VoteEntryService } from 'app/entities/vote-entry/service/vote-entry.service';
import { IVoteOption } from 'app/entities/vote-option/vote-option.model';
import { VoteOptionService } from 'app/entities/vote-option/service/vote-option.service';

import { VoteEntryXVoteOptionUpdateComponent } from './vote-entry-x-vote-option-update.component';

describe('VoteEntryXVoteOption Management Update Component', () => {
  let comp: VoteEntryXVoteOptionUpdateComponent;
  let fixture: ComponentFixture<VoteEntryXVoteOptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voteEntryXVoteOptionFormService: VoteEntryXVoteOptionFormService;
  let voteEntryXVoteOptionService: VoteEntryXVoteOptionService;
  let voteEntryService: VoteEntryService;
  let voteOptionService: VoteOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoteEntryXVoteOptionUpdateComponent],
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
      .overrideTemplate(VoteEntryXVoteOptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteEntryXVoteOptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voteEntryXVoteOptionFormService = TestBed.inject(VoteEntryXVoteOptionFormService);
    voteEntryXVoteOptionService = TestBed.inject(VoteEntryXVoteOptionService);
    voteEntryService = TestBed.inject(VoteEntryService);
    voteOptionService = TestBed.inject(VoteOptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VoteEntry query and add missing value', () => {
      const voteEntryXVoteOption: IVoteEntryXVoteOption = { id: 456 };
      const voteEntry: IVoteEntry = { id: 83423 };
      voteEntryXVoteOption.voteEntry = voteEntry;

      const voteEntryCollection: IVoteEntry[] = [{ id: 62586 }];
      jest.spyOn(voteEntryService, 'query').mockReturnValue(of(new HttpResponse({ body: voteEntryCollection })));
      const additionalVoteEntries = [voteEntry];
      const expectedCollection: IVoteEntry[] = [...additionalVoteEntries, ...voteEntryCollection];
      jest.spyOn(voteEntryService, 'addVoteEntryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voteEntryXVoteOption });
      comp.ngOnInit();

      expect(voteEntryService.query).toHaveBeenCalled();
      expect(voteEntryService.addVoteEntryToCollectionIfMissing).toHaveBeenCalledWith(
        voteEntryCollection,
        ...additionalVoteEntries.map(expect.objectContaining)
      );
      expect(comp.voteEntriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VoteOption query and add missing value', () => {
      const voteEntryXVoteOption: IVoteEntryXVoteOption = { id: 456 };
      const voteOption: IVoteOption = { id: 8058 };
      voteEntryXVoteOption.voteOption = voteOption;

      const voteOptionCollection: IVoteOption[] = [{ id: 89757 }];
      jest.spyOn(voteOptionService, 'query').mockReturnValue(of(new HttpResponse({ body: voteOptionCollection })));
      const additionalVoteOptions = [voteOption];
      const expectedCollection: IVoteOption[] = [...additionalVoteOptions, ...voteOptionCollection];
      jest.spyOn(voteOptionService, 'addVoteOptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voteEntryXVoteOption });
      comp.ngOnInit();

      expect(voteOptionService.query).toHaveBeenCalled();
      expect(voteOptionService.addVoteOptionToCollectionIfMissing).toHaveBeenCalledWith(
        voteOptionCollection,
        ...additionalVoteOptions.map(expect.objectContaining)
      );
      expect(comp.voteOptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const voteEntryXVoteOption: IVoteEntryXVoteOption = { id: 456 };
      const voteEntry: IVoteEntry = { id: 59601 };
      voteEntryXVoteOption.voteEntry = voteEntry;
      const voteOption: IVoteOption = { id: 86837 };
      voteEntryXVoteOption.voteOption = voteOption;

      activatedRoute.data = of({ voteEntryXVoteOption });
      comp.ngOnInit();

      expect(comp.voteEntriesSharedCollection).toContain(voteEntry);
      expect(comp.voteOptionsSharedCollection).toContain(voteOption);
      expect(comp.voteEntryXVoteOption).toEqual(voteEntryXVoteOption);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntryXVoteOption>>();
      const voteEntryXVoteOption = { id: 123 };
      jest.spyOn(voteEntryXVoteOptionFormService, 'getVoteEntryXVoteOption').mockReturnValue(voteEntryXVoteOption);
      jest.spyOn(voteEntryXVoteOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntryXVoteOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteEntryXVoteOption }));
      saveSubject.complete();

      // THEN
      expect(voteEntryXVoteOptionFormService.getVoteEntryXVoteOption).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voteEntryXVoteOptionService.update).toHaveBeenCalledWith(expect.objectContaining(voteEntryXVoteOption));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntryXVoteOption>>();
      const voteEntryXVoteOption = { id: 123 };
      jest.spyOn(voteEntryXVoteOptionFormService, 'getVoteEntryXVoteOption').mockReturnValue({ id: null });
      jest.spyOn(voteEntryXVoteOptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntryXVoteOption: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteEntryXVoteOption }));
      saveSubject.complete();

      // THEN
      expect(voteEntryXVoteOptionFormService.getVoteEntryXVoteOption).toHaveBeenCalled();
      expect(voteEntryXVoteOptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntryXVoteOption>>();
      const voteEntryXVoteOption = { id: 123 };
      jest.spyOn(voteEntryXVoteOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntryXVoteOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voteEntryXVoteOptionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVoteEntry', () => {
      it('Should forward to voteEntryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(voteEntryService, 'compareVoteEntry');
        comp.compareVoteEntry(entity, entity2);
        expect(voteEntryService.compareVoteEntry).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVoteOption', () => {
      it('Should forward to voteOptionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(voteOptionService, 'compareVoteOption');
        comp.compareVoteOption(entity, entity2);
        expect(voteOptionService.compareVoteOption).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
