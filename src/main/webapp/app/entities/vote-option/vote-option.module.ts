import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VoteOptionComponent } from './list/vote-option.component';
import { VoteOptionDetailComponent } from './detail/vote-option-detail.component';
import { VoteOptionUpdateComponent } from './update/vote-option-update.component';
import { VoteOptionDeleteDialogComponent } from './delete/vote-option-delete-dialog.component';
import { VoteOptionRoutingModule } from './route/vote-option-routing.module';

@NgModule({
  imports: [SharedModule, VoteOptionRoutingModule],
  declarations: [VoteOptionComponent, VoteOptionDetailComponent, VoteOptionUpdateComponent, VoteOptionDeleteDialogComponent],
})
export class VoteOptionModule {}
