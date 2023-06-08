import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import { VoteEntryXVoteOptionService } from '../service/vote-entry-x-vote-option.service';

@Injectable({ providedIn: 'root' })
export class VoteEntryXVoteOptionRoutingResolveService implements Resolve<IVoteEntryXVoteOption | null> {
  constructor(protected service: VoteEntryXVoteOptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoteEntryXVoteOption | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voteEntryXVoteOption: HttpResponse<IVoteEntryXVoteOption>) => {
          if (voteEntryXVoteOption.body) {
            return of(voteEntryXVoteOption.body);
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
