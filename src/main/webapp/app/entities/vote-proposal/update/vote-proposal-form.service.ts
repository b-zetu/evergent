import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVoteProposal, NewVoteProposal } from '../vote-proposal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoteProposal for edit and NewVoteProposalFormGroupInput for create.
 */
type VoteProposalFormGroupInput = IVoteProposal | PartialWithRequiredKeyOf<NewVoteProposal>;

type VoteProposalFormDefaults = Pick<NewVoteProposal, 'id'>;

type VoteProposalFormGroupContent = {
  id: FormControl<IVoteProposal['id'] | NewVoteProposal['id']>;
  title: FormControl<IVoteProposal['title']>;
  text: FormControl<IVoteProposal['text']>;
  startDate: FormControl<IVoteProposal['startDate']>;
  endDate: FormControl<IVoteProposal['endDate']>;
  status: FormControl<IVoteProposal['status']>;
};

export type VoteProposalFormGroup = FormGroup<VoteProposalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoteProposalFormService {
  createVoteProposalFormGroup(voteProposal: VoteProposalFormGroupInput = { id: null }): VoteProposalFormGroup {
    const voteProposalRawValue = {
      ...this.getFormDefaults(),
      ...voteProposal,
    };
    return new FormGroup<VoteProposalFormGroupContent>({
      id: new FormControl(
        { value: voteProposalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(voteProposalRawValue.title),
      text: new FormControl(voteProposalRawValue.text),
      startDate: new FormControl(voteProposalRawValue.startDate),
      endDate: new FormControl(voteProposalRawValue.endDate),
      status: new FormControl(voteProposalRawValue.status),
    });
  }

  getVoteProposal(form: VoteProposalFormGroup): IVoteProposal | NewVoteProposal {
    return form.getRawValue() as IVoteProposal | NewVoteProposal;
  }

  resetForm(form: VoteProposalFormGroup, voteProposal: VoteProposalFormGroupInput): void {
    const voteProposalRawValue = { ...this.getFormDefaults(), ...voteProposal };
    form.reset(
      {
        ...voteProposalRawValue,
        id: { value: voteProposalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoteProposalFormDefaults {
    return {
      id: null,
    };
  }
}
