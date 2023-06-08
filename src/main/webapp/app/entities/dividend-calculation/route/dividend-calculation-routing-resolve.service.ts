import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDividendCalculation } from '../dividend-calculation.model';
import { DividendCalculationService } from '../service/dividend-calculation.service';

@Injectable({ providedIn: 'root' })
export class DividendCalculationRoutingResolveService implements Resolve<IDividendCalculation | null> {
  constructor(protected service: DividendCalculationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDividendCalculation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dividendCalculation: HttpResponse<IDividendCalculation>) => {
          if (dividendCalculation.body) {
            return of(dividendCalculation.body);
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
