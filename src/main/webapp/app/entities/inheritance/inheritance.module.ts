import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InheritanceComponent } from './list/inheritance.component';
import { InheritanceDetailComponent } from './detail/inheritance-detail.component';
import { InheritanceUpdateComponent } from './update/inheritance-update.component';
import { InheritanceDeleteDialogComponent } from './delete/inheritance-delete-dialog.component';
import { InheritanceRoutingModule } from './route/inheritance-routing.module';

@NgModule({
  imports: [SharedModule, InheritanceRoutingModule],
  declarations: [InheritanceComponent, InheritanceDetailComponent, InheritanceUpdateComponent, InheritanceDeleteDialogComponent],
})
export class InheritanceModule {}
