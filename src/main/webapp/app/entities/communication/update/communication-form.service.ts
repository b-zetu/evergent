import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICommunication, NewCommunication } from '../communication.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommunication for edit and NewCommunicationFormGroupInput for create.
 */
type CommunicationFormGroupInput = ICommunication | PartialWithRequiredKeyOf<NewCommunication>;

type CommunicationFormDefaults = Pick<NewCommunication, 'id'>;

type CommunicationFormGroupContent = {
  id: FormControl<ICommunication['id'] | NewCommunication['id']>;
  type: FormControl<ICommunication['type']>;
  message: FormControl<ICommunication['message']>;
  status: FormControl<ICommunication['status']>;
  shareholder: FormControl<ICommunication['shareholder']>;
};

export type CommunicationFormGroup = FormGroup<CommunicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommunicationFormService {
  createCommunicationFormGroup(communication: CommunicationFormGroupInput = { id: null }): CommunicationFormGroup {
    const communicationRawValue = {
      ...this.getFormDefaults(),
      ...communication,
    };
    return new FormGroup<CommunicationFormGroupContent>({
      id: new FormControl(
        { value: communicationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(communicationRawValue.type),
      message: new FormControl(communicationRawValue.message),
      status: new FormControl(communicationRawValue.status),
      shareholder: new FormControl(communicationRawValue.shareholder),
    });
  }

  getCommunication(form: CommunicationFormGroup): ICommunication | NewCommunication {
    return form.getRawValue() as ICommunication | NewCommunication;
  }

  resetForm(form: CommunicationFormGroup, communication: CommunicationFormGroupInput): void {
    const communicationRawValue = { ...this.getFormDefaults(), ...communication };
    form.reset(
      {
        ...communicationRawValue,
        id: { value: communicationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommunicationFormDefaults {
    return {
      id: null,
    };
  }
}
