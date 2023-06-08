import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shareholder.test-samples';

import { ShareholderFormService } from './shareholder-form.service';

describe('Shareholder Form Service', () => {
  let service: ShareholderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholderFormService);
  });

  describe('Service methods', () => {
    describe('createShareholderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShareholderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholderIdDC: expect.any(Object),
            cnp: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            sharesNo: expect.any(Object),
            isPf: expect.any(Object),
            isResident: expect.any(Object),
            taxValue: expect.any(Object),
            status: expect.any(Object),
            countryResidence: expect.any(Object),
            countyResidence: expect.any(Object),
            cityResidence: expect.any(Object),
            villageResidence: expect.any(Object),
            foreignLocalityResidence: expect.any(Object),
            streetResidence: expect.any(Object),
            streetNo: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });

      it('passing IShareholder should create a new form with FormGroup', () => {
        const formGroup = service.createShareholderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shareholderIdDC: expect.any(Object),
            cnp: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            sharesNo: expect.any(Object),
            isPf: expect.any(Object),
            isResident: expect.any(Object),
            taxValue: expect.any(Object),
            status: expect.any(Object),
            countryResidence: expect.any(Object),
            countyResidence: expect.any(Object),
            cityResidence: expect.any(Object),
            villageResidence: expect.any(Object),
            foreignLocalityResidence: expect.any(Object),
            streetResidence: expect.any(Object),
            streetNo: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });
    });

    describe('getShareholder', () => {
      it('should return NewShareholder for default Shareholder initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShareholderFormGroup(sampleWithNewData);

        const shareholder = service.getShareholder(formGroup) as any;

        expect(shareholder).toMatchObject(sampleWithNewData);
      });

      it('should return NewShareholder for empty Shareholder initial value', () => {
        const formGroup = service.createShareholderFormGroup();

        const shareholder = service.getShareholder(formGroup) as any;

        expect(shareholder).toMatchObject({});
      });

      it('should return IShareholder', () => {
        const formGroup = service.createShareholderFormGroup(sampleWithRequiredData);

        const shareholder = service.getShareholder(formGroup) as any;

        expect(shareholder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShareholder should not enable id FormControl', () => {
        const formGroup = service.createShareholderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShareholder should disable id FormControl', () => {
        const formGroup = service.createShareholderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
