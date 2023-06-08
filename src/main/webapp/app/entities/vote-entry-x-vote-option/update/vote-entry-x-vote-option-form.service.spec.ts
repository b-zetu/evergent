import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vote-entry-x-vote-option.test-samples';

import { VoteEntryXVoteOptionFormService } from './vote-entry-x-vote-option-form.service';

describe('VoteEntryXVoteOption Form Service', () => {
  let service: VoteEntryXVoteOptionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteEntryXVoteOptionFormService);
  });

  describe('Service methods', () => {
    describe('createVoteEntryXVoteOptionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            voteEntry: expect.any(Object),
            voteOption: expect.any(Object),
          })
        );
      });

      it('passing IVoteEntryXVoteOption should create a new form with FormGroup', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            voteEntry: expect.any(Object),
            voteOption: expect.any(Object),
          })
        );
      });
    });

    describe('getVoteEntryXVoteOption', () => {
      it('should return NewVoteEntryXVoteOption for default VoteEntryXVoteOption initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVoteEntryXVoteOptionFormGroup(sampleWithNewData);

        const voteEntryXVoteOption = service.getVoteEntryXVoteOption(formGroup) as any;

        expect(voteEntryXVoteOption).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoteEntryXVoteOption for empty VoteEntryXVoteOption initial value', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup();

        const voteEntryXVoteOption = service.getVoteEntryXVoteOption(formGroup) as any;

        expect(voteEntryXVoteOption).toMatchObject({});
      });

      it('should return IVoteEntryXVoteOption', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup(sampleWithRequiredData);

        const voteEntryXVoteOption = service.getVoteEntryXVoteOption(formGroup) as any;

        expect(voteEntryXVoteOption).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoteEntryXVoteOption should not enable id FormControl', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoteEntryXVoteOption should disable id FormControl', () => {
        const formGroup = service.createVoteEntryXVoteOptionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
