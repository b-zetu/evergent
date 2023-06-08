import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDividendCalculation, NewDividendCalculation } from '../dividend-calculation.model';

export type PartialUpdateDividendCalculation = Partial<IDividendCalculation> & Pick<IDividendCalculation, 'id'>;

export type EntityResponseType = HttpResponse<IDividendCalculation>;
export type EntityArrayResponseType = HttpResponse<IDividendCalculation[]>;

@Injectable({ providedIn: 'root' })
export class DividendCalculationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dividend-calculations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dividendCalculation: NewDividendCalculation): Observable<EntityResponseType> {
    return this.http.post<IDividendCalculation>(this.resourceUrl, dividendCalculation, { observe: 'response' });
  }

  update(dividendCalculation: IDividendCalculation): Observable<EntityResponseType> {
    return this.http.put<IDividendCalculation>(
      `${this.resourceUrl}/${this.getDividendCalculationIdentifier(dividendCalculation)}`,
      dividendCalculation,
      { observe: 'response' }
    );
  }

  partialUpdate(dividendCalculation: PartialUpdateDividendCalculation): Observable<EntityResponseType> {
    return this.http.patch<IDividendCalculation>(
      `${this.resourceUrl}/${this.getDividendCalculationIdentifier(dividendCalculation)}`,
      dividendCalculation,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDividendCalculation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDividendCalculation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDividendCalculationIdentifier(dividendCalculation: Pick<IDividendCalculation, 'id'>): number {
    return dividendCalculation.id;
  }

  compareDividendCalculation(o1: Pick<IDividendCalculation, 'id'> | null, o2: Pick<IDividendCalculation, 'id'> | null): boolean {
    return o1 && o2 ? this.getDividendCalculationIdentifier(o1) === this.getDividendCalculationIdentifier(o2) : o1 === o2;
  }

  addDividendCalculationToCollectionIfMissing<Type extends Pick<IDividendCalculation, 'id'>>(
    dividendCalculationCollection: Type[],
    ...dividendCalculationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dividendCalculations: Type[] = dividendCalculationsToCheck.filter(isPresent);
    if (dividendCalculations.length > 0) {
      const dividendCalculationCollectionIdentifiers = dividendCalculationCollection.map(
        dividendCalculationItem => this.getDividendCalculationIdentifier(dividendCalculationItem)!
      );
      const dividendCalculationsToAdd = dividendCalculations.filter(dividendCalculationItem => {
        const dividendCalculationIdentifier = this.getDividendCalculationIdentifier(dividendCalculationItem);
        if (dividendCalculationCollectionIdentifiers.includes(dividendCalculationIdentifier)) {
          return false;
        }
        dividendCalculationCollectionIdentifiers.push(dividendCalculationIdentifier);
        return true;
      });
      return [...dividendCalculationsToAdd, ...dividendCalculationCollection];
    }
    return dividendCalculationCollection;
  }
}
