import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShareholderComponent } from '../list/shareholder.component';
import { ShareholderDetailComponent } from '../detail/shareholder-detail.component';
import { ShareholderUpdateComponent } from '../update/shareholder-update.component';
import { ShareholderRoutingResolveService } from './shareholder-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const shareholderRoute: Routes = [
  {
    path: '',
    component: ShareholderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShareholderDetailComponent,
    resolve: {
      shareholder: ShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShareholderUpdateComponent,
    resolve: {
      shareholder: ShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShareholderUpdateComponent,
    resolve: {
      shareholder: ShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shareholderRoute)],
  exports: [RouterModule],
})
export class ShareholderRoutingModule {}
