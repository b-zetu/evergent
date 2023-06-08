import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVoteEntry, NewVoteEntry } from '../vote-entry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoteEntry for edit and NewVoteEntryFormGroupInput for create.
 */
type VoteEntryFormGroupInput = IVoteEntry | PartialWithRequiredKeyOf<NewVoteEntry>;

type VoteEntryFormDefaults = Pick<NewVoteEntry, 'id'>;

type VoteEntryFormGroupContent = {
  id: FormControl<IVoteEntry['id'] | NewVoteEntry['id']>;
  shareholder: FormControl<IVoteEntry['shareholder']>;
  voteProposal: FormControl<IVoteEntry['voteProposal']>;
};

export type VoteEntryFormGroup = FormGroup<VoteEntryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoteEntryFormService {
  createVoteEntryFormGroup(voteEntry: VoteEntryFormGroupInput = { id: null }): VoteEntryFormGroup {
    const voteEntryRawValue = {
      ...this.getFormDefaults(),
      ...voteEntry,
    };
    return new FormGroup<VoteEntryFormGroupContent>({
      id: new FormControl(
        { value: voteEntryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      shareholder: new FormControl(voteEntryRawValue.shareholder),
      voteProposal: new FormControl(voteEntryRawValue.voteProposal),
    });
  }

  getVoteEntry(form: VoteEntryFormGroup): IVoteEntry | NewVoteEntry {
    return form.getRawValue() as IVoteEntry | NewVoteEntry;
  }

  resetForm(form: VoteEntryFormGroup, voteEntry: VoteEntryFormGroupInput): void {
    const voteEntryRawValue = { ...this.getFormDefaults(), ...voteEntry };
    form.reset(
      {
        ...voteEntryRawValue,
        id: { value: voteEntryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoteEntryFormDefaults {
    return {
      id: null,
    };
  }
}
