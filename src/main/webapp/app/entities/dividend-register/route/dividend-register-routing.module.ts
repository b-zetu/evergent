import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DividendRegisterComponent } from '../list/dividend-register.component';
import { DividendRegisterDetailComponent } from '../detail/dividend-register-detail.component';
import { DividendRegisterUpdateComponent } from '../update/dividend-register-update.component';
import { DividendRegisterRoutingResolveService } from './dividend-register-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dividendRegisterRoute: Routes = [
  {
    path: '',
    component: DividendRegisterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DividendRegisterDetailComponent,
    resolve: {
      dividendRegister: DividendRegisterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DividendRegisterUpdateComponent,
    resolve: {
      dividendRegister: DividendRegisterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DividendRegisterUpdateComponent,
    resolve: {
      dividendRegister: DividendRegisterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dividendRegisterRoute)],
  exports: [RouterModule],
})
export class DividendRegisterRoutingModule {}
