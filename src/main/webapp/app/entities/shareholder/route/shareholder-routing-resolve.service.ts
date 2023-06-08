import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShareholder } from '../shareholder.model';
import { ShareholderService } from '../service/shareholder.service';

@Injectable({ providedIn: 'root' })
export class ShareholderRoutingResolveService implements Resolve<IShareholder | null> {
  constructor(protected service: ShareholderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShareholder | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shareholder: HttpResponse<IShareholder>) => {
          if (shareholder.body) {
            return of(shareholder.body);
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
