import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VoteEntryComponent } from './list/vote-entry.component';
import { VoteEntryDetailComponent } from './detail/vote-entry-detail.component';
import { VoteEntryUpdateComponent } from './update/vote-entry-update.component';
import { VoteEntryDeleteDialogComponent } from './delete/vote-entry-delete-dialog.component';
import { VoteEntryRoutingModule } from './route/vote-entry-routing.module';

@NgModule({
  imports: [SharedModule, VoteEntryRoutingModule],
  declarations: [VoteEntryComponent, VoteEntryDetailComponent, VoteEntryUpdateComponent, VoteEntryDeleteDialogComponent],
})
export class VoteEntryModule {}
