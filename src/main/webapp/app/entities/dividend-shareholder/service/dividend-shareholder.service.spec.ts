import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDividendShareholder } from '../dividend-shareholder.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../dividend-shareholder.test-samples';

import { DividendShareholderService } from './dividend-shareholder.service';

const requireRestSample: IDividendShareholder = {
  ...sampleWithRequiredData,
};

describe('DividendShareholder Service', () => {
  let service: DividendShareholderService;
  let httpMock: HttpTestingController;
  let expectedResult: IDividendShareholder | IDividendShareholder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DividendShareholderService);
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

    it('should create a DividendShareholder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dividendShareholder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dividendShareholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DividendShareholder', () => {
      const dividendShareholder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dividendShareholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DividendShareholder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DividendShareholder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DividendShareholder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDividendShareholderToCollectionIfMissing', () => {
      it('should add a DividendShareholder to an empty array', () => {
        const dividendShareholder: IDividendShareholder = sampleWithRequiredData;
        expectedResult = service.addDividendShareholderToCollectionIfMissing([], dividendShareholder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dividendShareholder);
      });

      it('should not add a DividendShareholder to an array that contains it', () => {
        const dividendShareholder: IDividendShareholder = sampleWithRequiredData;
        const dividendShareholderCollection: IDividendShareholder[] = [
          {
            ...dividendShareholder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDividendShareholderToCollectionIfMissing(dividendShareholderCollection, dividendShareholder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DividendShareholder to an array that doesn't contain it", () => {
        const dividendShareholder: IDividendShareholder = sampleWithRequiredData;
        const dividendShareholderCollection: IDividendShareholder[] = [sampleWithPartialData];
        expectedResult = service.addDividendShareholderToCollectionIfMissing(dividendShareholderCollection, dividendShareholder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dividendShareholder);
      });

      it('should add only unique DividendShareholder to an array', () => {
        const dividendShareholderArray: IDividendShareholder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dividendShareholderCollection: IDividendShareholder[] = [sampleWithRequiredData];
        expectedResult = service.addDividendShareholderToCollectionIfMissing(dividendShareholderCollection, ...dividendShareholderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dividendShareholder: IDividendShareholder = sampleWithRequiredData;
        const dividendShareholder2: IDividendShareholder = sampleWithPartialData;
        expectedResult = service.addDividendShareholderToCollectionIfMissing([], dividendShareholder, dividendShareholder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dividendShareholder);
        expect(expectedResult).toContain(dividendShareholder2);
      });

      it('should accept null and undefined values', () => {
        const dividendShareholder: IDividendShareholder = sampleWithRequiredData;
        expectedResult = service.addDividendShareholderToCollectionIfMissing([], null, dividendShareholder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dividendShareholder);
      });

      it('should return initial array if no DividendShareholder is added', () => {
        const dividendShareholderCollection: IDividendShareholder[] = [sampleWithRequiredData];
        expectedResult = service.addDividendShareholderToCollectionIfMissing(dividendShareholderCollection, undefined, null);
        expect(expectedResult).toEqual(dividendShareholderCollection);
      });
    });

    describe('compareDividendShareholder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDividendShareholder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDividendShareholder(entity1, entity2);
        const compareResult2 = service.compareDividendShareholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDividendShareholder(entity1, entity2);
        const compareResult2 = service.compareDividendShareholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDividendShareholder(entity1, entity2);
        const compareResult2 = service.compareDividendShareholder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
