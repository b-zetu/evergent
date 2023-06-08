import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShareholder, NewShareholder } from '../shareholder.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShareholder for edit and NewShareholderFormGroupInput for create.
 */
type ShareholderFormGroupInput = IShareholder | PartialWithRequiredKeyOf<NewShareholder>;

type ShareholderFormDefaults = Pick<NewShareholder, 'id' | 'isPf' | 'isResident'>;

type ShareholderFormGroupContent = {
  id: FormControl<IShareholder['id'] | NewShareholder['id']>;
  shareholderIdDC: FormControl<IShareholder['shareholderIdDC']>;
  cnp: FormControl<IShareholder['cnp']>;
  firstName: FormControl<IShareholder['firstName']>;
  lastName: FormControl<IShareholder['lastName']>;
  sharesNo: FormControl<IShareholder['sharesNo']>;
  isPf: FormControl<IShareholder['isPf']>;
  isResident: FormControl<IShareholder['isResident']>;
  taxValue: FormControl<IShareholder['taxValue']>;
  status: FormControl<IShareholder['status']>;
  countryResidence: FormControl<IShareholder['countryResidence']>;
  countyResidence: FormControl<IShareholder['countyResidence']>;
  cityResidence: FormControl<IShareholder['cityResidence']>;
  villageResidence: FormControl<IShareholder['villageResidence']>;
  foreignLocalityResidence: FormControl<IShareholder['foreignLocalityResidence']>;
  streetResidence: FormControl<IShareholder['streetResidence']>;
  streetNo: FormControl<IShareholder['streetNo']>;
  paymentOption: FormControl<IShareholder['paymentOption']>;
};

export type ShareholderFormGroup = FormGroup<ShareholderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShareholderFormService {
  createShareholderFormGroup(shareholder: ShareholderFormGroupInput = { id: null }): ShareholderFormGroup {
    const shareholderRawValue = {
      ...this.getFormDefaults(),
      ...shareholder,
    };
    return new FormGroup<ShareholderFormGroupContent>({
      id: new FormControl(
        { value: shareholderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      shareholderIdDC: new FormControl(shareholderRawValue.shareholderIdDC),
      cnp: new FormControl(shareholderRawValue.cnp),
      firstName: new FormControl(shareholderRawValue.firstName),
      lastName: new FormControl(shareholderRawValue.lastName),
      sharesNo: new FormControl(shareholderRawValue.sharesNo),
      isPf: new FormControl(shareholderRawValue.isPf),
      isResident: new FormControl(shareholderRawValue.isResident),
      taxValue: new FormControl(shareholderRawValue.taxValue),
      status: new FormControl(shareholderRawValue.status),
      countryResidence: new FormControl(shareholderRawValue.countryResidence),
      countyResidence: new FormControl(shareholderRawValue.countyResidence),
      cityResidence: new FormControl(shareholderRawValue.cityResidence),
      villageResidence: new FormControl(shareholderRawValue.villageResidence),
      foreignLocalityResidence: new FormControl(shareholderRawValue.foreignLocalityResidence),
      streetResidence: new FormControl(shareholderRawValue.streetResidence),
      streetNo: new FormControl(shareholderRawValue.streetNo),
      paymentOption: new FormControl(shareholderRawValue.paymentOption),
    });
  }

  getShareholder(form: ShareholderFormGroup): IShareholder | NewShareholder {
    return form.getRawValue() as IShareholder | NewShareholder;
  }

  resetForm(form: ShareholderFormGroup, shareholder: ShareholderFormGroupInput): void {
    const shareholderRawValue = { ...this.getFormDefaults(), ...shareholder };
    form.reset(
      {
        ...shareholderRawValue,
        id: { value: shareholderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShareholderFormDefaults {
    return {
      id: null,
      isPf: false,
      isResident: false,
    };
  }
}
