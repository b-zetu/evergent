import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDividendShareholder } from '../dividend-shareholder.model';
import { DividendShareholderService } from '../service/dividend-shareholder.service';

@Injectable({ providedIn: 'root' })
export class DividendShareholderRoutingResolveService implements Resolve<IDividendShareholder | null> {
  constructor(protected service: DividendShareholderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDividendShareholder | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dividendShareholder: HttpResponse<IDividendShareholder>) => {
          if (dividendShareholder.body) {
            return of(dividendShareholder.body);
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
