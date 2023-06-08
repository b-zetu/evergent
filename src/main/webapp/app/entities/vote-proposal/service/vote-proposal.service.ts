import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoteProposal, NewVoteProposal } from '../vote-proposal.model';

export type PartialUpdateVoteProposal = Partial<IVoteProposal> & Pick<IVoteProposal, 'id'>;

type RestOf<T extends IVoteProposal | NewVoteProposal> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestVoteProposal = RestOf<IVoteProposal>;

export type NewRestVoteProposal = RestOf<NewVoteProposal>;

export type PartialUpdateRestVoteProposal = RestOf<PartialUpdateVoteProposal>;

export type EntityResponseType = HttpResponse<IVoteProposal>;
export type EntityArrayResponseType = HttpResponse<IVoteProposal[]>;

@Injectable({ providedIn: 'root' })
export class VoteProposalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vote-proposals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voteProposal: NewVoteProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voteProposal);
    return this.http
      .post<RestVoteProposal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(voteProposal: IVoteProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voteProposal);
    return this.http
      .put<RestVoteProposal>(`${this.resourceUrl}/${this.getVoteProposalIdentifier(voteProposal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(voteProposal: PartialUpdateVoteProposal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voteProposal);
    return this.http
      .patch<RestVoteProposal>(`${this.resourceUrl}/${this.getVoteProposalIdentifier(voteProposal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVoteProposal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVoteProposal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoteProposalIdentifier(voteProposal: Pick<IVoteProposal, 'id'>): number {
    return voteProposal.id;
  }

  compareVoteProposal(o1: Pick<IVoteProposal, 'id'> | null, o2: Pick<IVoteProposal, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoteProposalIdentifier(o1) === this.getVoteProposalIdentifier(o2) : o1 === o2;
  }

  addVoteProposalToCollectionIfMissing<Type extends Pick<IVoteProposal, 'id'>>(
    voteProposalCollection: Type[],
    ...voteProposalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voteProposals: Type[] = voteProposalsToCheck.filter(isPresent);
    if (voteProposals.length > 0) {
      const voteProposalCollectionIdentifiers = voteProposalCollection.map(
        voteProposalItem => this.getVoteProposalIdentifier(voteProposalItem)!
      );
      const voteProposalsToAdd = voteProposals.filter(voteProposalItem => {
        const voteProposalIdentifier = this.getVoteProposalIdentifier(voteProposalItem);
        if (voteProposalCollectionIdentifiers.includes(voteProposalIdentifier)) {
          return false;
        }
        voteProposalCollectionIdentifiers.push(voteProposalIdentifier);
        return true;
      });
      return [...voteProposalsToAdd, ...voteProposalCollection];
    }
    return voteProposalCollection;
  }

  protected convertDateFromClient<T extends IVoteProposal | NewVoteProposal | PartialUpdateVoteProposal>(voteProposal: T): RestOf<T> {
    return {
      ...voteProposal,
      startDate: voteProposal.startDate?.format(DATE_FORMAT) ?? null,
      endDate: voteProposal.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVoteProposal: RestVoteProposal): IVoteProposal {
    return {
      ...restVoteProposal,
      startDate: restVoteProposal.startDate ? dayjs(restVoteProposal.startDate) : undefined,
      endDate: restVoteProposal.endDate ? dayjs(restVoteProposal.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVoteProposal>): HttpResponse<IVoteProposal> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVoteProposal[]>): HttpResponse<IVoteProposal[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
