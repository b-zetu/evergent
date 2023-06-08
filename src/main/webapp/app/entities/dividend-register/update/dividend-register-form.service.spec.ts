import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dividend-register.test-samples';

import { DividendRegisterFormService } from './dividend-register-form.service';

describe('DividendRegister Form Service', () => {
  let service: DividendRegisterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendRegisterFormService);
  });

  describe('Service methods', () => {
    describe('createDividendRegisterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDividendRegisterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            referenceDate: expect.any(Object),
            dividendGrossValue: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing IDividendRegister should create a new form with FormGroup', () => {
        const formGroup = service.createDividendRegisterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            referenceDate: expect.any(Object),
            dividendGrossValue: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });

    describe('getDividendRegister', () => {
      it('should return NewDividendRegister for default DividendRegister initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDividendRegisterFormGroup(sampleWithNewData);

        const dividendRegister = service.getDividendRegister(formGroup) as any;

        expect(dividendRegister).toMatchObject(sampleWithNewData);
      });

      it('should return NewDividendRegister for empty DividendRegister initial value', () => {
        const formGroup = service.createDividendRegisterFormGroup();

        const dividendRegister = service.getDividendRegister(formGroup) as any;

        expect(dividendRegister).toMatchObject({});
      });

      it('should return IDividendRegister', () => {
        const formGroup = service.createDividendRegisterFormGroup(sampleWithRequiredData);

        const dividendRegister = service.getDividendRegister(formGroup) as any;

        expect(dividendRegister).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDividendRegister should not enable id FormControl', () => {
        const formGroup = service.createDividendRegisterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDividendRegister should disable id FormControl', () => {
        const formGroup = service.createDividendRegisterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
