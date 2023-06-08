import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SysParameterFormService, SysParameterFormGroup } from './sys-parameter-form.service';
import { ISysParameter } from '../sys-parameter.model';
import { SysParameterService } from '../service/sys-parameter.service';

@Component({
  selector: 'jhi-sys-parameter-update',
  templateUrl: './sys-parameter-update.component.html',
})
export class SysParameterUpdateComponent implements OnInit {
  isSaving = false;
  sysParameter: ISysParameter | null = null;

  editForm: SysParameterFormGroup = this.sysParameterFormService.createSysParameterFormGroup();

  constructor(
    protected sysParameterService: SysParameterService,
    protected sysParameterFormService: SysParameterFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sysParameter }) => {
      this.sysParameter = sysParameter;
      if (sysParameter) {
        this.updateForm(sysParameter);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sysParameter = this.sysParameterFormService.getSysParameter(this.editForm);
    if (sysParameter.id !== null) {
      this.subscribeToSaveResponse(this.sysParameterService.update(sysParameter));
    } else {
      this.subscribeToSaveResponse(this.sysParameterService.create(sysParameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISysParameter>>): void {
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

  protected updateForm(sysParameter: ISysParameter): void {
    this.sysParameter = sysParameter;
    this.sysParameterFormService.resetForm(this.editForm, sysParameter);
  }
}
