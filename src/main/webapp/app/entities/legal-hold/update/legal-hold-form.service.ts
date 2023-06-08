import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILegalHold, NewLegalHold } from '../legal-hold.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILegalHold for edit and NewLegalHoldFormGroupInput for create.
 */
type LegalHoldFormGroupInput = ILegalHold | PartialWithRequiredKeyOf<NewLegalHold>;

type LegalHoldFormDefaults = Pick<NewLegalHold, 'id'>;

type LegalHoldFormGroupContent = {
  id: FormControl<ILegalHold['id'] | NewLegalHold['id']>;
  beneficiaryName: FormControl<ILegalHold['beneficiaryName']>;
  type: FormControl<ILegalHold['type']>;
  totalAmount: FormControl<ILegalHold['totalAmount']>;
  amountLeft: FormControl<ILegalHold['amountLeft']>;
  poprireNumber: FormControl<ILegalHold['poprireNumber']>;
  poprireDate: FormControl<ILegalHold['poprireDate']>;
  poprireDocumentNumber: FormControl<ILegalHold['poprireDocumentNumber']>;
  poprireDocumentDate: FormControl<ILegalHold['poprireDocumentDate']>;
  sistareNumber: FormControl<ILegalHold['sistareNumber']>;
  sistareDate: FormControl<ILegalHold['sistareDate']>;
  sistareIntrareNumber: FormControl<ILegalHold['sistareIntrareNumber']>;
  sistareIntrareDate: FormControl<ILegalHold['sistareIntrareDate']>;
  status: FormControl<ILegalHold['status']>;
  shareholder: FormControl<ILegalHold['shareholder']>;
  paymentOption: FormControl<ILegalHold['paymentOption']>;
};

export type LegalHoldFormGroup = FormGroup<LegalHoldFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LegalHoldFormService {
  createLegalHoldFormGroup(legalHold: LegalHoldFormGroupInput = { id: null }): LegalHoldFormGroup {
    const legalHoldRawValue = {
      ...this.getFormDefaults(),
      ...legalHold,
    };
    return new FormGroup<LegalHoldFormGroupContent>({
      id: new FormControl(
        { value: legalHoldRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      beneficiaryName: new FormControl(legalHoldRawValue.beneficiaryName),
      type: new FormControl(legalHoldRawValue.type),
      totalAmount: new FormControl(legalHoldRawValue.totalAmount),
      amountLeft: new FormControl(legalHoldRawValue.amountLeft),
      poprireNumber: new FormControl(legalHoldRawValue.poprireNumber),
      poprireDate: new FormControl(legalHoldRawValue.poprireDate),
      poprireDocumentNumber: new FormControl(legalHoldRawValue.poprireDocumentNumber),
      poprireDocumentDate: new FormControl(legalHoldRawValue.poprireDocumentDate),
      sistareNumber: new FormControl(legalHoldRawValue.sistareNumber),
      sistareDate: new FormControl(legalHoldRawValue.sistareDate),
      sistareIntrareNumber: new FormControl(legalHoldRawValue.sistareIntrareNumber),
      sistareIntrareDate: new FormControl(legalHoldRawValue.sistareIntrareDate),
      status: new FormControl(legalHoldRawValue.status),
      shareholder: new FormControl(legalHoldRawValue.shareholder),
      paymentOption: new FormControl(legalHoldRawValue.paymentOption),
    });
  }

  getLegalHold(form: LegalHoldFormGroup): ILegalHold | NewLegalHold {
    return form.getRawValue() as ILegalHold | NewLegalHold;
  }

  resetForm(form: LegalHoldFormGroup, legalHold: LegalHoldFormGroupInput): void {
    const legalHoldRawValue = { ...this.getFormDefaults(), ...legalHold };
    form.reset(
      {
        ...legalHoldRawValue,
        id: { value: legalHoldRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LegalHoldFormDefaults {
    return {
      id: null,
    };
  }
}
