import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDividendShareholder, NewDividendShareholder } from '../dividend-shareholder.model';

export type PartialUpdateDividendShareholder = Partial<IDividendShareholder> & Pick<IDividendShareholder, 'id'>;

export type EntityResponseType = HttpResponse<IDividendShareholder>;
export type EntityArrayResponseType = HttpResponse<IDividendShareholder[]>;

@Injectable({ providedIn: 'root' })
export class DividendShareholderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dividend-shareholders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dividendShareholder: NewDividendShareholder): Observable<EntityResponseType> {
    return this.http.post<IDividendShareholder>(this.resourceUrl, dividendShareholder, { observe: 'response' });
  }

  update(dividendShareholder: IDividendShareholder): Observable<EntityResponseType> {
    return this.http.put<IDividendShareholder>(
      `${this.resourceUrl}/${this.getDividendShareholderIdentifier(dividendShareholder)}`,
      dividendShareholder,
      { observe: 'response' }
    );
  }

  partialUpdate(dividendShareholder: PartialUpdateDividendShareholder): Observable<EntityResponseType> {
    return this.http.patch<IDividendShareholder>(
      `${this.resourceUrl}/${this.getDividendShareholderIdentifier(dividendShareholder)}`,
      dividendShareholder,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDividendShareholder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDividendShareholder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDividendShareholderIdentifier(dividendShareholder: Pick<IDividendShareholder, 'id'>): number {
    return dividendShareholder.id;
  }

  compareDividendShareholder(o1: Pick<IDividendShareholder, 'id'> | null, o2: Pick<IDividendShareholder, 'id'> | null): boolean {
    return o1 && o2 ? this.getDividendShareholderIdentifier(o1) === this.getDividendShareholderIdentifier(o2) : o1 === o2;
  }

  addDividendShareholderToCollectionIfMissing<Type extends Pick<IDividendShareholder, 'id'>>(
    dividendShareholderCollection: Type[],
    ...dividendShareholdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dividendShareholders: Type[] = dividendShareholdersToCheck.filter(isPresent);
    if (dividendShareholders.length > 0) {
      const dividendShareholderCollectionIdentifiers = dividendShareholderCollection.map(
        dividendShareholderItem => this.getDividendShareholderIdentifier(dividendShareholderItem)!
      );
      const dividendShareholdersToAdd = dividendShareholders.filter(dividendShareholderItem => {
        const dividendShareholderIdentifier = this.getDividendShareholderIdentifier(dividendShareholderItem);
        if (dividendShareholderCollectionIdentifiers.includes(dividendShareholderIdentifier)) {
          return false;
        }
        dividendShareholderCollectionIdentifiers.push(dividendShareholderIdentifier);
        return true;
      });
      return [...dividendShareholdersToAdd, ...dividendShareholderCollection];
    }
    return dividendShareholderCollection;
  }
}
