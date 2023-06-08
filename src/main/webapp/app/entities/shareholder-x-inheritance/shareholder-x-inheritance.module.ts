import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShareholderXInheritanceComponent } from './list/shareholder-x-inheritance.component';
import { ShareholderXInheritanceDetailComponent } from './detail/shareholder-x-inheritance-detail.component';
import { ShareholderXInheritanceUpdateComponent } from './update/shareholder-x-inheritance-update.component';
import { ShareholderXInheritanceDeleteDialogComponent } from './delete/shareholder-x-inheritance-delete-dialog.component';
import { ShareholderXInheritanceRoutingModule } from './route/shareholder-x-inheritance-routing.module';

@NgModule({
  imports: [SharedModule, ShareholderXInheritanceRoutingModule],
  declarations: [
    ShareholderXInheritanceComponent,
    ShareholderXInheritanceDetailComponent,
    ShareholderXInheritanceUpdateComponent,
    ShareholderXInheritanceDeleteDialogComponent,
  ],
})
export class ShareholderXInheritanceModule {}
