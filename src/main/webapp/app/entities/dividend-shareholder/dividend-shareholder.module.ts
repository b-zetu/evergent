import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DividendShareholderComponent } from './list/dividend-shareholder.component';
import { DividendShareholderDetailComponent } from './detail/dividend-shareholder-detail.component';
import { DividendShareholderUpdateComponent } from './update/dividend-shareholder-update.component';
import { DividendShareholderDeleteDialogComponent } from './delete/dividend-shareholder-delete-dialog.component';
import { DividendShareholderRoutingModule } from './route/dividend-shareholder-routing.module';

@NgModule({
  imports: [SharedModule, DividendShareholderRoutingModule],
  declarations: [
    DividendShareholderComponent,
    DividendShareholderDetailComponent,
    DividendShareholderUpdateComponent,
    DividendShareholderDeleteDialogComponent,
  ],
})
export class DividendShareholderModule {}
