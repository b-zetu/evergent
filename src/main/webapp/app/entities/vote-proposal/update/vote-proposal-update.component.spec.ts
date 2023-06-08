import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoteProposalFormService } from './vote-proposal-form.service';
import { VoteProposalService } from '../service/vote-proposal.service';
import { IVoteProposal } from '../vote-proposal.model';

import { VoteProposalUpdateComponent } from './vote-proposal-update.component';

describe('VoteProposal Management Update Component', () => {
  let comp: VoteProposalUpdateComponent;
  let fixture: ComponentFixture<VoteProposalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voteProposalFormService: VoteProposalFormService;
  let voteProposalService: VoteProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoteProposalUpdateComponent],
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
      .overrideTemplate(VoteProposalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteProposalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voteProposalFormService = TestBed.inject(VoteProposalFormService);
    voteProposalService = TestBed.inject(VoteProposalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const voteProposal: IVoteProposal = { id: 456 };

      activatedRoute.data = of({ voteProposal });
      comp.ngOnInit();

      expect(comp.voteProposal).toEqual(voteProposal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteProposal>>();
      const voteProposal = { id: 123 };
      jest.spyOn(voteProposalFormService, 'getVoteProposal').mockReturnValue(voteProposal);
      jest.spyOn(voteProposalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteProposal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteProposal }));
      saveSubject.complete();

      // THEN
      expect(voteProposalFormService.getVoteProposal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voteProposalService.update).toHaveBeenCalledWith(expect.objectContaining(voteProposal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteProposal>>();
      const voteProposal = { id: 123 };
      jest.spyOn(voteProposalFormService, 'getVoteProposal').mockReturnValue({ id: null });
      jest.spyOn(voteProposalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteProposal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voteProposal }));
      saveSubject.complete();

      // THEN
      expect(voteProposalFormService.getVoteProposal).toHaveBeenCalled();
      expect(voteProposalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoteProposal>>();
      const voteProposal = { id: 123 };
      jest.spyOn(voteProposalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voteProposal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voteProposalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
