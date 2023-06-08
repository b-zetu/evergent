import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../legal-hold.test-samples';

import { LegalHoldFormService } from './legal-hold-form.service';

describe('LegalHold Form Service', () => {
  let service: LegalHoldFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalHoldFormService);
  });

  describe('Service methods', () => {
    describe('createLegalHoldFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLegalHoldFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            beneficiaryName: expect.any(Object),
            type: expect.any(Object),
            totalAmount: expect.any(Object),
            amountLeft: expect.any(Object),
            poprireNumber: expect.any(Object),
            poprireDate: expect.any(Object),
            poprireDocumentNumber: expect.any(Object),
            poprireDocumentDate: expect.any(Object),
            sistareNumber: expect.any(Object),
            sistareDate: expect.any(Object),
            sistareIntrareNumber: expect.any(Object),
            sistareIntrareDate: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });

      it('passing ILegalHold should create a new form with FormGroup', () => {
        const formGroup = service.createLegalHoldFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            beneficiaryName: expect.any(Object),
            type: expect.any(Object),
            totalAmount: expect.any(Object),
            amountLeft: expect.any(Object),
            poprireNumber: expect.any(Object),
            poprireDate: expect.any(Object),
            poprireDocumentNumber: expect.any(Object),
            poprireDocumentDate: expect.any(Object),
            sistareNumber: expect.any(Object),
            sistareDate: expect.any(Object),
            sistareIntrareNumber: expect.any(Object),
            sistareIntrareDate: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
            paymentOption: expect.any(Object),
          })
        );
      });
    });

    describe('getLegalHold', () => {
      it('should return NewLegalHold for default LegalHold initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLegalHoldFormGroup(sampleWithNewData);

        const legalHold = service.getLegalHold(formGroup) as any;

        expect(legalHold).toMatchObject(sampleWithNewData);
      });

      it('should return NewLegalHold for empty LegalHold initial value', () => {
        const formGroup = service.createLegalHoldFormGroup();

        const legalHold = service.getLegalHold(formGroup) as any;

        expect(legalHold).toMatchObject({});
      });

      it('should return ILegalHold', () => {
        const formGroup = service.createLegalHoldFormGroup(sampleWithRequiredData);

        const legalHold = service.getLegalHold(formGroup) as any;

        expect(legalHold).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILegalHold should not enable id FormControl', () => {
        const formGroup = service.createLegalHoldFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLegalHold should disable id FormControl', () => {
        const formGroup = service.createLegalHoldFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
