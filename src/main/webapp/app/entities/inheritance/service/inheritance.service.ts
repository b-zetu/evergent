import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInheritance, NewInheritance } from '../inheritance.model';

export type PartialUpdateInheritance = Partial<IInheritance> & Pick<IInheritance, 'id'>;

type RestOf<T extends IInheritance | NewInheritance> = Omit<T, 'operationDate' | 'documentDate'> & {
  operationDate?: string | null;
  documentDate?: string | null;
};

export type RestInheritance = RestOf<IInheritance>;

export type NewRestInheritance = RestOf<NewInheritance>;

export type PartialUpdateRestInheritance = RestOf<PartialUpdateInheritance>;

export type EntityResponseType = HttpResponse<IInheritance>;
export type EntityArrayResponseType = HttpResponse<IInheritance[]>;

@Injectable({ providedIn: 'root' })
export class InheritanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/inheritances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(inheritance: NewInheritance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inheritance);
    return this.http
      .post<RestInheritance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(inheritance: IInheritance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inheritance);
    return this.http
      .put<RestInheritance>(`${this.resourceUrl}/${this.getInheritanceIdentifier(inheritance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(inheritance: PartialUpdateInheritance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inheritance);
    return this.http
      .patch<RestInheritance>(`${this.resourceUrl}/${this.getInheritanceIdentifier(inheritance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInheritance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInheritance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInheritanceIdentifier(inheritance: Pick<IInheritance, 'id'>): number {
    return inheritance.id;
  }

  compareInheritance(o1: Pick<IInheritance, 'id'> | null, o2: Pick<IInheritance, 'id'> | null): boolean {
    return o1 && o2 ? this.getInheritanceIdentifier(o1) === this.getInheritanceIdentifier(o2) : o1 === o2;
  }

  addInheritanceToCollectionIfMissing<Type extends Pick<IInheritance, 'id'>>(
    inheritanceCollection: Type[],
    ...inheritancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const inheritances: Type[] = inheritancesToCheck.filter(isPresent);
    if (inheritances.length > 0) {
      const inheritanceCollectionIdentifiers = inheritanceCollection.map(
        inheritanceItem => this.getInheritanceIdentifier(inheritanceItem)!
      );
      const inheritancesToAdd = inheritances.filter(inheritanceItem => {
        const inheritanceIdentifier = this.getInheritanceIdentifier(inheritanceItem);
        if (inheritanceCollectionIdentifiers.includes(inheritanceIdentifier)) {
          return false;
        }
        inheritanceCollectionIdentifiers.push(inheritanceIdentifier);
        return true;
      });
      return [...inheritancesToAdd, ...inheritanceCollection];
    }
    return inheritanceCollection;
  }

  protected convertDateFromClient<T extends IInheritance | NewInheritance | PartialUpdateInheritance>(inheritance: T): RestOf<T> {
    return {
      ...inheritance,
      operationDate: inheritance.operationDate?.format(DATE_FORMAT) ?? null,
      documentDate: inheritance.documentDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restInheritance: RestInheritance): IInheritance {
    return {
      ...restInheritance,
      operationDate: restInheritance.operationDate ? dayjs(restInheritance.operationDate) : undefined,
      documentDate: restInheritance.documentDate ? dayjs(restInheritance.documentDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInheritance>): HttpResponse<IInheritance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInheritance[]>): HttpResponse<IInheritance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
