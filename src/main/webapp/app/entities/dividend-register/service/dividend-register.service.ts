import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDividendRegister, NewDividendRegister } from '../dividend-register.model';

export type PartialUpdateDividendRegister = Partial<IDividendRegister> & Pick<IDividendRegister, 'id'>;

type RestOf<T extends IDividendRegister | NewDividendRegister> = Omit<T, 'referenceDate'> & {
  referenceDate?: string | null;
};

export type RestDividendRegister = RestOf<IDividendRegister>;

export type NewRestDividendRegister = RestOf<NewDividendRegister>;

export type PartialUpdateRestDividendRegister = RestOf<PartialUpdateDividendRegister>;

export type EntityResponseType = HttpResponse<IDividendRegister>;
export type EntityArrayResponseType = HttpResponse<IDividendRegister[]>;

@Injectable({ providedIn: 'root' })
export class DividendRegisterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dividend-registers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dividendRegister: NewDividendRegister): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dividendRegister);
    return this.http
      .post<RestDividendRegister>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(dividendRegister: IDividendRegister): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dividendRegister);
    return this.http
      .put<RestDividendRegister>(`${this.resourceUrl}/${this.getDividendRegisterIdentifier(dividendRegister)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(dividendRegister: PartialUpdateDividendRegister): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dividendRegister);
    return this.http
      .patch<RestDividendRegister>(`${this.resourceUrl}/${this.getDividendRegisterIdentifier(dividendRegister)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDividendRegister>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDividendRegister[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDividendRegisterIdentifier(dividendRegister: Pick<IDividendRegister, 'id'>): number {
    return dividendRegister.id;
  }

  compareDividendRegister(o1: Pick<IDividendRegister, 'id'> | null, o2: Pick<IDividendRegister, 'id'> | null): boolean {
    return o1 && o2 ? this.getDividendRegisterIdentifier(o1) === this.getDividendRegisterIdentifier(o2) : o1 === o2;
  }

  addDividendRegisterToCollectionIfMissing<Type extends Pick<IDividendRegister, 'id'>>(
    dividendRegisterCollection: Type[],
    ...dividendRegistersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dividendRegisters: Type[] = dividendRegistersToCheck.filter(isPresent);
    if (dividendRegisters.length > 0) {
      const dividendRegisterCollectionIdentifiers = dividendRegisterCollection.map(
        dividendRegisterItem => this.getDividendRegisterIdentifier(dividendRegisterItem)!
      );
      const dividendRegistersToAdd = dividendRegisters.filter(dividendRegisterItem => {
        const dividendRegisterIdentifier = this.getDividendRegisterIdentifier(dividendRegisterItem);
        if (dividendRegisterCollectionIdentifiers.includes(dividendRegisterIdentifier)) {
          return false;
        }
        dividendRegisterCollectionIdentifiers.push(dividendRegisterIdentifier);
        return true;
      });
      return [...dividendRegistersToAdd, ...dividendRegisterCollection];
    }
    return dividendRegisterCollection;
  }

  protected convertDateFromClient<T extends IDividendRegister | NewDividendRegister | PartialUpdateDividendRegister>(
    dividendRegister: T
  ): RestOf<T> {
    return {
      ...dividendRegister,
      referenceDate: dividendRegister.referenceDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restDividendRegister: RestDividendRegister): IDividendRegister {
    return {
      ...restDividendRegister,
      referenceDate: restDividendRegister.referenceDate ? dayjs(restDividendRegister.referenceDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDividendRegister>): HttpResponse<IDividendRegister> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDividendRegister[]>): HttpResponse<IDividendRegister[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
