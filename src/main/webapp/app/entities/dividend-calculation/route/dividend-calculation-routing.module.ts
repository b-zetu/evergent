import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DividendCalculationComponent } from '../list/dividend-calculation.component';
import { DividendCalculationDetailComponent } from '../detail/dividend-calculation-detail.component';
import { DividendCalculationUpdateComponent } from '../update/dividend-calculation-update.component';
import { DividendCalculationRoutingResolveService } from './dividend-calculation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dividendCalculationRoute: Routes = [
  {
    path: '',
    component: DividendCalculationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DividendCalculationDetailComponent,
    resolve: {
      dividendCalculation: DividendCalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DividendCalculationUpdateComponent,
    resolve: {
      dividendCalculation: DividendCalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DividendCalculationUpdateComponent,
    resolve: {
      dividendCalculation: DividendCalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dividendCalculationRoute)],
  exports: [RouterModule],
})
export class DividendCalculationRoutingModule {}
