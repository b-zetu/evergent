import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vote-entry.test-samples';

import { VoteEntryFormService } from './vote-entry-form.service';

describe('VoteEntry Form Service', () => {
  let service: VoteEntryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteEntryFormService);
  });

  describe('Service methods', () => {
    describe('createVoteEntryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoteEntryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholder: expect.any(Object),
            voteProposal: expect.any(Object),
          })
        );
      });

      it('passing IVoteEntry should create a new form with FormGroup', () => {
        const formGroup = service.createVoteEntryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholder: expect.any(Object),
            voteProposal: expect.any(Object),
          })
        );
      });
    });

    describe('getVoteEntry', () => {
      it('should return NewVoteEntry for default VoteEntry initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVoteEntryFormGroup(sampleWithNewData);

        const voteEntry = service.getVoteEntry(formGroup) as any;

        expect(voteEntry).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoteEntry for empty VoteEntry initial value', () => {
        const formGroup = service.createVoteEntryFormGroup();

        const voteEntry = service.getVoteEntry(formGroup) as any;

        expect(voteEntry).toMatchObject({});
      });

      it('should return IVoteEntry', () => {
        const formGroup = service.createVoteEntryFormGroup(sampleWithRequiredData);

        const voteEntry = service.getVoteEntry(formGroup) as any;

        expect(voteEntry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoteEntry should not enable id FormControl', () => {
        const formGroup = service.createVoteEntryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoteEntry should disable id FormControl', () => {
        const formGroup = service.createVoteEntryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
