import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VoteEntryFormService, VoteEntryFormGroup } from './vote-entry-form.service';
import { IVoteEntry } from '../vote-entry.model';
import { VoteEntryService } from '../service/vote-entry.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IVoteProposal } from 'app/entities/vote-proposal/vote-proposal.model';
import { VoteProposalService } from 'app/entities/vote-proposal/service/vote-proposal.service';

@Component({
  selector: 'jhi-vote-entry-update',
  templateUrl: './vote-entry-update.component.html',
})
export class VoteEntryUpdateComponent implements OnInit {
  isSaving = false;
  voteEntry: IVoteEntry | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  voteProposalsSharedCollection: IVoteProposal[] = [];

  editForm: VoteEntryFormGroup = this.voteEntryFormService.createVoteEntryFormGroup();

  constructor(
    protected voteEntryService: VoteEntryService,
    protected voteEntryFormService: VoteEntryFormService,
    protected shareholderService: ShareholderService,
    protected voteProposalService: VoteProposalService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  compareVoteProposal = (o1: IVoteProposal | null, o2: IVoteProposal | null): boolean =>
    this.voteProposalService.compareVoteProposal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteEntry }) => {
      this.voteEntry = voteEntry;
      if (voteEntry) {
        this.updateForm(voteEntry);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voteEntry = this.voteEntryFormService.getVoteEntry(this.editForm);
    if (voteEntry.id !== null) {
      this.subscribeToSaveResponse(this.voteEntryService.update(voteEntry));
    } else {
      this.subscribeToSaveResponse(this.voteEntryService.create(voteEntry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoteEntry>>): void {
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

  protected updateForm(voteEntry: IVoteEntry): void {
    this.voteEntry = voteEntry;
    this.voteEntryFormService.resetForm(this.editForm, voteEntry);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      voteEntry.shareholder
    );
    this.voteProposalsSharedCollection = this.voteProposalService.addVoteProposalToCollectionIfMissing<IVoteProposal>(
      this.voteProposalsSharedCollection,
      voteEntry.voteProposal
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.voteEntry?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.voteProposalService
      .query()
      .pipe(map((res: HttpResponse<IVoteProposal[]>) => res.body ?? []))
      .pipe(
        map((voteProposals: IVoteProposal[]) =>
          this.voteProposalService.addVoteProposalToCollectionIfMissing<IVoteProposal>(voteProposals, this.voteEntry?.voteProposal)
        )
      )
      .subscribe((voteProposals: IVoteProposal[]) => (this.voteProposalsSharedCollection = voteProposals));
  }
}
