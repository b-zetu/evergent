import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShareholderXGroup } from '../shareholder-x-group.model';
import { ShareholderXGroupService } from '../service/shareholder-x-group.service';

@Injectable({ providedIn: 'root' })
export class ShareholderXGroupRoutingResolveService implements Resolve<IShareholderXGroup | null> {
  constructor(protected service: ShareholderXGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShareholderXGroup | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shareholderXGroup: HttpResponse<IShareholderXGroup>) => {
          if (shareholderXGroup.body) {
            return of(shareholderXGroup.body);
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
