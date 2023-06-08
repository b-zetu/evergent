import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShareholderXInheritance, NewShareholderXInheritance } from '../shareholder-x-inheritance.model';

export type PartialUpdateShareholderXInheritance = Partial<IShareholderXInheritance> & Pick<IShareholderXInheritance, 'id'>;

export type EntityResponseType = HttpResponse<IShareholderXInheritance>;
export type EntityArrayResponseType = HttpResponse<IShareholderXInheritance[]>;

@Injectable({ providedIn: 'root' })
export class ShareholderXInheritanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shareholder-x-inheritances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shareholderXInheritance: NewShareholderXInheritance): Observable<EntityResponseType> {
    return this.http.post<IShareholderXInheritance>(this.resourceUrl, shareholderXInheritance, { observe: 'response' });
  }

  update(shareholderXInheritance: IShareholderXInheritance): Observable<EntityResponseType> {
    return this.http.put<IShareholderXInheritance>(
      `${this.resourceUrl}/${this.getShareholderXInheritanceIdentifier(shareholderXInheritance)}`,
      shareholderXInheritance,
      { observe: 'response' }
    );
  }

  partialUpdate(shareholderXInheritance: PartialUpdateShareholderXInheritance): Observable<EntityResponseType> {
    return this.http.patch<IShareholderXInheritance>(
      `${this.resourceUrl}/${this.getShareholderXInheritanceIdentifier(shareholderXInheritance)}`,
      shareholderXInheritance,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShareholderXInheritance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShareholderXInheritance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShareholderXInheritanceIdentifier(shareholderXInheritance: Pick<IShareholderXInheritance, 'id'>): number {
    return shareholderXInheritance.id;
  }

  compareShareholderXInheritance(
    o1: Pick<IShareholderXInheritance, 'id'> | null,
    o2: Pick<IShareholderXInheritance, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getShareholderXInheritanceIdentifier(o1) === this.getShareholderXInheritanceIdentifier(o2) : o1 === o2;
  }

  addShareholderXInheritanceToCollectionIfMissing<Type extends Pick<IShareholderXInheritance, 'id'>>(
    shareholderXInheritanceCollection: Type[],
    ...shareholderXInheritancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shareholderXInheritances: Type[] = shareholderXInheritancesToCheck.filter(isPresent);
    if (shareholderXInheritances.length > 0) {
      const shareholderXInheritanceCollectionIdentifiers = shareholderXInheritanceCollection.map(
        shareholderXInheritanceItem => this.getShareholderXInheritanceIdentifier(shareholderXInheritanceItem)!
      );
      const shareholderXInheritancesToAdd = shareholderXInheritances.filter(shareholderXInheritanceItem => {
        const shareholderXInheritanceIdentifier = this.getShareholderXInheritanceIdentifier(shareholderXInheritanceItem);
        if (shareholderXInheritanceCollectionIdentifiers.includes(shareholderXInheritanceIdentifier)) {
          return false;
        }
        shareholderXInheritanceCollectionIdentifiers.push(shareholderXInheritanceIdentifier);
        return true;
      });
      return [...shareholderXInheritancesToAdd, ...shareholderXInheritanceCollection];
    }
    return shareholderXInheritanceCollection;
  }
}
