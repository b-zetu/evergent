import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDividendShareholder, NewDividendShareholder } from '../dividend-shareholder.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDividendShareholder for edit and NewDividendShareholderFormGroupInput for create.
 */
type DividendShareholderFormGroupInput = IDividendShareholder | PartialWithRequiredKeyOf<NewDividendShareholder>;

type DividendShareholderFormDefaults = Pick<NewDividendShareholder, 'id' | 'isResident'>;

type DividendShareholderFormGroupContent = {
  id: FormControl<IDividendShareholder['id'] | NewDividendShareholder['id']>;
  sharesNo: FormControl<IDividendShareholder['sharesNo']>;
  isResident: FormControl<IDividendShareholder['isResident']>;
  taxValue: FormControl<IDividendShareholder['taxValue']>;
  status: FormControl<IDividendShareholder['status']>;
  shareholder: FormControl<IDividendShareholder['shareholder']>;
  dividendRegister: FormControl<IDividendShareholder['dividendRegister']>;
  paymentOption: FormControl<IDividendShareholder['paymentOption']>;
};

export type DividendShareholderFormGroup = FormGroup<DividendShareholderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DividendShareholderFormService {
  createDividendShareholderFormGroup(dividendShareholder: DividendShareholderFormGroupInput = { id: null }): DividendShareholderFormGroup {
    const dividendShareholderRawValue = {
      ...this.getFormDefaults(),
      ...dividendShareholder,
    };
    return new FormGroup<DividendShareholderFormGroupContent>({
      id: new FormControl(
        { value: dividendShareholderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sharesNo: new FormControl(dividendShareholderRawValue.sharesNo),
      isResident: new FormControl(dividendShareholderRawValue.isResident),
      taxValue: new FormControl(dividendShareholderRawValue.taxValue),
      status: new FormControl(dividendShareholderRawValue.status),
      shareholder: new FormControl(dividendShareholderRawValue.shareholder),
      dividendRegister: new FormControl(dividendShareholderRawValue.dividendRegister),
      paymentOption: new FormControl(dividendShareholderRawValue.paymentOption),
    });
  }

  getDividendShareholder(form: DividendShareholderFormGroup): IDividendShareholder | NewDividendShareholder {
    return form.getRawValue() as IDividendShareholder | NewDividendShareholder;
  }

  resetForm(form: DividendShareholderFormGroup, dividendShareholder: DividendShareholderFormGroupInput): void {
    const dividendShareholderRawValue = { ...this.getFormDefaults(), ...dividendShareholder };
    form.reset(
      {
        ...dividendShareholderRawValue,
        id: { value: dividendShareholderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DividendShareholderFormDefaults {
    return {
      id: null,
      isResident: false,
    };
  }
}
