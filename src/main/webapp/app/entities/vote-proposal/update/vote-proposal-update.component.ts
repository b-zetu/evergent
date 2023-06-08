import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VoteProposalFormService, VoteProposalFormGroup } from './vote-proposal-form.service';
import { IVoteProposal } from '../vote-proposal.model';
import { VoteProposalService } from '../service/vote-proposal.service';

@Component({
  selector: 'jhi-vote-proposal-update',
  templateUrl: './vote-proposal-update.component.html',
})
export class VoteProposalUpdateComponent implements OnInit {
  isSaving = false;
  voteProposal: IVoteProposal | null = null;

  editForm: VoteProposalFormGroup = this.voteProposalFormService.createVoteProposalFormGroup();

  constructor(
    protected voteProposalService: VoteProposalService,
    protected voteProposalFormService: VoteProposalFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteProposal }) => {
      this.voteProposal = voteProposal;
      if (voteProposal) {
        this.updateForm(voteProposal);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voteProposal = this.voteProposalFormService.getVoteProposal(this.editForm);
    if (voteProposal.id !== null) {
      this.subscribeToSaveResponse(this.voteProposalService.update(voteProposal));
    } else {
      this.subscribeToSaveResponse(this.voteProposalService.create(voteProposal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoteProposal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(voteProposal: IVoteProposal): void {
    this.voteProposal = voteProposal;
    this.voteProposalFormService.resetForm(this.editForm, voteProposal);
  }
}
