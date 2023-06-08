import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShareholderXInheritanceComponent } from '../list/shareholder-x-inheritance.component';
import { ShareholderXInheritanceDetailComponent } from '../detail/shareholder-x-inheritance-detail.component';
import { ShareholderXInheritanceUpdateComponent } from '../update/shareholder-x-inheritance-update.component';
import { ShareholderXInheritanceRoutingResolveService } from './shareholder-x-inheritance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const shareholderXInheritanceRoute: Routes = [
  {
    path: '',
    component: ShareholderXInheritanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShareholderXInheritanceDetailComponent,
    resolve: {
      shareholderXInheritance: ShareholderXInheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShareholderXInheritanceUpdateComponent,
    resolve: {
      shareholderXInheritance: ShareholderXInheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShareholderXInheritanceUpdateComponent,
    resolve: {
      shareholderXInheritance: ShareholderXInheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shareholderXInheritanceRoute)],
  exports: [RouterModule],
})
export class ShareholderXInheritanceRoutingModule {}
