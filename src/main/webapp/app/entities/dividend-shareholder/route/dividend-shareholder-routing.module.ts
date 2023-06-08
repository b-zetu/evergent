import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DividendShareholderComponent } from '../list/dividend-shareholder.component';
import { DividendShareholderDetailComponent } from '../detail/dividend-shareholder-detail.component';
import { DividendShareholderUpdateComponent } from '../update/dividend-shareholder-update.component';
import { DividendShareholderRoutingResolveService } from './dividend-shareholder-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dividendShareholderRoute: Routes = [
  {
    path: '',
    component: DividendShareholderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DividendShareholderDetailComponent,
    resolve: {
      dividendShareholder: DividendShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DividendShareholderUpdateComponent,
    resolve: {
      dividendShareholder: DividendShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DividendShareholderUpdateComponent,
    resolve: {
      dividendShareholder: DividendShareholderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dividendShareholderRoute)],
  exports: [RouterModule],
})
export class DividendShareholderRoutingModule {}
