import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoteEntryFormService } from './vote-entry-form.service';
import { VoteEntryService } from '../service/vote-entry.service';
import { IVoteEntry } from '../vote-entry.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';
import { VoteProposalService } from 'app/entities/vote-proposal/service/vote-proposal.service';

import { VoteEntryUpdateComponent } from './vote-entry-update.component';

describe('VoteEntry Management Update Component', () => {
  let comp: VoteEntryUpdateComponent;
  let fixture: ComponentFixture<VoteEntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voteEntryFormService: VoteEntryFormService;
  let voteEntryService: VoteEntryService;
  let shareholderService: ShareholderService;
  let voteProposalService: VoteProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoteEntryUpdateComponent],
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
      .overrideTemplate(VoteEntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteEntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voteEntryFormService = TestBed.inject(VoteEntryFormService);
    voteEntryService = TestBed.inject(VoteEntryService);
    shareholderService = TestBed.inject(ShareholderService);
    voteProposalService = TestBed.inject(VoteProposalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const voteEntry: IVoteEntry = { id: 456 };
      const shareholder: IShareholder = { id: 13190 };
      voteEntry.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 92962 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voteEntry });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VoteProposal query and add missing value', () => {
      const voteEntry: IVoteEntry = { id: 456 };
      const voteProposal: IVoteProposal = { id: 51804 };
      voteEntry.voteProposal = voteProposal;

      const voteProposalCollection: IVoteProposal[] = [{ id: 53583 }];
      jest.spyOn(voteProposalService, 'query').mockReturnValue(of(new HttpResponse({ body: voteProposalCollection })));
      const additionalVoteProposals = [voteProposal];
      const expectedCollection: IVoteProposal[] = [...additionalVoteProposals, ...voteProposalCollection];
      jest.spyOn(voteProposalService, 'addVoteProposalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voteEntry });
      comp.ngOnInit();

      expect(voteProposalService.query).toHaveBeenCalled();
      expect(voteProposalService.addVoteProposalToCollectionIfMissing).toHaveBeenCalledWith(
        voteProposalCollection,
        ...additionalVoteProposals.map(expect.objectContaining)
      );
      expect(comp.voteProposalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const voteEntry: IVoteEntry = { id: 456 };
      const shareholder: IShareholder = { id: 28137 };
      voteEntry.shareholder = shareholder;
      const voteProposal: IVoteProposal = { id: 34232 };
      voteEntry.voteProposal = voteProposal;

      activatedRoute.data = of({ voteEntry });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.voteProposalsSharedCollection).toContain(voteProposal);
      expect(comp.voteEntry).toEqual(voteEntry);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntry>>();
      const voteEntry = { id: 123 };
      jest.spyOn(voteEntryFormService, 'getVoteEntry').mockReturnValue(voteEntry);
      jest.spyOn(voteEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteEntry }));
      saveSubject.complete();

      // THEN
      expect(voteEntryFormService.getVoteEntry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voteEntryService.update).toHaveBeenCalledWith(expect.objectContaining(voteEntry));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntry>>();
      const voteEntry = { id: 123 };
      jest.spyOn(voteEntryFormService, 'getVoteEntry').mockReturnValue({ id: null });
      jest.spyOn(voteEntryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteEntry }));
      saveSubject.complete();

      // THEN
      expect(voteEntryFormService.getVoteEntry).toHaveBeenCalled();
      expect(voteEntryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteEntry>>();
      const voteEntry = { id: 123 };
      jest.spyOn(voteEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voteEntryService.update).toHaveBeenCalled();
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

    describe('compareVoteProposal', () => {
      it('Should forward to voteProposalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(voteProposalService, 'compareVoteProposal');
        comp.compareVoteProposal(entity, entity2);
        expect(voteProposalService.compareVoteProposal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
