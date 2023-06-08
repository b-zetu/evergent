import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShareholderXInheritance, NewShareholderXInheritance } from '../shareholder-x-inheritance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShareholderXInheritance for edit and NewShareholderXInheritanceFormGroupInput for create.
 */
type ShareholderXInheritanceFormGroupInput = IShareholderXInheritance | PartialWithRequiredKeyOf<NewShareholderXInheritance>;

type ShareholderXInheritanceFormDefaults = Pick<NewShareholderXInheritance, 'id'>;

type ShareholderXInheritanceFormGroupContent = {
  id: FormControl<IShareholderXInheritance['id'] | NewShareholderXInheritance['id']>;
  deceased: FormControl<IShareholderXInheritance['deceased']>;
  receiver: FormControl<IShareholderXInheritance['receiver']>;
  inheritance: FormControl<IShareholderXInheritance['inheritance']>;
};

export type ShareholderXInheritanceFormGroup = FormGroup<ShareholderXInheritanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShareholderXInheritanceFormService {
  createShareholderXInheritanceFormGroup(
    shareholderXInheritance: ShareholderXInheritanceFormGroupInput = { id: null }
  ): ShareholderXInheritanceFormGroup {
    const shareholderXInheritanceRawValue = {
      ...this.getFormDefaults(),
      ...shareholderXInheritance,
    };
    return new FormGroup<ShareholderXInheritanceFormGroupContent>({
      id: new FormControl(
        { value: shareholderXInheritanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      deceased: new FormControl(shareholderXInheritanceRawValue.deceased),
      receiver: new FormControl(shareholderXInheritanceRawValue.receiver),
      inheritance: new FormControl(shareholderXInheritanceRawValue.inheritance),
    });
  }

  getShareholderXInheritance(form: ShareholderXInheritanceFormGroup): IShareholderXInheritance | NewShareholderXInheritance {
    return form.getRawValue() as IShareholderXInheritance | NewShareholderXInheritance;
  }

  resetForm(form: ShareholderXInheritanceFormGroup, shareholderXInheritance: ShareholderXInheritanceFormGroupInput): void {
    const shareholderXInheritanceRawValue = { ...this.getFormDefaults(), ...shareholderXInheritance };
    form.reset(
      {
        ...shareholderXInheritanceRawValue,
        id: { value: shareholderXInheritanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShareholderXInheritanceFormDefaults {
    return {
      id: null,
    };
  }
}
