import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISysParameter } from '../sys-parameter.model';
import { SysParameterService } from '../service/sys-parameter.service';

@Injectable({ providedIn: 'root' })
export class SysParameterRoutingResolveService implements Resolve<ISysParameter | null> {
  constructor(protected service: SysParameterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISysParameter | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sysParameter: HttpResponse<ISysParameter>) => {
          if (sysParameter.body) {
            return of(sysParameter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
