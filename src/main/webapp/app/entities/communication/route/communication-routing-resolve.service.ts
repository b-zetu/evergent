import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommunication } from '../communication.model';
import { CommunicationService } from '../service/communication.service';

@Injectable({ providedIn: 'root' })
export class CommunicationRoutingResolveService implements Resolve<ICommunication | null> {
  constructor(protected service: CommunicationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommunication | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((communication: HttpResponse<ICommunication>) => {
          if (communication.body) {
            return of(communication.body);
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