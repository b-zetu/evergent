import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoteOptionComponent } from '../list/vote-option.component';
import { VoteOptionDetailComponent } from '../detail/vote-option-detail.component';
import { VoteOptionUpdateComponent } from '../update/vote-option-update.component';
import { VoteOptionRoutingResolveService } from './vote-option-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voteOptionRoute: Routes = [
  {
    path: '',
    component: VoteOptionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoteOptionDetailComponent,
    resolve: {
      voteOption: VoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoteOptionUpdateComponent,
    resolve: {
      voteOption: VoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoteOptionUpdateComponent,
    resolve: {
      voteOption: VoteOptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voteOptionRoute)],
  exports: [RouterModule],
})
export class VoteOptionRoutingModule {}
