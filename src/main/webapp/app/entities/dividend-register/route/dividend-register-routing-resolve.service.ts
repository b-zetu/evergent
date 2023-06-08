import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDividendRegister } from '../dividend-register.model';
import { DividendRegisterService } from '../service/dividend-register.service';

@Injectable({ providedIn: 'root' })
export class DividendRegisterRoutingResolveService implements Resolve<IDividendRegister | null> {
  constructor(protected service: DividendRegisterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDividendRegister | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dividendRegister: HttpResponse<IDividendRegister>) => {
          if (dividendRegister.body) {
            return of(dividendRegister.body);
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
