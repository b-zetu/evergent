import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShareholderXGroupComponent } from './list/shareholder-x-group.component';
import { ShareholderXGroupDetailComponent } from './detail/shareholder-x-group-detail.component';
import { ShareholderXGroupUpdateComponent } from './update/shareholder-x-group-update.component';
import { ShareholderXGroupDeleteDialogComponent } from './delete/shareholder-x-group-delete-dialog.component';
import { ShareholderXGroupRoutingModule } from './route/shareholder-x-group-routing.module';

@NgModule({
  imports: [SharedModule, ShareholderXGroupRoutingModule],
  declarations: [
    ShareholderXGroupComponent,
    ShareholderXGroupDetailComponent,
    ShareholderXGroupUpdateComponent,
    ShareholderXGroupDeleteDialogComponent,
  ],
})
export class ShareholderXGroupModule {}
