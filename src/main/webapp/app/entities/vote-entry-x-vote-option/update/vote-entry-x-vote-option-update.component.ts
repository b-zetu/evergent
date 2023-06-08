import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VoteEntryXVoteOptionFormService, VoteEntryXVoteOptionFormGroup } from './vote-entry-x-vote-option-form.service';
import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import { VoteEntryXVoteOptionService } from '../service/vote-entry-x-vote-option.service';
import { IVoteEntry } from 'app/entities/vote-entry/vote-entry.model';
import { VoteEntryService } from 'app/entities/vote-entry/service/vote-entry.service';
import { IVoteOption } from 'app/entities/vote-option/vote-option.model';
import { VoteOptionService } from 'app/entities/vote-option/service/vote-option.service';

@Component({
  selector: 'jhi-vote-entry-x-vote-option-update',
  templateUrl: './vote-entry-x-vote-option-update.component.html',
})
export class VoteEntryXVoteOptionUpdateComponent implements OnInit {
  isSaving = false;
  voteEntryXVoteOption: IVoteEntryXVoteOption | null = null;

  voteEntriesSharedCollection: IVoteEntry[] = [];
  voteOptionsSharedCollection: IVoteOption[] = [];

  editForm: VoteEntryXVoteOptionFormGroup = this.voteEntryXVoteOptionFormService.createVoteEntryXVoteOptionFormGroup();

  constructor(
    protected voteEntryXVoteOptionService: VoteEntryXVoteOptionService,
    protected voteEntryXVoteOptionFormService: VoteEntryXVoteOptionFormService,
    protected voteEntryService: VoteEntryService,
    protected voteOptionService: VoteOptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVoteEntry = (o1: IVoteEntry | null, o2: IVoteEntry | null): boolean => this.voteEntryService.compareVoteEntry(o1, o2);

  compareVoteOption = (o1: IVoteOption | null, o2: IVoteOption | null): boolean => this.voteOptionService.compareVoteOption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voteEntryXVoteOption }) => {
      this.voteEntryXVoteOption = voteEntryXVoteOption;
      if (voteEntryXVoteOption) {
        this.updateForm(voteEntryXVoteOption);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voteEntryXVoteOption = this.voteEntryXVoteOptionFormService.getVoteEntryXVoteOption(this.editForm);
    if (voteEntryXVoteOption.id !== null) {
      this.subscribeToSaveResponse(this.voteEntryXVoteOptionService.update(voteEntryXVoteOption));
    } else {
      this.subscribeToSaveResponse(this.voteEntryXVoteOptionService.create(voteEntryXVoteOption));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoteEntryXVoteOption>>): void {
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

  protected updateForm(voteEntryXVoteOption: IVoteEntryXVoteOption): void {
    this.voteEntryXVoteOption = voteEntryXVoteOption;
    this.voteEntryXVoteOptionFormService.resetForm(this.editForm, voteEntryXVoteOption);

    this.voteEntriesSharedCollection = this.voteEntryService.addVoteEntryToCollectionIfMissing<IVoteEntry>(
      this.voteEntriesSharedCollection,
      voteEntryXVoteOption.voteEntry
    );
    this.voteOptionsSharedCollection = this.voteOptionService.addVoteOptionToCollectionIfMissing<IVoteOption>(
      this.voteOptionsSharedCollection,
      voteEntryXVoteOption.voteOption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.voteEntryService
      .query()
      .pipe(map((res: HttpResponse<IVoteEntry[]>) => res.body ?? []))
      .pipe(
        map((voteEntries: IVoteEntry[]) =>
          this.voteEntryService.addVoteEntryToCollectionIfMissing<IVoteEntry>(voteEntries, this.voteEntryXVoteOption?.voteEntry)
        )
      )
      .subscribe((voteEntries: IVoteEntry[]) => (this.voteEntriesSharedCollection = voteEntries));

    this.voteOptionService
      .query()
      .pipe(map((res: HttpResponse<IVoteOption[]>) => res.body ?? []))
      .pipe(
        map((voteOptions: IVoteOption[]) =>
          this.voteOptionService.addVoteOptionToCollectionIfMissing<IVoteOption>(voteOptions, this.voteEntryXVoteOption?.voteOption)
        )
      )
      .subscribe((voteOptions: IVoteOption[]) => (this.voteOptionsSharedCollection = voteOptions));
  }
}
