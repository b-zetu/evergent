import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoteEntryXVoteOption, NewVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';

export type PartialUpdateVoteEntryXVoteOption = Partial<IVoteEntryXVoteOption> & Pick<IVoteEntryXVoteOption, 'id'>;

export type EntityResponseType = HttpResponse<IVoteEntryXVoteOption>;
export type EntityArrayResponseType = HttpResponse<IVoteEntryXVoteOption[]>;

@Injectable({ providedIn: 'root' })
export class VoteEntryXVoteOptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vote-entry-x-vote-options');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voteEntryXVoteOption: NewVoteEntryXVoteOption): Observable<EntityResponseType> {
    return this.http.post<IVoteEntryXVoteOption>(this.resourceUrl, voteEntryXVoteOption, { observe: 'response' });
  }

  update(voteEntryXVoteOption: IVoteEntryXVoteOption): Observable<EntityResponseType> {
    return this.http.put<IVoteEntryXVoteOption>(
      `${this.resourceUrl}/${this.getVoteEntryXVoteOptionIdentifier(voteEntryXVoteOption)}`,
      voteEntryXVoteOption,
      { observe: 'response' }
    );
  }

  partialUpdate(voteEntryXVoteOption: PartialUpdateVoteEntryXVoteOption): Observable<EntityResponseType> {
    return this.http.patch<IVoteEntryXVoteOption>(
      `${this.resourceUrl}/${this.getVoteEntryXVoteOptionIdentifier(voteEntryXVoteOption)}`,
      voteEntryXVoteOption,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVoteEntryXVoteOption>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVoteEntryXVoteOption[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoteEntryXVoteOptionIdentifier(voteEntryXVoteOption: Pick<IVoteEntryXVoteOption, 'id'>): number {
    return voteEntryXVoteOption.id;
  }

  compareVoteEntryXVoteOption(o1: Pick<IVoteEntryXVoteOption, 'id'> | null, o2: Pick<IVoteEntryXVoteOption, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoteEntryXVoteOptionIdentifier(o1) === this.getVoteEntryXVoteOptionIdentifier(o2) : o1 === o2;
  }

  addVoteEntryXVoteOptionToCollectionIfMissing<Type extends Pick<IVoteEntryXVoteOption, 'id'>>(
    voteEntryXVoteOptionCollection: Type[],
    ...voteEntryXVoteOptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voteEntryXVoteOptions: Type[] = voteEntryXVoteOptionsToCheck.filter(isPresent);
    if (voteEntryXVoteOptions.length > 0) {
      const voteEntryXVoteOptionCollectionIdentifiers = voteEntryXVoteOptionCollection.map(
        voteEntryXVoteOptionItem => this.getVoteEntryXVoteOptionIdentifier(voteEntryXVoteOptionItem)!
      );
      const voteEntryXVoteOptionsToAdd = voteEntryXVoteOptions.filter(voteEntryXVoteOptionItem => {
        const voteEntryXVoteOptionIdentifier = this.getVoteEntryXVoteOptionIdentifier(voteEntryXVoteOptionItem);
        if (voteEntryXVoteOptionCollectionIdentifiers.includes(voteEntryXVoteOptionIdentifier)) {
          return false;
        }
        voteEntryXVoteOptionCollectionIdentifiers.push(voteEntryXVoteOptionIdentifier);
        return true;
      });
      return [...voteEntryXVoteOptionsToAdd, ...voteEntryXVoteOptionCollection];
    }
    return voteEntryXVoteOptionCollection;
  }
}
