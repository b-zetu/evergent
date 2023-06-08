import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../communication.test-samples';

import { CommunicationFormService } from './communication-form.service';

describe('Communication Form Service', () => {
  let service: CommunicationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationFormService);
  });

  describe('Service methods', () => {
    describe('createCommunicationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCommunicationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            message: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
          })
        );
      });

      it('passing ICommunication should create a new form with FormGroup', () => {
        const formGroup = service.createCommunicationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            message: expect.any(Object),
            status: expect.any(Object),
            shareholder: expect.any(Object),
          })
        );
      });
    });

    describe('getCommunication', () => {
      it('should return NewCommunication for default Communication initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCommunicationFormGroup(sampleWithNewData);

        const communication = service.getCommunication(formGroup) as any;

        expect(communication).toMatchObject(sampleWithNewData);
      });

      it('should return NewCommunication for empty Communication initial value', () => {
        const formGroup = service.createCommunicationFormGroup();

        const communication = service.getCommunication(formGroup) as any;

        expect(communication).toMatchObject({});
      });

      it('should return ICommunication', () => {
        const formGroup = service.createCommunicationFormGroup(sampleWithRequiredData);

        const communication = service.getCommunication(formGroup) as any;

        expect(communication).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICommunication should not enable id FormControl', () => {
        const formGroup = service.createCommunicationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCommunication should disable id FormControl', () => {
        const formGroup = service.createCommunicationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
