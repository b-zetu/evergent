import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShareholderXGroupComponent } from '../list/shareholder-x-group.component';
import { ShareholderXGroupDetailComponent } from '../detail/shareholder-x-group-detail.component';
import { ShareholderXGroupUpdateComponent } from '../update/shareholder-x-group-update.component';
import { ShareholderXGroupRoutingResolveService } from './shareholder-x-group-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const shareholderXGroupRoute: Routes = [
  {
    path: '',
    component: ShareholderXGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShareholderXGroupDetailComponent,
    resolve: {
      shareholderXGroup: ShareholderXGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShareholderXGroupUpdateComponent,
    resolve: {
      shareholderXGroup: ShareholderXGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShareholderXGroupUpdateComponent,
    resolve: {
      shareholderXGroup: ShareholderXGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shareholderXGroupRoute)],
  exports: [RouterModule],
})
export class ShareholderXGroupRoutingModule {}
