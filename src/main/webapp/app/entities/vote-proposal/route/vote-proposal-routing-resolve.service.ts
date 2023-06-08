import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoteProposal } from '../vote-proposal.model';
import { VoteProposalService } from '../service/vote-proposal.service';

@Injectable({ providedIn: 'root' })
export class VoteProposalRoutingResolveService implements Resolve<IVoteProposal | null> {
  constructor(protected service: VoteProposalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoteProposal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voteProposal: HttpResponse<IVoteProposal>) => {
          if (voteProposal.body) {
            return of(voteProposal.body);
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
