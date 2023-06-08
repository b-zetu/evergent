import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';
import { ShareholderXInheritanceService } from '../service/shareholder-x-inheritance.service';

@Injectable({ providedIn: 'root' })
export class ShareholderXInheritanceRoutingResolveService implements Resolve<IShareholderXInheritance | null> {
  constructor(protected service: ShareholderXInheritanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShareholderXInheritance | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shareholderXInheritance: HttpResponse<IShareholderXInheritance>) => {
          if (shareholderXInheritance.body) {
            return of(shareholderXInheritance.body);
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
