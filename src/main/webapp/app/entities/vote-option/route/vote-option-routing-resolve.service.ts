import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoteOption } from '../vote-option.model';
import { VoteOptionService } from '../service/vote-option.service';

@Injectable({ providedIn: 'root' })
export class VoteOptionRoutingResolveService implements Resolve<IVoteOption | null> {
  constructor(protected service: VoteOptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoteOption | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voteOption: HttpResponse<IVoteOption>) => {
          if (voteOption.body) {
            return of(voteOption.body);
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
