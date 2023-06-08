import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDividendRegister, NewDividendRegister } from '../dividend-register.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDividendRegister for edit and NewDividendRegisterFormGroupInput for create.
 */
type DividendRegisterFormGroupInput = IDividendRegister | PartialWithRequiredKeyOf<NewDividendRegister>;

type DividendRegisterFormDefaults = Pick<NewDividendRegister, 'id'>;

type DividendRegisterFormGroupContent = {
  id: FormControl<IDividendRegister['id'] | NewDividendRegister['id']>;
  referenceDate: FormControl<IDividendRegister['referenceDate']>;
  dividendGrossValue: FormControl<IDividendRegister['dividendGrossValue']>;
  status: FormControl<IDividendRegister['status']>;
};

export type DividendRegisterFormGroup = FormGroup<DividendRegisterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DividendRegisterFormService {
  createDividendRegisterFormGroup(dividendRegister: DividendRegisterFormGroupInput = { id: null }): DividendRegisterFormGroup {
    const dividendRegisterRawValue = {
      ...this.getFormDefaults(),
      ...dividendRegister,
    };
    return new FormGroup<DividendRegisterFormGroupContent>({
      id: new FormControl(
        { value: dividendRegisterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      referenceDate: new FormControl(dividendRegisterRawValue.referenceDate),
      dividendGrossValue: new FormControl(dividendRegisterRawValue.dividendGrossValue),
      status: new FormControl(dividendRegisterRawValue.status),
    });
  }

  getDividendRegister(form: DividendRegisterFormGroup): IDividendRegister | NewDividendRegister {
    return form.getRawValue() as IDividendRegister | NewDividendRegister;
  }

  resetForm(form: DividendRegisterFormGroup, dividendRegister: DividendRegisterFormGroupInput): void {
    const dividendRegisterRawValue = { ...this.getFormDefaults(), ...dividendRegister };
    form.reset(
      {
        ...dividendRegisterRawValue,
        id: { value: dividendRegisterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DividendRegisterFormDefaults {
    return {
      id: null,
    };
  }
}
