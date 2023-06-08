import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommunication } from '../communication.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../communication.test-samples';

import { CommunicationService } from './communication.service';

const requireRestSample: ICommunication = {
  ...sampleWithRequiredData,
};

describe('Communication Service', () => {
  let service: CommunicationService;
  let httpMock: HttpTestingController;
  let expectedResult: ICommunication | ICommunication[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Communication', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const communication = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(communication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Communication', () => {
      const communication = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(communication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Communication', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Communication', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Communication', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCommunicationToCollectionIfMissing', () => {
      it('should add a Communication to an empty array', () => {
        const communication: ICommunication = sampleWithRequiredData;
        expectedResult = service.addCommunicationToCollectionIfMissing([], communication);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(communication);
      });

      it('should not add a Communication to an array that contains it', () => {
        const communication: ICommunication = sampleWithRequiredData;
        const communicationCollection: ICommunication[] = [
          {
            ...communication,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCommunicationToCollectionIfMissing(communicationCollection, communication);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Communication to an array that doesn't contain it", () => {
        const communication: ICommunication = sampleWithRequiredData;
        const communicationCollection: ICommunication[] = [sampleWithPartialData];
        expectedResult = service.addCommunicationToCollectionIfMissing(communicationCollection, communication);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(communication);
      });

      it('should add only unique Communication to an array', () => {
        const communicationArray: ICommunication[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const communicationCollection: ICommunication[] = [sampleWithRequiredData];
        expectedResult = service.addCommunicationToCollectionIfMissing(communicationCollection, ...communicationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const communication: ICommunication = sampleWithRequiredData;
        const communication2: ICommunication = sampleWithPartialData;
        expectedResult = service.addCommunicationToCollectionIfMissing([], communication, communication2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(communication);
        expect(expectedResult).toContain(communication2);
      });

      it('should accept null and undefined values', () => {
        const communication: ICommunication = sampleWithRequiredData;
        expectedResult = service.addCommunicationToCollectionIfMissing([], null, communication, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(communication);
      });

      it('should return initial array if no Communication is added', () => {
        const communicationCollection: ICommunication[] = [sampleWithRequiredData];
        expectedResult = service.addCommunicationToCollectionIfMissing(communicationCollection, undefined, null);
        expect(expectedResult).toEqual(communicationCollection);
      });
    });

    describe('compareCommunication', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCommunication(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCommunication(entity1, entity2);
        const compareResult2 = service.compareCommunication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCommunication(entity1, entity2);
        const compareResult2 = service.compareCommunication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCommunication(entity1, entity2);
        const compareResult2 = service.compareCommunication(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
