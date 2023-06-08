import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILegalHold, NewLegalHold } from '../legal-hold.model';

export type PartialUpdateLegalHold = Partial<ILegalHold> & Pick<ILegalHold, 'id'>;

type RestOf<T extends ILegalHold | NewLegalHold> = Omit<T, 'poprireDate' | 'poprireDocumentDate' | 'sistareDate' | 'sistareIntrareDate'> & {
  poprireDate?: string | null;
  poprireDocumentDate?: string | null;
  sistareDate?: string | null;
  sistareIntrareDate?: string | null;
};

export type RestLegalHold = RestOf<ILegalHold>;

export type NewRestLegalHold = RestOf<NewLegalHold>;

export type PartialUpdateRestLegalHold = RestOf<PartialUpdateLegalHold>;

export type EntityResponseType = HttpResponse<ILegalHold>;
export type EntityArrayResponseType = HttpResponse<ILegalHold[]>;

@Injectable({ providedIn: 'root' })
export class LegalHoldService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/legal-holds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(legalHold: NewLegalHold): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(legalHold);
    return this.http
      .post<RestLegalHold>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(legalHold: ILegalHold): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(legalHold);
    return this.http
      .put<RestLegalHold>(`${this.resourceUrl}/${this.getLegalHoldIdentifier(legalHold)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(legalHold: PartialUpdateLegalHold): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(legalHold);
    return this.http
      .patch<RestLegalHold>(`${this.resourceUrl}/${this.getLegalHoldIdentifier(legalHold)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLegalHold>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLegalHold[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLegalHoldIdentifier(legalHold: Pick<ILegalHold, 'id'>): number {
    return legalHold.id;
  }

  compareLegalHold(o1: Pick<ILegalHold, 'id'> | null, o2: Pick<ILegalHold, 'id'> | null): boolean {
    return o1 && o2 ? this.getLegalHoldIdentifier(o1) === this.getLegalHoldIdentifier(o2) : o1 === o2;
  }

  addLegalHoldToCollectionIfMissing<Type extends Pick<ILegalHold, 'id'>>(
    legalHoldCollection: Type[],
    ...legalHoldsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const legalHolds: Type[] = legalHoldsToCheck.filter(isPresent);
    if (legalHolds.length > 0) {
      const legalHoldCollectionIdentifiers = legalHoldCollection.map(legalHoldItem => this.getLegalHoldIdentifier(legalHoldItem)!);
      const legalHoldsToAdd = legalHolds.filter(legalHoldItem => {
        const legalHoldIdentifier = this.getLegalHoldIdentifier(legalHoldItem);
        if (legalHoldCollectionIdentifiers.includes(legalHoldIdentifier)) {
          return false;
        }
        legalHoldCollectionIdentifiers.push(legalHoldIdentifier);
        return true;
      });
      return [...legalHoldsToAdd, ...legalHoldCollection];
    }
    return legalHoldCollection;
  }

  protected convertDateFromClient<T extends ILegalHold | NewLegalHold | PartialUpdateLegalHold>(legalHold: T): RestOf<T> {
    return {
      ...legalHold,
      poprireDate: legalHold.poprireDate?.format(DATE_FORMAT) ?? null,
      poprireDocumentDate: legalHold.poprireDocumentDate?.format(DATE_FORMAT) ?? null,
      sistareDate: legalHold.sistareDate?.format(DATE_FORMAT) ?? null,
      sistareIntrareDate: legalHold.sistareIntrareDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restLegalHold: RestLegalHold): ILegalHold {
    return {
      ...restLegalHold,
      poprireDate: restLegalHold.poprireDate ? dayjs(restLegalHold.poprireDate) : undefined,
      poprireDocumentDate: restLegalHold.poprireDocumentDate ? dayjs(restLegalHold.poprireDocumentDate) : undefined,
      sistareDate: restLegalHold.sistareDate ? dayjs(restLegalHold.sistareDate) : undefined,
      sistareIntrareDate: restLegalHold.sistareIntrareDate ? dayjs(restLegalHold.sistareIntrareDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLegalHold>): HttpResponse<ILegalHold> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLegalHold[]>): HttpResponse<ILegalHold[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
