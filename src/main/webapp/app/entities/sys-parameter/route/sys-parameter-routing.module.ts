import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SysParameterComponent } from '../list/sys-parameter.component';
import { SysParameterDetailComponent } from '../detail/sys-parameter-detail.component';
import { SysParameterUpdateComponent } from '../update/sys-parameter-update.component';
import { SysParameterRoutingResolveService } from './sys-parameter-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sysParameterRoute: Routes = [
  {
    path: '',
    component: SysParameterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SysParameterDetailComponent,
    resolve: {
      sysParameter: SysParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SysParameterUpdateComponent,
    resolve: {
      sysParameter: SysParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SysParameterUpdateComponent,
    resolve: {
      sysParameter: SysParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sysParameterRoute)],
  exports: [RouterModule],
})
export class SysParameterRoutingModule {}
