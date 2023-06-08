import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dividend-shareholder.test-samples';

import { DividendShareholderFormService } from './dividend-shareholder-form.service';

describe('DividendShareholder Form Service', () => {
  let service: DividendShareholderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendShareholderFormService);
  });

  describe('Service methods', () => {
    describe('createDividendShareholderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDividendShareholderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sharesNo: expect.any(Object),
            isResident: expect.any(Object),
            taxValue: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
            dividendRegister: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });

      it('passing IDividendShareholder should create a new form with FormGroup', () => {
        const formGroup = service.createDividendShareholderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sharesNo: expect.any(Object),
            isResident: expect.any(Object),
            taxValue: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
            dividendRegister: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });
    });

    describe('getDividendShareholder', () => {
      it('should return NewDividendShareholder for default DividendShareholder initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDividendShareholderFormGroup(sampleWithNewData);

        const dividendShareholder = service.getDividendShareholder(formGroup) as any;

        expect(dividendShareholder).toMatchObject(sampleWithNewData);
      });

      it('should return NewDividendShareholder for empty DividendShareholder initial value', () => {
        const formGroup = service.createDividendShareholderFormGroup();

        const dividendShareholder = service.getDividendShareholder(formGroup) as any;

        expect(dividendShareholder).toMatchObject({});
      });

      it('should return IDividendShareholder', () => {
        const formGroup = service.createDividendShareholderFormGroup(sampleWithRequiredData);

        const dividendShareholder = service.getDividendShareholder(formGroup) as any;

        expect(dividendShareholder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDividendShareholder should not enable id FormControl', () => {
        const formGroup = service.createDividendShareholderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDividendShareholder should disable id FormControl', () => {
        const formGroup = service.createDividendShareholderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
