import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoteEntryXVoteOptionComponent } from '../list/vote-entry-x-vote-option.component';
import { VoteEntryXVoteOptionDetailComponent } from '../detail/vote-entry-x-vote-option-detail.component';
import { VoteEntryXVoteOptionUpdateComponent } from '../update/vote-entry-x-vote-option-update.component';
import { VoteEntryXVoteOptionRoutingResolveService } from './vote-entry-x-vote-option-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voteEntryXVoteOptionRoute: Routes = [
  {
    path: '',
    component: VoteEntryXVoteOptionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoteEntryXVoteOptionDetailComponent,
    resolve: {
      voteEntryXVoteOption: VoteEntryXVoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoteEntryXVoteOptionUpdateComponent,
    resolve: {
      voteEntryXVoteOption: VoteEntryXVoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoteEntryXVoteOptionUpdateComponent,
    resolve: {
      voteEntryXVoteOption: VoteEntryXVoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voteEntryXVoteOptionRoute)],
  exports: [RouterModule],
})
export class VoteEntryXVoteOptionRoutingModule {}
