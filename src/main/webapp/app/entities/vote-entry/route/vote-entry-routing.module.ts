import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoteEntryComponent } from '../list/vote-entry.component';
import { VoteEntryDetailComponent } from '../detail/vote-entry-detail.component';
import { VoteEntryUpdateComponent } from '../update/vote-entry-update.component';
import { VoteEntryRoutingResolveService } from './vote-entry-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voteEntryRoute: Routes = [
  {
    path: '',
    component: VoteEntryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoteEntryDetailComponent,
    resolve: {
      voteEntry: VoteEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoteEntryUpdateComponent,
    resolve: {
      voteEntry: VoteEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoteEntryUpdateComponent,
    resolve: {
      voteEntry: VoteEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voteEntryRoute)],
  exports: [RouterModule],
})
export class VoteEntryRoutingModule {}
