import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISysParameter, NewSysParameter } from '../sys-parameter.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISysParameter for edit and NewSysParameterFormGroupInput for create.
 */
type SysParameterFormGroupInput = ISysParameter | PartialWithRequiredKeyOf<NewSysParameter>;

type SysParameterFormDefaults = Pick<NewSysParameter, 'id'>;

type SysParameterFormGroupContent = {
  id: FormControl<ISysParameter['id'] | NewSysParameter['id']>;
  key: FormControl<ISysParameter['key']>;
  value: FormControl<ISysParameter['value']>;
};

export type SysParameterFormGroup = FormGroup<SysParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SysParameterFormService {
  createSysParameterFormGroup(sysParameter: SysParameterFormGroupInput = { id: null }): SysParameterFormGroup {
    const sysParameterRawValue = {
      ...this.getFormDefaults(),
      ...sysParameter,
    };
    return new FormGroup<SysParameterFormGroupContent>({
      id: new FormControl(
        { value: sysParameterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      key: new FormControl(sysParameterRawValue.key),
      value: new FormControl(sysParameterRawValue.value),
    });
  }

  getSysParameter(form: SysParameterFormGroup): ISysParameter | NewSysParameter {
    return form.getRawValue() as ISysParameter | NewSysParameter;
  }

  resetForm(form: SysParameterFormGroup, sysParameter: SysParameterFormGroupInput): void {
    const sysParameterRawValue = { ...this.getFormDefaults(), ...sysParameter };
    form.reset(
      {
        ...sysParameterRawValue,
        id: { value: sysParameterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SysParameterFormDefaults {
    return {
      id: null,
    };
  }
}
