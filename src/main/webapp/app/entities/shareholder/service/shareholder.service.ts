import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShareholder, NewShareholder } from '../shareholder.model';

export type PartialUpdateShareholder = Partial<IShareholder> & Pick<IShareholder, 'id'>;

export type EntityResponseType = HttpResponse<IShareholder>;
export type EntityArrayResponseType = HttpResponse<IShareholder[]>;

@Injectable({ providedIn: 'root' })
export class ShareholderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shareholders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shareholder: NewShareholder): Observable<EntityResponseType> {
    return this.http.post<IShareholder>(this.resourceUrl, shareholder, { observe: 'response' });
  }

  update(shareholder: IShareholder): Observable<EntityResponseType> {
    return this.http.put<IShareholder>(`${this.resourceUrl}/${this.getShareholderIdentifier(shareholder)}`, shareholder, {
      observe: 'response',
    });
  }

  partialUpdate(shareholder: PartialUpdateShareholder): Observable<EntityResponseType> {
    return this.http.patch<IShareholder>(`${this.resourceUrl}/${this.getShareholderIdentifier(shareholder)}`, shareholder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShareholder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShareholder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShareholderIdentifier(shareholder: Pick<IShareholder, 'id'>): number {
    return shareholder.id;
  }

  compareShareholder(o1: Pick<IShareholder, 'id'> | null, o2: Pick<IShareholder, 'id'> | null): boolean {
    return o1 && o2 ? this.getShareholderIdentifier(o1) === this.getShareholderIdentifier(o2) : o1 === o2;
  }

  addShareholderToCollectionIfMissing<Type extends Pick<IShareholder, 'id'>>(
    shareholderCollection: Type[],
    ...shareholdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shareholders: Type[] = shareholdersToCheck.filter(isPresent);
    if (shareholders.length > 0) {
      const shareholderCollectionIdentifiers = shareholderCollection.map(
        shareholderItem => this.getShareholderIdentifier(shareholderItem)!
      );
      const shareholdersToAdd = shareholders.filter(shareholderItem => {
        const shareholderIdentifier = this.getShareholderIdentifier(shareholderItem);
        if (shareholderCollectionIdentifiers.includes(shareholderIdentifier)) {
          return false;
        }
        shareholderCollectionIdentifiers.push(shareholderIdentifier);
        return true;
      });
      return [...shareholdersToAdd, ...shareholderCollection];
    }
    return shareholderCollection;
  }
}
