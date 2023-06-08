import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoteOptionFormService } from './vote-option-form.service';
import { VoteOptionService } from '../service/vote-option.service';
import { IVoteOption } from '../vote-option.model';
import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';
import { VoteProposalService } from 'app/entities/vote-proposal/service/vote-proposal.service';

import { VoteOptionUpdateComponent } from './vote-option-update.component';

describe('VoteOption Management Update Component', () => {
  let comp: VoteOptionUpdateComponent;
  let fixture: ComponentFixture<VoteOptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voteOptionFormService: VoteOptionFormService;
  let voteOptionService: VoteOptionService;
  let voteProposalService: VoteProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoteOptionUpdateComponent],
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
      .overrideTemplate(VoteOptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteOptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voteOptionFormService = TestBed.inject(VoteOptionFormService);
    voteOptionService = TestBed.inject(VoteOptionService);
    voteProposalService = TestBed.inject(VoteProposalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VoteProposal query and add missing value', () => {
      const voteOption: IVoteOption = { id: 456 };
      const voteProposal: IVoteProposal = { id: 82234 };
      voteOption.voteProposal = voteProposal;

      const voteProposalCollection: IVoteProposal[] = [{ id: 70701 }];
      jest.spyOn(voteProposalService, 'query').mockReturnValue(of(new HttpResponse({ body: voteProposalCollection })));
      const additionalVoteProposals = [voteProposal];
      const expectedCollection: IVoteProposal[] = [...additionalVoteProposals, ...voteProposalCollection];
      jest.spyOn(voteProposalService, 'addVoteProposalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voteOption });
      comp.ngOnInit();

      expect(voteProposalService.query).toHaveBeenCalled();
      expect(voteProposalService.addVoteProposalToCollectionIfMissing).toHaveBeenCalledWith(
        voteProposalCollection,
        ...additionalVoteProposals.map(expect.objectContaining)
      );
      expect(comp.voteProposalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const voteOption: IVoteOption = { id: 456 };
      const voteProposal: IVoteProposal = { id: 35714 };
      voteOption.voteProposal = voteProposal;

      activatedRoute.data = of({ voteOption });
      comp.ngOnInit();

      expect(comp.voteProposalsSharedCollection).toContain(voteProposal);
      expect(comp.voteOption).toEqual(voteOption);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteOption>>();
      const voteOption = { id: 123 };
      jest.spyOn(voteOptionFormService, 'getVoteOption').mockReturnValue(voteOption);
      jest.spyOn(voteOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteOption }));
      saveSubject.complete();

      // THEN
      expect(voteOptionFormService.getVoteOption).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voteOptionService.update).toHaveBeenCalledWith(expect.objectContaining(voteOption));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteOption>>();
      const voteOption = { id: 123 };
      jest.spyOn(voteOptionFormService, 'getVoteOption').mockReturnValue({ id: null });
      jest.spyOn(voteOptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteOption: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteOption }));
      saveSubject.complete();

      // THEN
      expect(voteOptionFormService.getVoteOption).toHaveBeenCalled();
      expect(voteOptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteOption>>();
      const voteOption = { id: 123 };
      jest.spyOn(voteOptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteOption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voteOptionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
