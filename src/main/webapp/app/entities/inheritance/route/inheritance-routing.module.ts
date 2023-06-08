import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InheritanceComponent } from '../list/inheritance.component';
import { InheritanceDetailComponent } from '../detail/inheritance-detail.component';
import { InheritanceUpdateComponent } from '../update/inheritance-update.component';
import { InheritanceRoutingResolveService } from './inheritance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const inheritanceRoute: Routes = [
  {
    path: '',
    component: InheritanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InheritanceDetailComponent,
    resolve: {
      inheritance: InheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InheritanceUpdateComponent,
    resolve: {
      inheritance: InheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InheritanceUpdateComponent,
    resolve: {
      inheritance: InheritanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inheritanceRoute)],
  exports: [RouterModule],
})
export class InheritanceRoutingModule {}
