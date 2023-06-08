import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shareholder-x-inheritance.test-samples';

import { ShareholderXInheritanceFormService } from './shareholder-x-inheritance-form.service';

describe('ShareholderXInheritance Form Service', () => {
  let service: ShareholderXInheritanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholderXInheritanceFormService);
  });

  describe('Service methods', () => {
    describe('createShareholderXInheritanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            deceased: expect.any(Object),
            receiver: expect.any(Object),
            inheritance: expect.any(Object),
          })
        );
      });

      it('passing IShareholderXInheritance should create a new form with FormGroup', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            deceased: expect.any(Object),
            receiver: expect.any(Object),
            inheritance: expect.any(Object),
          })
        );
      });
    });

    describe('getShareholderXInheritance', () => {
      it('should return NewShareholderXInheritance for default ShareholderXInheritance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShareholderXInheritanceFormGroup(sampleWithNewData);

        const shareholderXInheritance = service.getShareholderXInheritance(formGroup) as any;

        expect(shareholderXInheritance).toMatchObject(sampleWithNewData);
      });

      it('should return NewShareholderXInheritance for empty ShareholderXInheritance initial value', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup();

        const shareholderXInheritance = service.getShareholderXInheritance(formGroup) as any;

        expect(shareholderXInheritance).toMatchObject({});
      });

      it('should return IShareholderXInheritance', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup(sampleWithRequiredData);

        const shareholderXInheritance = service.getShareholderXInheritance(formGroup) as any;

        expect(shareholderXInheritance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShareholderXInheritance should not enable id FormControl', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShareholderXInheritance should disable id FormControl', () => {
        const formGroup = service.createShareholderXInheritanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
