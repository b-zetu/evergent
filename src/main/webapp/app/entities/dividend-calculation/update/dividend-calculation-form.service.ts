import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDividendCalculation, NewDividendCalculation } from '../dividend-calculation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDividendCalculation for edit and NewDividendCalculationFormGroupInput for create.
 */
type DividendCalculationFormGroupInput = IDividendCalculation | PartialWithRequiredKeyOf<NewDividendCalculation>;

type DividendCalculationFormDefaults = Pick<NewDividendCalculation, 'id'>;

type DividendCalculationFormGroupContent = {
  id: FormControl<IDividendCalculation['id'] | NewDividendCalculation['id']>;
  totalNetAmount: FormControl<IDividendCalculation['totalNetAmount']>;
  taxAmountCalculated: FormControl<IDividendCalculation['taxAmountCalculated']>;
  totalGrossAmount: FormControl<IDividendCalculation['totalGrossAmount']>;
  dividendShareholder: FormControl<IDividendCalculation['dividendShareholder']>;
};

export type DividendCalculationFormGroup = FormGroup<DividendCalculationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DividendCalculationFormService {
  createDividendCalculationFormGroup(dividendCalculation: DividendCalculationFormGroupInput = { id: null }): DividendCalculationFormGroup {
    const dividendCalculationRawValue = {
      ...this.getFormDefaults(),
      ...dividendCalculation,
    };
    return new FormGroup<DividendCalculationFormGroupContent>({
      id: new FormControl(
        { value: dividendCalculationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalNetAmount: new FormControl(dividendCalculationRawValue.totalNetAmount),
      taxAmountCalculated: new FormControl(dividendCalculationRawValue.taxAmountCalculated),
      totalGrossAmount: new FormControl(dividendCalculationRawValue.totalGrossAmount),
      dividendShareholder: new FormControl(dividendCalculationRawValue.dividendShareholder),
    });
  }

  getDividendCalculation(form: DividendCalculationFormGroup): IDividendCalculation | NewDividendCalculation {
    return form.getRawValue() as IDividendCalculation | NewDividendCalculation;
  }

  resetForm(form: DividendCalculationFormGroup, dividendCalculation: DividendCalculationFormGroupInput): void {
    const dividendCalculationRawValue = { ...this.getFormDefaults(), ...dividendCalculation };
    form.reset(
      {
        ...dividendCalculationRawValue,
        id: { value: dividendCalculationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DividendCalculationFormDefaults {
    return {
      id: null,
    };
  }
}
