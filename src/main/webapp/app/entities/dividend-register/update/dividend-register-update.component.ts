import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DividendRegisterFormService, DividendRegisterFormGroup } from './dividend-register-form.service';
import { IDividendRegister } from '../dividend-register.model';
import { DividendRegisterService } from '../service/dividend-register.service';

@Component({
  selector: 'jhi-dividend-register-update',
  templateUrl: './dividend-register-update.component.html',
})
export class DividendRegisterUpdateComponent implements OnInit {
  isSaving = false;
  dividendRegister: IDividendRegister | null = null;

  editForm: DividendRegisterFormGroup = this.dividendRegisterFormService.createDividendRegisterFormGroup();

  constructor(
    protected dividendRegisterService: DividendRegisterService,
    protected dividendRegisterFormService: DividendRegisterFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dividendRegister }) => {
      this.dividendRegister = dividendRegister;
      if (dividendRegister) {
        this.updateForm(dividendRegister);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dividendRegister = this.dividendRegisterFormService.getDividendRegister(this.editForm);
    if (dividendRegister.id !== null) {
      this.subscribeToSaveResponse(this.dividendRegisterService.update(dividendRegister));
    } else {
      this.subscribeToSaveResponse(this.dividendRegisterService.create(dividendRegister));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDividendRegister>>): void {
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

  protected updateForm(dividendRegister: IDividendRegister): void {
    this.dividendRegister = dividendRegister;
    this.dividendRegisterFormService.resetForm(this.editForm, dividendRegister);
  }
}
