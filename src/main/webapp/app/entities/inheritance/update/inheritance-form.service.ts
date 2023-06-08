import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInheritance, NewInheritance } from '../inheritance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInheritance for edit and NewInheritanceFormGroupInput for create.
 */
type InheritanceFormGroupInput = IInheritance | PartialWithRequiredKeyOf<NewInheritance>;

type InheritanceFormDefaults = Pick<NewInheritance, 'id'>;

type InheritanceFormGroupContent = {
  id: FormControl<IInheritance['id'] | NewInheritance['id']>;
  operationDate: FormControl<IInheritance['operationDate']>;
  documentNumber: FormControl<IInheritance['documentNumber']>;
  documentDate: FormControl<IInheritance['documentDate']>;
  sharesNo: FormControl<IInheritance['sharesNo']>;
  status: FormControl<IInheritance['status']>;
};

export type InheritanceFormGroup = FormGroup<InheritanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InheritanceFormService {
  createInheritanceFormGroup(inheritance: InheritanceFormGroupInput = { id: null }): InheritanceFormGroup {
    const inheritanceRawValue = {
      ...this.getFormDefaults(),
      ...inheritance,
    };
    return new FormGroup<InheritanceFormGroupContent>({
      id: new FormControl(
        { value: inheritanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      operationDate: new FormControl(inheritanceRawValue.operationDate),
      documentNumber: new FormControl(inheritanceRawValue.documentNumber),
      documentDate: new FormControl(inheritanceRawValue.documentDate),
      sharesNo: new FormControl(inheritanceRawValue.sharesNo),
      status: new FormControl(inheritanceRawValue.status),
    });
  }

  getInheritance(form: InheritanceFormGroup): IInheritance | NewInheritance {
    return form.getRawValue() as IInheritance | NewInheritance;
  }

  resetForm(form: InheritanceFormGroup, inheritance: InheritanceFormGroupInput): void {
    const inheritanceRawValue = { ...this.getFormDefaults(), ...inheritance };
    form.reset(
      {
        ...inheritanceRawValue,
        id: { value: inheritanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InheritanceFormDefaults {
    return {
      id: null,
    };
  }
}
