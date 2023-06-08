import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VoteProposalComponent } from './list/vote-proposal.component';
import { VoteProposalDetailComponent } from './detail/vote-proposal-detail.component';
import { VoteProposalUpdateComponent } from './update/vote-proposal-update.component';
import { VoteProposalDeleteDialogComponent } from './delete/vote-proposal-delete-dialog.component';
import { VoteProposalRoutingModule } from './route/vote-proposal-routing.module';

@NgModule({
  imports: [SharedModule, VoteProposalRoutingModule],
  declarations: [VoteProposalComponent, VoteProposalDetailComponent, VoteProposalUpdateComponent, VoteProposalDeleteDialogComponent],
})
export class VoteProposalModule {}
