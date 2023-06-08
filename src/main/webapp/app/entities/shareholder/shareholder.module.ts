import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShareholderComponent } from './list/shareholder.component';
import { ShareholderDetailComponent } from './detail/shareholder-detail.component';
import { ShareholderUpdateComponent } from './update/shareholder-update.component';
import { ShareholderDeleteDialogComponent } from './delete/shareholder-delete-dialog.component';
import { ShareholderRoutingModule } from './route/shareholder-routing.module';

@NgModule({
  imports: [SharedModule, ShareholderRoutingModule],
  declarations: [ShareholderComponent, ShareholderDetailComponent, ShareholderUpdateComponent, ShareholderDeleteDialogComponent],
})
export class ShareholderModule {}
