import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shareholder-x-group.test-samples';

import { ShareholderXGroupFormService } from './shareholder-x-group-form.service';

describe('ShareholderXGroup Form Service', () => {
  let service: ShareholderXGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholderXGroupFormService);
  });

  describe('Service methods', () => {
    describe('createShareholderXGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShareholderXGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholder: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });

      it('passing IShareholderXGroup should create a new form with FormGroup', () => {
        const formGroup = service.createShareholderXGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholder: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });
    });

    describe('getShareholderXGroup', () => {
      it('should return NewShareholderXGroup for default ShareholderXGroup initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShareholderXGroupFormGroup(sampleWithNewData);

        const shareholderXGroup = service.getShareholderXGroup(formGroup) as any;

        expect(shareholderXGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewShareholderXGroup for empty ShareholderXGroup initial value', () => {
        const formGroup = service.createShareholderXGroupFormGroup();

        const shareholderXGroup = service.getShareholderXGroup(formGroup) as any;

        expect(shareholderXGroup).toMatchObject({});
      });

      it('should return IShareholderXGroup', () => {
        const formGroup = service.createShareholderXGroupFormGroup(sampleWithRequiredData);

        const shareholderXGroup = service.getShareholderXGroup(formGroup) as any;

        expect(shareholderXGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShareholderXGroup should not enable id FormControl', () => {
        const formGroup = service.createShareholderXGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShareholderXGroup should disable id FormControl', () => {
        const formGroup = service.createShareholderXGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
