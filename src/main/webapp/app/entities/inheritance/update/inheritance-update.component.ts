import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { InheritanceFormService, InheritanceFormGroup } from './inheritance-form.service';
import { IInheritance } from '../inheritance.model';
import { InheritanceService } from '../service/inheritance.service';

@Component({
  selector: 'jhi-inheritance-update',
  templateUrl: './inheritance-update.component.html',
})
export class InheritanceUpdateComponent implements OnInit {
  isSaving = false;
  inheritance: IInheritance | null = null;

  editForm: InheritanceFormGroup = this.inheritanceFormService.createInheritanceFormGroup();

  constructor(
    protected inheritanceService: InheritanceService,
    protected inheritanceFormService: InheritanceFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inheritance }) => {
      this.inheritance = inheritance;
      if (inheritance) {
        this.updateForm(inheritance);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inheritance = this.inheritanceFormService.getInheritance(this.editForm);
    if (inheritance.id !== null) {
      this.subscribeToSaveResponse(this.inheritanceService.update(inheritance));
    } else {
      this.subscribeToSaveResponse(this.inheritanceService.create(inheritance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInheritance>>): void {
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

  protected updateForm(inheritance: IInheritance): void {
    this.inheritance = inheritance;
    this.inheritanceFormService.resetForm(this.editForm, inheritance);
  }
}
