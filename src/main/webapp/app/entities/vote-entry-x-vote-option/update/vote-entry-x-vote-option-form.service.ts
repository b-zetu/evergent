import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVoteEntryXVoteOption, NewVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoteEntryXVoteOption for edit and NewVoteEntryXVoteOptionFormGroupInput for create.
 */
type VoteEntryXVoteOptionFormGroupInput = IVoteEntryXVoteOption | PartialWithRequiredKeyOf<NewVoteEntryXVoteOption>;

type VoteEntryXVoteOptionFormDefaults = Pick<NewVoteEntryXVoteOption, 'id'>;

type VoteEntryXVoteOptionFormGroupContent = {
  id: FormControl<IVoteEntryXVoteOption['id'] | NewVoteEntryXVoteOption['id']>;
  voteEntry: FormControl<IVoteEntryXVoteOption['voteEntry']>;
  voteOption: FormControl<IVoteEntryXVoteOption['voteOption']>;
};

export type VoteEntryXVoteOptionFormGroup = FormGroup<VoteEntryXVoteOptionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoteEntryXVoteOptionFormService {
  createVoteEntryXVoteOptionFormGroup(
    voteEntryXVoteOption: VoteEntryXVoteOptionFormGroupInput = { id: null }
  ): VoteEntryXVoteOptionFormGroup {
    const voteEntryXVoteOptionRawValue = {
      ...this.getFormDefaults(),
      ...voteEntryXVoteOption,
    };
    return new FormGroup<VoteEntryXVoteOptionFormGroupContent>({
      id: new FormControl(
        { value: voteEntryXVoteOptionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      voteEntry: new FormControl(voteEntryXVoteOptionRawValue.voteEntry),
      voteOption: new FormControl(voteEntryXVoteOptionRawValue.voteOption),
    });
  }

  getVoteEntryXVoteOption(form: VoteEntryXVoteOptionFormGroup): IVoteEntryXVoteOption | NewVoteEntryXVoteOption {
    return form.getRawValue() as IVoteEntryXVoteOption | NewVoteEntryXVoteOption;
  }

  resetForm(form: VoteEntryXVoteOptionFormGroup, voteEntryXVoteOption: VoteEntryXVoteOptionFormGroupInput): void {
    const voteEntryXVoteOptionRawValue = { ...this.getFormDefaults(), ...voteEntryXVoteOption };
    form.reset(
      {
        ...voteEntryXVoteOptionRawValue,
        id: { value: voteEntryXVoteOptionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoteEntryXVoteOptionFormDefaults {
    return {
      id: null,
    };
  }
}
