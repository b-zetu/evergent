import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShareholder } from '../shareholder.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shareholder.test-samples';

import { ShareholderService } from './shareholder.service';

const requireRestSample: IShareholder = {
  ...sampleWithRequiredData,
};

describe('Shareholder Service', () => {
  let service: ShareholderService;
  let httpMock: HttpTestingController;
  let expectedResult: IShareholder | IShareholder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShareholderService);
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

    it('should create a Shareholder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const shareholder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shareholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shareholder', () => {
      const shareholder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shareholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shareholder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shareholder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Shareholder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShareholderToCollectionIfMissing', () => {
      it('should add a Shareholder to an empty array', () => {
        const shareholder: IShareholder = sampleWithRequiredData;
        expectedResult = service.addShareholderToCollectionIfMissing([], shareholder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shareholder);
      });

      it('should not add a Shareholder to an array that contains it', () => {
        const shareholder: IShareholder = sampleWithRequiredData;
        const shareholderCollection: IShareholder[] = [
          {
            ...shareholder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShareholderToCollectionIfMissing(shareholderCollection, shareholder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shareholder to an array that doesn't contain it", () => {
        const shareholder: IShareholder = sampleWithRequiredData;
        const shareholderCollection: IShareholder[] = [sampleWithPartialData];
        expectedResult = service.addShareholderToCollectionIfMissing(shareholderCollection, shareholder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shareholder);
      });

      it('should add only unique Shareholder to an array', () => {
        const shareholderArray: IShareholder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shareholderCollection: IShareholder[] = [sampleWithRequiredData];
        expectedResult = service.addShareholderToCollectionIfMissing(shareholderCollection, ...shareholderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shareholder: IShareholder = sampleWithRequiredData;
        const shareholder2: IShareholder = sampleWithPartialData;
        expectedResult = service.addShareholderToCollectionIfMissing([], shareholder, shareholder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shareholder);
        expect(expectedResult).toContain(shareholder2);
      });

      it('should accept null and undefined values', () => {
        const shareholder: IShareholder = sampleWithRequiredData;
        expectedResult = service.addShareholderToCollectionIfMissing([], null, shareholder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shareholder);
      });

      it('should return initial array if no Shareholder is added', () => {
        const shareholderCollection: IShareholder[] = [sampleWithRequiredData];
        expectedResult = service.addShareholderToCollectionIfMissing(shareholderCollection, undefined, null);
        expect(expectedResult).toEqual(shareholderCollection);
      });
    });

    describe('compareShareholder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShareholder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShareholder(entity1, entity2);
        const compareResult2 = service.compareShareholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShareholder(entity1, entity2);
        const compareResult2 = service.compareShareholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShareholder(entity1, entity2);
        const compareResult2 = service.compareShareholder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
