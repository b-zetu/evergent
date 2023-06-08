import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VoteEntryXVoteOptionComponent } from './list/vote-entry-x-vote-option.component';
import { VoteEntryXVoteOptionDetailComponent } from './detail/vote-entry-x-vote-option-detail.component';
import { VoteEntryXVoteOptionUpdateComponent } from './update/vote-entry-x-vote-option-update.component';
import { VoteEntryXVoteOptionDeleteDialogComponent } from './delete/vote-entry-x-vote-option-delete-dialog.component';
import { VoteEntryXVoteOptionRoutingModule } from './route/vote-entry-x-vote-option-routing.module';

@NgModule({
  imports: [SharedModule, VoteEntryXVoteOptionRoutingModule],
  declarations: [
    VoteEntryXVoteOptionComponent,
    VoteEntryXVoteOptionDetailComponent,
    VoteEntryXVoteOptionUpdateComponent,
    VoteEntryXVoteOptionDeleteDialogComponent,
  ],
})
export class VoteEntryXVoteOptionModule {}
