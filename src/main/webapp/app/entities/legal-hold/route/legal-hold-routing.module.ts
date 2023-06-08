import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LegalHoldComponent } from '../list/legal-hold.component';
import { LegalHoldDetailComponent } from '../detail/legal-hold-detail.component';
import { LegalHoldUpdateComponent } from '../update/legal-hold-update.component';
import { LegalHoldRoutingResolveService } from './legal-hold-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const legalHoldRoute: Routes = [
  {
    path: '',
    component: LegalHoldComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LegalHoldDetailComponent,
    resolve: {
      legalHold: LegalHoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LegalHoldUpdateComponent,
    resolve: {
      legalHold: LegalHoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LegalHoldUpdateComponent,
    resolve: {
      legalHold: LegalHoldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(legalHoldRoute)],
  exports: [RouterModule],
})
export class LegalHoldRoutingModule {}
