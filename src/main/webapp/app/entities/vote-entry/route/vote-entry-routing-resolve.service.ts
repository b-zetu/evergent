import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoteEntry } from '../vote-entry.model';
import { VoteEntryService } from '../service/vote-entry.service';

@Injectable({ providedIn: 'root' })
export class VoteEntryRoutingResolveService implements Resolve<IVoteEntry | null> {
  constructor(protected service: VoteEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoteEntry | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voteEntry: HttpResponse<IVoteEntry>) => {
          if (voteEntry.body) {
            return of(voteEntry.body);
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
