import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../shareholder-x-inheritance.test-samples';

import { ShareholderXInheritanceService } from './shareholder-x-inheritance.service';

const requireRestSample: IShareholderXInheritance = {
  ...sampleWithRequiredData,
};

describe('ShareholderXInheritance Service', () => {
  let service: ShareholderXInheritanceService;
  let httpMock: HttpTestingController;
  let expectedResult: IShareholderXInheritance | IShareholderXInheritance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShareholderXInheritanceService);
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

    it('should create a ShareholderXInheritance', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const shareholderXInheritance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shareholderXInheritance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShareholderXInheritance', () => {
      const shareholderXInheritance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shareholderXInheritance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ShareholderXInheritance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ShareholderXInheritance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ShareholderXInheritance', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShareholderXInheritanceToCollectionIfMissing', () => {
      it('should add a ShareholderXInheritance to an empty array', () => {
        const shareholderXInheritance: IShareholderXInheritance = sampleWithRequiredData;
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing([], shareholderXInheritance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shareholderXInheritance);
      });

      it('should not add a ShareholderXInheritance to an array that contains it', () => {
        const shareholderXInheritance: IShareholderXInheritance = sampleWithRequiredData;
        const shareholderXInheritanceCollection: IShareholderXInheritance[] = [
          {
            ...shareholderXInheritance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing(
          shareholderXInheritanceCollection,
          shareholderXInheritance
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShareholderXInheritance to an array that doesn't contain it", () => {
        const shareholderXInheritance: IShareholderXInheritance = sampleWithRequiredData;
        const shareholderXInheritanceCollection: IShareholderXInheritance[] = [sampleWithPartialData];
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing(
          shareholderXInheritanceCollection,
          shareholderXInheritance
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shareholderXInheritance);
      });

      it('should add only unique ShareholderXInheritance to an array', () => {
        const shareholderXInheritanceArray: IShareholderXInheritance[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const shareholderXInheritanceCollection: IShareholderXInheritance[] = [sampleWithRequiredData];
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing(
          shareholderXInheritanceCollection,
          ...shareholderXInheritanceArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shareholderXInheritance: IShareholderXInheritance = sampleWithRequiredData;
        const shareholderXInheritance2: IShareholderXInheritance = sampleWithPartialData;
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing([], shareholderXInheritance, shareholderXInheritance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shareholderXInheritance);
        expect(expectedResult).toContain(shareholderXInheritance2);
      });

      it('should accept null and undefined values', () => {
        const shareholderXInheritance: IShareholderXInheritance = sampleWithRequiredData;
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing([], null, shareholderXInheritance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shareholderXInheritance);
      });

      it('should return initial array if no ShareholderXInheritance is added', () => {
        const shareholderXInheritanceCollection: IShareholderXInheritance[] = [sampleWithRequiredData];
        expectedResult = service.addShareholderXInheritanceToCollectionIfMissing(shareholderXInheritanceCollection, undefined, null);
        expect(expectedResult).toEqual(shareholderXInheritanceCollection);
      });
    });

    describe('compareShareholderXInheritance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShareholderXInheritance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShareholderXInheritance(entity1, entity2);
        const compareResult2 = service.compareShareholderXInheritance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShareholderXInheritance(entity1, entity2);
        const compareResult2 = service.compareShareholderXInheritance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShareholderXInheritance(entity1, entity2);
        const compareResult2 = service.compareShareholderXInheritance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
