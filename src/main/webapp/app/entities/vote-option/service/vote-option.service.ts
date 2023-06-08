import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoteOption, NewVoteOption } from '../vote-option.model';

export type PartialUpdateVoteOption = Partial<IVoteOption> & Pick<IVoteOption, 'id'>;

export type EntityResponseType = HttpResponse<IVoteOption>;
export type EntityArrayResponseType = HttpResponse<IVoteOption[]>;

@Injectable({ providedIn: 'root' })
export class VoteOptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vote-options');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voteOption: NewVoteOption): Observable<EntityResponseType> {
    return this.http.post<IVoteOption>(this.resourceUrl, voteOption, { observe: 'response' });
  }

  update(voteOption: IVoteOption): Observable<EntityResponseType> {
    return this.http.put<IVoteOption>(`${this.resourceUrl}/${this.getVoteOptionIdentifier(voteOption)}`, voteOption, {
      observe: 'response',
    });
  }

  partialUpdate(voteOption: PartialUpdateVoteOption): Observable<EntityResponseType> {
    return this.http.patch<IVoteOption>(`${this.resourceUrl}/${this.getVoteOptionIdentifier(voteOption)}`, voteOption, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVoteOption>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVoteOption[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoteOptionIdentifier(voteOption: Pick<IVoteOption, 'id'>): number {
    return voteOption.id;
  }

  compareVoteOption(o1: Pick<IVoteOption, 'id'> | null, o2: Pick<IVoteOption, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoteOptionIdentifier(o1) === this.getVoteOptionIdentifier(o2) : o1 === o2;
  }

  addVoteOptionToCollectionIfMissing<Type extends Pick<IVoteOption, 'id'>>(
    voteOptionCollection: Type[],
    ...voteOptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voteOptions: Type[] = voteOptionsToCheck.filter(isPresent);
    if (voteOptions.length > 0) {
      const voteOptionCollectionIdentifiers = voteOptionCollection.map(voteOptionItem => this.getVoteOptionIdentifier(voteOptionItem)!);
      const voteOptionsToAdd = voteOptions.filter(voteOptionItem => {
        const voteOptionIdentifier = this.getVoteOptionIdentifier(voteOptionItem);
        if (voteOptionCollectionIdentifiers.includes(voteOptionIdentifier)) {
          return false;
        }
        voteOptionCollectionIdentifiers.push(voteOptionIdentifier);
        return true;
      });
      return [...voteOptionsToAdd, ...voteOptionCollection];
    }
    return voteOptionCollection;
  }
}
