import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vote-option.test-samples';

import { VoteOptionFormService } from './vote-option-form.service';

describe('VoteOption Form Service', () => {
  let service: VoteOptionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteOptionFormService);
  });

  describe('Service methods', () => {
    describe('createVoteOptionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoteOptionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            text: expect.any(Object),
            voteProposal: expect.any(Object),
          })
        );
      });

      it('passing IVoteOption should create a new form with FormGroup', () => {
        const formGroup = service.createVoteOptionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            text: expect.any(Object),
            voteProposal: expect.any(Object),
          })
        );
      });
    });

    describe('getVoteOption', () => {
      it('should return NewVoteOption for default VoteOption initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVoteOptionFormGroup(sampleWithNewData);

        const voteOption = service.getVoteOption(formGroup) as any;

        expect(voteOption).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoteOption for empty VoteOption initial value', () => {
        const formGroup = service.createVoteOptionFormGroup();

        const voteOption = service.getVoteOption(formGroup) as any;

        expect(voteOption).toMatchObject({});
      });

      it('should return IVoteOption', () => {
        const formGroup = service.createVoteOptionFormGroup(sampleWithRequiredData);

        const voteOption = service.getVoteOption(formGroup) as any;

        expect(voteOption).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoteOption should not enable id FormControl', () => {
        const formGroup = service.createVoteOptionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoteOption should disable id FormControl', () => {
        const formGroup = service.createVoteOptionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
