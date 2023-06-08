import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VoteOptionFormService, VoteOptionFormGroup } from './vote-option-form.service';
import { IVoteOption } from '../vote-option.model';
import { VoteOptionService } from '../service/vote-option.service';
import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';
import { VoteProposalService } from 'app/entities/vote-proposal/service/vote-proposal.service';

@Component({
  selector: 'jhi-vote-option-update',
  templateUrl: './vote-option-update.component.html',
})
export class VoteOptionUpdateComponent implements OnInit {
  isSaving = false;
  voteOption: IVoteOption | null = null;

  voteProposalsSharedCollection: IVoteProposal[] = [];

  editForm: VoteOptionFormGroup = this.voteOptionFormService.createVoteOptionFormGroup();

  constructor(
    protected voteOptionService: VoteOptionService,
    protected voteOptionFormService: VoteOptionFormService,
    protected voteProposalService: VoteProposalService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVoteProposal = (o1: IVoteProposal | null, o2: IVoteProposal | null): boolean =>
    this.voteProposalService.compareVoteProposal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteOption }) => {
      this.voteOption = voteOption;
      if (voteOption) {
        this.updateForm(voteOption);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voteOption = this.voteOptionFormService.getVoteOption(this.editForm);
    if (voteOption.id !== null) {
      this.subscribeToSaveResponse(this.voteOptionService.update(voteOption));
    } else {
      this.subscribeToSaveResponse(this.voteOptionService.create(voteOption));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoteOption>>): void {
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

  protected updateForm(voteOption: IVoteOption): void {
    this.voteOption = voteOption;
    this.voteOptionFormService.resetForm(this.editForm, voteOption);

    this.voteProposalsSharedCollection = this.voteProposalService.addVoteProposalToCollectionIfMissing<IVoteProposal>(
      this.voteProposalsSharedCollection,
      voteOption.voteProposal
    );
  }

  protected loadRelationshipsOptions(): void {
    this.voteProposalService
      .query()
      .pipe(map((res: HttpResponse<IVoteProposal[]>) => res.body ?? []))
      .pipe(
        map((voteProposals: IVoteProposal[]) =>
          this.voteProposalService.addVoteProposalToCollectionIfMissing<IVoteProposal>(voteProposals, this.voteOption?.voteProposal)
        )
      )
      .subscribe((voteProposals: IVoteProposal[]) => (this.voteProposalsSharedCollection = voteProposals));
  }
}
