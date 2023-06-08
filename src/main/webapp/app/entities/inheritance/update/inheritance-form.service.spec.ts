import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../inheritance.test-samples';

import { InheritanceFormService } from './inheritance-form.service';

describe('Inheritance Form Service', () => {
  let service: InheritanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InheritanceFormService);
  });

  describe('Service methods', () => {
    describe('createInheritanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInheritanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            operationDate: expect.any(Object),
            documentNumber: expect.any(Object),
            documentDate: expect.any(Object),
            sharesNo: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing IInheritance should create a new form with FormGroup', () => {
        const formGroup = service.createInheritanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            operationDate: expect.any(Object),
            documentNumber: expect.any(Object),
            documentDate: expect.any(Object),
            sharesNo: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });

    describe('getInheritance', () => {
      it('should return NewInheritance for default Inheritance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInheritanceFormGroup(sampleWithNewData);

        const inheritance = service.getInheritance(formGroup) as any;

        expect(inheritance).toMatchObject(sampleWithNewData);
      });

      it('should return NewInheritance for empty Inheritance initial value', () => {
        const formGroup = service.createInheritanceFormGroup();

        const inheritance = service.getInheritance(formGroup) as any;

        expect(inheritance).toMatchObject({});
      });

      it('should return IInheritance', () => {
        const formGroup = service.createInheritanceFormGroup(sampleWithRequiredData);

        const inheritance = service.getInheritance(formGroup) as any;

        expect(inheritance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInheritance should not enable id FormControl', () => {
        const formGroup = service.createInheritanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInheritance should disable id FormControl', () => {
        const formGroup = service.createInheritanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
