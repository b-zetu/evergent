import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ShareholderXGroupFormService, ShareholderXGroupFormGroup } from './shareholder-x-group-form.service';
import { IShareholderXGroup } from '../shareholder-x-group.model';
import { ShareholderXGroupService } from '../service/shareholder-x-group.service';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IGroup } from 'app/entities/group/group.model';
import { GroupService } from 'app/entities/group/service/group.service';

@Component({
  selector: 'jhi-shareholder-x-group-update',
  templateUrl: './shareholder-x-group-update.component.html',
})
export class ShareholderXGroupUpdateComponent implements OnInit {
  isSaving = false;
  shareholderXGroup: IShareholderXGroup | null = null;

  shareholdersSharedCollection: IShareholder[] = [];
  groupsSharedCollection: IGroup[] = [];

  editForm: ShareholderXGroupFormGroup = this.shareholderXGroupFormService.createShareholderXGroupFormGroup();

  constructor(
    protected shareholderXGroupService: ShareholderXGroupService,
    protected shareholderXGroupFormService: ShareholderXGroupFormService,
    protected shareholderService: ShareholderService,
    protected groupService: GroupService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShareholder = (o1: IShareholder | null, o2: IShareholder | null): boolean => this.shareholderService.compareShareholder(o1, o2);

  compareGroup = (o1: IGroup | null, o2: IGroup | null): boolean => this.groupService.compareGroup(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shareholderXGroup }) => {
      this.shareholderXGroup = shareholderXGroup;
      if (shareholderXGroup) {
        this.updateForm(shareholderXGroup);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shareholderXGroup = this.shareholderXGroupFormService.getShareholderXGroup(this.editForm);
    if (shareholderXGroup.id !== null) {
      this.subscribeToSaveResponse(this.shareholderXGroupService.update(shareholderXGroup));
    } else {
      this.subscribeToSaveResponse(this.shareholderXGroupService.create(shareholderXGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShareholderXGroup>>): void {
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

  protected updateForm(shareholderXGroup: IShareholderXGroup): void {
    this.shareholderXGroup = shareholderXGroup;
    this.shareholderXGroupFormService.resetForm(this.editForm, shareholderXGroup);

    this.shareholdersSharedCollection = this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(
      this.shareholdersSharedCollection,
      shareholderXGroup.shareholder
    );
    this.groupsSharedCollection = this.groupService.addGroupToCollectionIfMissing<IGroup>(
      this.groupsSharedCollection,
      shareholderXGroup.group
    );
  }

  protected loadRelationshipsOptions(): void {
    this.shareholderService
      .query()
      .pipe(map((res: HttpResponse<IShareholder[]>) => res.body ?? []))
      .pipe(
        map((shareholders: IShareholder[]) =>
          this.shareholderService.addShareholderToCollectionIfMissing<IShareholder>(shareholders, this.shareholderXGroup?.shareholder)
        )
      )
      .subscribe((shareholders: IShareholder[]) => (this.shareholdersSharedCollection = shareholders));

    this.groupService
      .query()
      .pipe(map((res: HttpResponse<IGroup[]>) => res.body ?? []))
      .pipe(map((groups: IGroup[]) => this.groupService.addGroupToCollectionIfMissing<IGroup>(groups, this.shareholderXGroup?.group)))
      .subscribe((groups: IGroup[]) => (this.groupsSharedCollection = groups));
  }
}
