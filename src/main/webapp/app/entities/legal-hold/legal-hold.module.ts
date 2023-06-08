import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LegalHoldComponent } from './list/legal-hold.component';
import { LegalHoldDetailComponent } from './detail/legal-hold-detail.component';
import { LegalHoldUpdateComponent } from './update/legal-hold-update.component';
import { LegalHoldDeleteDialogComponent } from './delete/legal-hold-delete-dialog.component';
import { LegalHoldRoutingModule } from './route/legal-hold-routing.module';

@NgModule({
  imports: [SharedModule, LegalHoldRoutingModule],
  declarations: [LegalHoldComponent, LegalHoldDetailComponent, LegalHoldUpdateComponent, LegalHoldDeleteDialogComponent],
})
export class LegalHoldModule {}
