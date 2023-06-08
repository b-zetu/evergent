import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVoteOption, NewVoteOption } from '../vote-option.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoteOption for edit and NewVoteOptionFormGroupInput for create.
 */
type VoteOptionFormGroupInput = IVoteOption | PartialWithRequiredKeyOf<NewVoteOption>;

type VoteOptionFormDefaults = Pick<NewVoteOption, 'id'>;

type VoteOptionFormGroupContent = {
  id: FormControl<IVoteOption['id'] | NewVoteOption['id']>;
  code: FormControl<IVoteOption['code']>;
  text: FormControl<IVoteOption['text']>;
  voteProposal: FormControl<IVoteOption['voteProposal']>;
};

export type VoteOptionFormGroup = FormGroup<VoteOptionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoteOptionFormService {
  createVoteOptionFormGroup(voteOption: VoteOptionFormGroupInput = { id: null }): VoteOptionFormGroup {
    const voteOptionRawValue = {
      ...this.getFormDefaults(),
      ...voteOption,
    };
    return new FormGroup<VoteOptionFormGroupContent>({
      id: new FormControl(
        { value: voteOptionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(voteOptionRawValue.code),
      text: new FormControl(voteOptionRawValue.text),
      voteProposal: new FormControl(voteOptionRawValue.voteProposal),
    });
  }

  getVoteOption(form: VoteOptionFormGroup): IVoteOption | NewVoteOption {
    return form.getRawValue() as IVoteOption | NewVoteOption;
  }

  resetForm(form: VoteOptionFormGroup, voteOption: VoteOptionFormGroupInput): void {
    const voteOptionRawValue = { ...this.getFormDefaults(), ...voteOption };
    form.reset(
      {
        ...voteOptionRawValue,
        id: { value: voteOptionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoteOptionFormDefaults {
    return {
      id: null,
    };
  }
}
