import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DividendRegisterComponent } from './list/dividend-register.component';
import { DividendRegisterDetailComponent } from './detail/dividend-register-detail.component';
import { DividendRegisterUpdateComponent } from './update/dividend-register-update.component';
import { DividendRegisterDeleteDialogComponent } from './delete/dividend-register-delete-dialog.component';
import { DividendRegisterRoutingModule } from './route/dividend-register-routing.module';

@NgModule({
  imports: [SharedModule, DividendRegisterRoutingModule],
  declarations: [
    DividendRegisterComponent,
    DividendRegisterDetailComponent,
    DividendRegisterUpdateComponent,
    DividendRegisterDeleteDialogComponent,
  ],
})
export class DividendRegisterModule {}
