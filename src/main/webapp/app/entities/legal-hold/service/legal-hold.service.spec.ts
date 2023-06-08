import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILegalHold } from '../legal-hold.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../legal-hold.test-samples';

import { LegalHoldService, RestLegalHold } from './legal-hold.service';

const requireRestSample: RestLegalHold = {
  ...sampleWithRequiredData,
  poprireDate: sampleWithRequiredData.poprireDate?.format(DATE_FORMAT),
  poprireDocumentDate: sampleWithRequiredData.poprireDocumentDate?.format(DATE_FORMAT),
  sistareDate: sampleWithRequiredData.sistareDate?.format(DATE_FORMAT),
  sistareIntrareDate: sampleWithRequiredData.sistareIntrareDate?.format(DATE_FORMAT),
};

describe('LegalHold Service', () => {
  let service: LegalHoldService;
  let httpMock: HttpTestingController;
  let expectedResult: ILegalHold | ILegalHold[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LegalHoldService);
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

    it('should create a LegalHold', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const legalHold = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(legalHold).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LegalHold', () => {
      const legalHold = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(legalHold).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LegalHold', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LegalHold', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LegalHold', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLegalHoldToCollectionIfMissing', () => {
      it('should add a LegalHold to an empty array', () => {
        const legalHold: ILegalHold = sampleWithRequiredData;
        expectedResult = service.addLegalHoldToCollectionIfMissing([], legalHold);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalHold);
      });

      it('should not add a LegalHold to an array that contains it', () => {
        const legalHold: ILegalHold = sampleWithRequiredData;
        const legalHoldCollection: ILegalHold[] = [
          {
            ...legalHold,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLegalHoldToCollectionIfMissing(legalHoldCollection, legalHold);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LegalHold to an array that doesn't contain it", () => {
        const legalHold: ILegalHold = sampleWithRequiredData;
        const legalHoldCollection: ILegalHold[] = [sampleWithPartialData];
        expectedResult = service.addLegalHoldToCollectionIfMissing(legalHoldCollection, legalHold);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalHold);
      });

      it('should add only unique LegalHold to an array', () => {
        const legalHoldArray: ILegalHold[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const legalHoldCollection: ILegalHold[] = [sampleWithRequiredData];
        expectedResult = service.addLegalHoldToCollectionIfMissing(legalHoldCollection, ...legalHoldArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const legalHold: ILegalHold = sampleWithRequiredData;
        const legalHold2: ILegalHold = sampleWithPartialData;
        expectedResult = service.addLegalHoldToCollectionIfMissing([], legalHold, legalHold2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalHold);
        expect(expectedResult).toContain(legalHold2);
      });

      it('should accept null and undefined values', () => {
        const legalHold: ILegalHold = sampleWithRequiredData;
        expectedResult = service.addLegalHoldToCollectionIfMissing([], null, legalHold, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalHold);
      });

      it('should return initial array if no LegalHold is added', () => {
        const legalHoldCollection: ILegalHold[] = [sampleWithRequiredData];
        expectedResult = service.addLegalHoldToCollectionIfMissing(legalHoldCollection, undefined, null);
        expect(expectedResult).toEqual(legalHoldCollection);
      });
    });

    describe('compareLegalHold', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLegalHold(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLegalHold(entity1, entity2);
        const compareResult2 = service.compareLegalHold(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLegalHold(entity1, entity2);
        const compareResult2 = service.compareLegalHold(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLegalHold(entity1, entity2);
        const compareResult2 = service.compareLegalHold(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
