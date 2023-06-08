import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dividend-calculation.test-samples';

import { DividendCalculationFormService } from './dividend-calculation-form.service';

describe('DividendCalculation Form Service', () => {
  let service: DividendCalculationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendCalculationFormService);
  });

  describe('Service methods', () => {
    describe('createDividendCalculationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDividendCalculationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalNetAmount: expect.any(Object),
            taxAmountCalculated: expect.any(Object),
            totalGrossAmount: expect.any(Object),
            dividendShareholder: expect.any(Object),
          })
        );
      });

      it('passing IDividendCalculation should create a new form with FormGroup', () => {
        const formGroup = service.createDividendCalculationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalNetAmount: expect.any(Object),
            taxAmountCalculated: expect.any(Object),
            totalGrossAmount: expect.any(Object),
            dividendShareholder: expect.any(Object),
          })
        );
      });
    });

    describe('getDividendCalculation', () => {
      it('should return NewDividendCalculation for default DividendCalculation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDividendCalculationFormGroup(sampleWithNewData);

        const dividendCalculation = service.getDividendCalculation(formGroup) as any;

        expect(dividendCalculation).toMatchObject(sampleWithNewData);
      });

      it('should return NewDividendCalculation for empty DividendCalculation initial value', () => {
        const formGroup = service.createDividendCalculationFormGroup();

        const dividendCalculation = service.getDividendCalculation(formGroup) as any;

        expect(dividendCalculation).toMatchObject({});
      });

      it('should return IDividendCalculation', () => {
        const formGroup = service.createDividendCalculationFormGroup(sampleWithRequiredData);

        const dividendCalculation = service.getDividendCalculation(formGroup) as any;

        expect(dividendCalculation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDividendCalculation should not enable id FormControl', () => {
        const formGroup = service.createDividendCalculationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDividendCalculation should disable id FormControl', () => {
        const formGroup = service.createDividendCalculationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
