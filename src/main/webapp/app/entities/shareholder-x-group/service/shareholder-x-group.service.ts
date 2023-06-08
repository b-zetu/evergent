import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShareholderXGroup, NewShareholderXGroup } from '../shareholder-x-group.model';

export type PartialUpdateShareholderXGroup = Partial<IShareholderXGroup> & Pick<IShareholderXGroup, 'id'>;

export type EntityResponseType = HttpResponse<IShareholderXGroup>;
export type EntityArrayResponseType = HttpResponse<IShareholderXGroup[]>;

@Injectable({ providedIn: 'root' })
export class ShareholderXGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shareholder-x-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shareholderXGroup: NewShareholderXGroup): Observable<EntityResponseType> {
    return this.http.post<IShareholderXGroup>(this.resourceUrl, shareholderXGroup, { observe: 'response' });
  }

  update(shareholderXGroup: IShareholderXGroup): Observable<EntityResponseType> {
    return this.http.put<IShareholderXGroup>(
      `${this.resourceUrl}/${this.getShareholderXGroupIdentifier(shareholderXGroup)}`,
      shareholderXGroup,
      { observe: 'response' }
    );
  }

  partialUpdate(shareholderXGroup: PartialUpdateShareholderXGroup): Observable<EntityResponseType> {
    return this.http.patch<IShareholderXGroup>(
      `${this.resourceUrl}/${this.getShareholderXGroupIdentifier(shareholderXGroup)}`,
      shareholderXGroup,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShareholderXGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShareholderXGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShareholderXGroupIdentifier(shareholderXGroup: Pick<IShareholderXGroup, 'id'>): number {
    return shareholderXGroup.id;
  }

  compareShareholderXGroup(o1: Pick<IShareholderXGroup, 'id'> | null, o2: Pick<IShareholderXGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getShareholderXGroupIdentifier(o1) === this.getShareholderXGroupIdentifier(o2) : o1 === o2;
  }

  addShareholderXGroupToCollectionIfMissing<Type extends Pick<IShareholderXGroup, 'id'>>(
    shareholderXGroupCollection: Type[],
    ...shareholderXGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shareholderXGroups: Type[] = shareholderXGroupsToCheck.filter(isPresent);
    if (shareholderXGroups.length > 0) {
      const shareholderXGroupCollectionIdentifiers = shareholderXGroupCollection.map(
        shareholderXGroupItem => this.getShareholderXGroupIdentifier(shareholderXGroupItem)!
      );
      const shareholderXGroupsToAdd = shareholderXGroups.filter(shareholderXGroupItem => {
        const shareholderXGroupIdentifier = this.getShareholderXGroupIdentifier(shareholderXGroupItem);
        if (shareholderXGroupCollectionIdentifiers.includes(shareholderXGroupIdentifier)) {
          return false;
        }
        shareholderXGroupCollectionIdentifiers.push(shareholderXGroupIdentifier);
        return true;
      });
      return [...shareholderXGroupsToAdd, ...shareholderXGroupCollection];
    }
    return shareholderXGroupCollection;
  }
}
