import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDividendRegister } from '../dividend-register.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../dividend-register.test-samples';

import { DividendRegisterService, RestDividendRegister } from './dividend-register.service';

const requireRestSample: RestDividendRegister = {
  ...sampleWithRequiredData,
  referenceDate: sampleWithRequiredData.referenceDate?.format(DATE_FORMAT),
};

describe('DividendRegister Service', () => {
  let service: DividendRegisterService;
  let httpMock: HttpTestingController;
  let expectedResult: IDividendRegister | IDividendRegister[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DividendRegisterService);
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

    it('should create a DividendRegister', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dividendRegister = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dividendRegister).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DividendRegister', () => {
      const dividendRegister = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dividendRegister).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DividendRegister', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DividendRegister', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DividendRegister', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDividendRegisterToCollectionIfMissing', () => {
      it('should add a DividendRegister to an empty array', () => {
        const dividendRegister: IDividendRegister = sampleWithRequiredData;
        expectedResult = service.addDividendRegisterToCollectionIfMissing([], dividendRegister);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dividendRegister);
      });

      it('should not add a DividendRegister to an array that contains it', () => {
        const dividendRegister: IDividendRegister = sampleWithRequiredData;
        const dividendRegisterCollection: IDividendRegister[] = [
          {
            ...dividendRegister,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDividendRegisterToCollectionIfMissing(dividendRegisterCollection, dividendRegister);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DividendRegister to an array that doesn't contain it", () => {
        const dividendRegister: IDividendRegister = sampleWithRequiredData;
        const dividendRegisterCollection: IDividendRegister[] = [sampleWithPartialData];
        expectedResult = service.addDividendRegisterToCollectionIfMissing(dividendRegisterCollection, dividendRegister);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dividendRegister);
      });

      it('should add only unique DividendRegister to an array', () => {
        const dividendRegisterArray: IDividendRegister[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dividendRegisterCollection: IDividendRegister[] = [sampleWithRequiredData];
        expectedResult = service.addDividendRegisterToCollectionIfMissing(dividendRegisterCollection, ...dividendRegisterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dividendRegister: IDividendRegister = sampleWithRequiredData;
        const dividendRegister2: IDividendRegister = sampleWithPartialData;
        expectedResult = service.addDividendRegisterToCollectionIfMissing([], dividendRegister, dividendRegister2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dividendRegister);
        expect(expectedResult).toContain(dividendRegister2);
      });

      it('should accept null and undefined values', () => {
        const dividendRegister: IDividendRegister = sampleWithRequiredData;
        expectedResult = service.addDividendRegisterToCollectionIfMissing([], null, dividendRegister, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dividendRegister);
      });

      it('should return initial array if no DividendRegister is added', () => {
        const dividendRegisterCollection: IDividendRegister[] = [sampleWithRequiredData];
        expectedResult = service.addDividendRegisterToCollectionIfMissing(dividendRegisterCollection, undefined, null);
        expect(expectedResult).toEqual(dividendRegisterCollection);
      });
    });

    describe('compareDividendRegister', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDividendRegister(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDividendRegister(entity1, entity2);
        const compareResult2 = service.compareDividendRegister(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDividendRegister(entity1, entity2);
        const compareResult2 = service.compareDividendRegister(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDividendRegister(entity1, entity2);
        const compareResult2 = service.compareDividendRegister(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
