import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoteEntry, NewVoteEntry } from '../vote-entry.model';

export type PartialUpdateVoteEntry = Partial<IVoteEntry> & Pick<IVoteEntry, 'id'>;

export type EntityResponseType = HttpResponse<IVoteEntry>;
export type EntityArrayResponseType = HttpResponse<IVoteEntry[]>;

@Injectable({ providedIn: 'root' })
export class VoteEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vote-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voteEntry: NewVoteEntry): Observable<EntityResponseType> {
    return this.http.post<IVoteEntry>(this.resourceUrl, voteEntry, { observe: 'response' });
  }

  update(voteEntry: IVoteEntry): Observable<EntityResponseType> {
    return this.http.put<IVoteEntry>(`${this.resourceUrl}/${this.getVoteEntryIdentifier(voteEntry)}`, voteEntry, { observe: 'response' });
  }

  partialUpdate(voteEntry: PartialUpdateVoteEntry): Observable<EntityResponseType> {
    return this.http.patch<IVoteEntry>(`${this.resourceUrl}/${this.getVoteEntryIdentifier(voteEntry)}`, voteEntry, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVoteEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVoteEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoteEntryIdentifier(voteEntry: Pick<IVoteEntry, 'id'>): number {
    return voteEntry.id;
  }

  compareVoteEntry(o1: Pick<IVoteEntry, 'id'> | null, o2: Pick<IVoteEntry, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoteEntryIdentifier(o1) === this.getVoteEntryIdentifier(o2) : o1 === o2;
  }

  addVoteEntryToCollectionIfMissing<Type extends Pick<IVoteEntry, 'id'>>(
    voteEntryCollection: Type[],
    ...voteEntriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voteEntries: Type[] = voteEntriesToCheck.filter(isPresent);
    if (voteEntries.length > 0) {
      const voteEntryCollectionIdentifiers = voteEntryCollection.map(voteEntryItem => this.getVoteEntryIdentifier(voteEntryItem)!);
      const voteEntriesToAdd = voteEntries.filter(voteEntryItem => {
        const voteEntryIdentifier = this.getVoteEntryIdentifier(voteEntryItem);
        if (voteEntryCollectionIdentifiers.includes(voteEntryIdentifier)) {
          return false;
        }
        voteEntryCollectionIdentifiers.push(voteEntryIdentifier);
        return true;
      });
      return [...voteEntriesToAdd, ...voteEntryCollection];
    }
    return voteEntryCollection;
  }
}
