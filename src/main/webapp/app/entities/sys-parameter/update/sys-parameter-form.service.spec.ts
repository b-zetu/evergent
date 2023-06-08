import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sys-parameter.test-samples';

import { SysParameterFormService } from './sys-parameter-form.service';

describe('SysParameter Form Service', () => {
  let service: SysParameterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysParameterFormService);
  });

  describe('Service methods', () => {
    describe('createSysParameterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSysParameterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            value: expect.any(Object),
          })
        );
      });

      it('passing ISysParameter should create a new form with FormGroup', () => {
        const formGroup = service.createSysParameterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            key: expect.any(Object),
            value: expect.any(Object),
          })
        );
      });
    });

    describe('getSysParameter', () => {
      it('should return NewSysParameter for default SysParameter initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSysParameterFormGroup(sampleWithNewData);

        const sysParameter = service.getSysParameter(formGroup) as any;

        expect(sysParameter).toMatchObject(sampleWithNewData);
      });

      it('should return NewSysParameter for empty SysParameter initial value', () => {
        const formGroup = service.createSysParameterFormGroup();

        const sysParameter = service.getSysParameter(formGroup) as any;

        expect(sysParameter).toMatchObject({});
      });

      it('should return ISysParameter', () => {
        const formGroup = service.createSysParameterFormGroup(sampleWithRequiredData);

        const sysParameter = service.getSysParameter(formGroup) as any;

        expect(sysParameter).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISysParameter should not enable id FormControl', () => {
        const formGroup = service.createSysParameterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSysParameter should disable id FormControl', () => {
        const formGroup = service.createSysParameterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
