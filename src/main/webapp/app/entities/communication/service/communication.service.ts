import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommunication, NewCommunication } from '../communication.model';

export type PartialUpdateCommunication = Partial<ICommunication> & Pick<ICommunication, 'id'>;

export type EntityResponseType = HttpResponse<ICommunication>;
export type EntityArrayResponseType = HttpResponse<ICommunication[]>;

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/communications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(communication: NewCommunication): Observable<EntityResponseType> {
    return this.http.post<ICommunication>(this.resourceUrl, communication, { observe: 'response' });
  }

  update(communication: ICommunication): Observable<EntityResponseType> {
    return this.http.put<ICommunication>(`${this.resourceUrl}/${this.getCommunicationIdentifier(communication)}`, communication, {
      observe: 'response',
    });
  }

  partialUpdate(communication: PartialUpdateCommunication): Observable<EntityResponseType> {
    return this.http.patch<ICommunication>(`${this.resourceUrl}/${this.getCommunicationIdentifier(communication)}`, communication, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommunication>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommunication[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommunicationIdentifier(communication: Pick<ICommunication, 'id'>): number {
    return communication.id;
  }

  compareCommunication(o1: Pick<ICommunication, 'id'> | null, o2: Pick<ICommunication, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommunicationIdentifier(o1) === this.getCommunicationIdentifier(o2) : o1 === o2;
  }

  addCommunicationToCollectionIfMissing<Type extends Pick<ICommunication, 'id'>>(
    communicationCollection: Type[],
    ...communicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const communications: Type[] = communicationsToCheck.filter(isPresent);
    if (communications.length > 0) {
      const communicationCollectionIdentifiers = communicationCollection.map(
        communicationItem => this.getCommunicationIdentifier(communicationItem)!
      );
      const communicationsToAdd = communications.filter(communicationItem => {
        const communicationIdentifier = this.getCommunicationIdentifier(communicationItem);
        if (communicationCollectionIdentifiers.includes(communicationIdentifier)) {
          return false;
        }
        communicationCollectionIdentifiers.push(communicationIdentifier);
        return true;
      });
      return [...communicationsToAdd, ...communicationCollection];
    }
    return communicationCollection;
  }
}
