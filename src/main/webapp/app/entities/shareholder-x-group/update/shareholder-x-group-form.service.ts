import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShareholderXGroup, NewShareholderXGroup } from '../shareholder-x-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShareholderXGroup for edit and NewShareholderXGroupFormGroupInput for create.
 */
type ShareholderXGroupFormGroupInput = IShareholderXGroup | PartialWithRequiredKeyOf<NewShareholderXGroup>;

type ShareholderXGroupFormDefaults = Pick<NewShareholderXGroup, 'id'>;

type ShareholderXGroupFormGroupContent = {
  id: FormControl<IShareholderXGroup['id'] | NewShareholderXGroup['id']>;
  shareholder: FormControl<IShareholderXGroup['shareholder']>;
  group: FormControl<IShareholderXGroup['group']>;
};

export type ShareholderXGroupFormGroup = FormGroup<ShareholderXGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShareholderXGroupFormService {
  createShareholderXGroupFormGroup(shareholderXGroup: ShareholderXGroupFormGroupInput = { id: null }): ShareholderXGroupFormGroup {
    const shareholderXGroupRawValue = {
      ...this.getFormDefaults(),
      ...shareholderXGroup,
    };
    return new FormGroup<ShareholderXGroupFormGroupContent>({
      id: new FormControl(
        { value: shareholderXGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      shareholder: new FormControl(shareholderXGroupRawValue.shareholder),
      group: new FormControl(shareholderXGroupRawValue.group),
    });
  }

  getShareholderXGroup(form: ShareholderXGroupFormGroup): IShareholderXGroup | NewShareholderXGroup {
    return form.getRawValue() as IShareholderXGroup | NewShareholderXGroup;
  }

  resetForm(form: ShareholderXGroupFormGroup, shareholderXGroup: ShareholderXGroupFormGroupInput): void {
    const shareholderXGroupRawValue = { ...this.getFormDefaults(), ...shareholderXGroup };
    form.reset(
      {
        ...shareholderXGroupRawValue,
        id: { value: shareholderXGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShareholderXGroupFormDefaults {
    return {
      id: null,
    };
  }
}
