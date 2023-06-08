import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISysParameter, NewSysParameter } from '../sys-parameter.model';

export type PartialUpdateSysParameter = Partial<ISysParameter> & Pick<ISysParameter, 'id'>;

export type EntityResponseType = HttpResponse<ISysParameter>;
export type EntityArrayResponseType = HttpResponse<ISysParameter[]>;

@Injectable({ providedIn: 'root' })
export class SysParameterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sys-parameters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sysParameter: NewSysParameter): Observable<EntityResponseType> {
    return this.http.post<ISysParameter>(this.resourceUrl, sysParameter, { observe: 'response' });
  }

  update(sysParameter: ISysParameter): Observable<EntityResponseType> {
    return this.http.put<ISysParameter>(`${this.resourceUrl}/${this.getSysParameterIdentifier(sysParameter)}`, sysParameter, {
      observe: 'response',
    });
  }

  partialUpdate(sysParameter: PartialUpdateSysParameter): Observable<EntityResponseType> {
    return this.http.patch<ISysParameter>(`${this.resourceUrl}/${this.getSysParameterIdentifier(sysParameter)}`, sysParameter, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISysParameter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISysParameter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSysParameterIdentifier(sysParameter: Pick<ISysParameter, 'id'>): number {
    return sysParameter.id;
  }

  compareSysParameter(o1: Pick<ISysParameter, 'id'> | null, o2: Pick<ISysParameter, 'id'> | null): boolean {
    return o1 && o2 ? this.getSysParameterIdentifier(o1) === this.getSysParameterIdentifier(o2) : o1 === o2;
  }

  addSysParameterToCollectionIfMissing<Type extends Pick<ISysParameter, 'id'>>(
    sysParameterCollection: Type[],
    ...sysParametersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sysParameters: Type[] = sysParametersToCheck.filter(isPresent);
    if (sysParameters.length > 0) {
      const sysParameterCollectionIdentifiers = sysParameterCollection.map(
        sysParameterItem => this.getSysParameterIdentifier(sysParameterItem)!
      );
      const sysParametersToAdd = sysParameters.filter(sysParameterItem => {
        const sysParameterIdentifier = this.getSysParameterIdentifier(sysParameterItem);
        if (sysParameterCollectionIdentifiers.includes(sysParameterIdentifier)) {
          return false;
        }
        sysParameterCollectionIdentifiers.push(sysParameterIdentifier);
        return true;
      });
      return [...sysParametersToAdd, ...sysParameterCollection];
    }
    return sysParameterCollection;
  }
}
