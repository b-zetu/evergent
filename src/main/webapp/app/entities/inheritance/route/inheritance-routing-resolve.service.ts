import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInheritance } from '../inheritance.model';
import { InheritanceService } from '../service/inheritance.service';

@Injectable({ providedIn: 'root' })
export class InheritanceRoutingResolveService implements Resolve<IInheritance | null> {
  constructor(protected service: InheritanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInheritance | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((inheritance: HttpResponse<IInheritance>) => {
          if (inheritance.body) {
            return of(inheritance.body);
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
