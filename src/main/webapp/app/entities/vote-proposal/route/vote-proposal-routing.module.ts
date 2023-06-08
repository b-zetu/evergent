import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoteProposalComponent } from '../list/vote-proposal.component';
import { VoteProposalDetailComponent } from '../detail/vote-proposal-detail.component';
import { VoteProposalUpdateComponent } from '../update/vote-proposal-update.component';
import { VoteProposalRoutingResolveService } from './vote-proposal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voteProposalRoute: Routes = [
  {
    path: '',
    component: VoteProposalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoteProposalDetailComponent,
    resolve: {
      voteProposal: VoteProposalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoteProposalUpdateComponent,
    resolve: {
      voteProposal: VoteProposalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoteProposalUpdateComponent,
    resolve: {
      voteProposal: VoteProposalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voteProposalRoute)],
  exports: [RouterModule],
})
export class VoteProposalRoutingModule {}
