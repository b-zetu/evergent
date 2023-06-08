import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vote-proposal.test-samples';

import { VoteProposalFormService } from './vote-proposal-form.service';

describe('VoteProposal Form Service', () => {
  let service: VoteProposalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteProposalFormService);
  });

  describe('Service methods', () => {
    describe('createVoteProposalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoteProposalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            text: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing IVoteProposal should create a new form with FormGroup', () => {
        const formGroup = service.createVoteProposalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            text: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });

    describe('getVoteProposal', () => {
      it('should return NewVoteProposal for default VoteProposal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVoteProposalFormGroup(sampleWithNewData);

        const voteProposal = service.getVoteProposal(formGroup) as any;

        expect(voteProposal).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoteProposal for empty VoteProposal initial value', () => {
        const formGroup = service.createVoteProposalFormGroup();

        const voteProposal = service.getVoteProposal(formGroup) as any;

        expect(voteProposal).toMatchObject({});
      });

      it('should return IVoteProposal', () => {
        const formGroup = service.createVoteProposalFormGroup(sampleWithRequiredData);

        const voteProposal = service.getVoteProposal(formGroup) as any;

        expect(voteProposal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoteProposal should not enable id FormControl', () => {
        const formGroup = service.createVoteProposalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoteProposal should disable id FormControl', () => {
        const formGroup = service.createVoteProposalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
