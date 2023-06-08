import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISysParameter } from '../sys-parameter.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sys-parameter.test-samples';

import { SysParameterService } from './sys-parameter.service';

const requireRestSample: ISysParameter = {
  ...sampleWithRequiredData,
};

describe('SysParameter Service', () => {
  let service: SysParameterService;
  let httpMock: HttpTestingController;
  let expectedResult: ISysParameter | ISysParameter[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SysParameterService);
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

    it('should create a SysParameter', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sysParameter = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sysParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SysParameter', () => {
      const sysParameter = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sysParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SysParameter', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SysParameter', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SysParameter', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSysParameterToCollectionIfMissing', () => {
      it('should add a SysParameter to an empty array', () => {
        const sysParameter: ISysParameter = sampleWithRequiredData;
        expectedResult = service.addSysParameterToCollectionIfMissing([], sysParameter);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sysParameter);
      });

      it('should not add a SysParameter to an array that contains it', () => {
        const sysParameter: ISysParameter = sampleWithRequiredData;
        const sysParameterCollection: ISysParameter[] = [
          {
            ...sysParameter,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSysParameterToCollectionIfMissing(sysParameterCollection, sysParameter);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SysParameter to an array that doesn't contain it", () => {
        const sysParameter: ISysParameter = sampleWithRequiredData;
        const sysParameterCollection: ISysParameter[] = [sampleWithPartialData];
        expectedResult = service.addSysParameterToCollectionIfMissing(sysParameterCollection, sysParameter);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sysParameter);
      });

      it('should add only unique SysParameter to an array', () => {
        const sysParameterArray: ISysParameter[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sysParameterCollection: ISysParameter[] = [sampleWithRequiredData];
        expectedResult = service.addSysParameterToCollectionIfMissing(sysParameterCollection, ...sysParameterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sysParameter: ISysParameter = sampleWithRequiredData;
        const sysParameter2: ISysParameter = sampleWithPartialData;
        expectedResult = service.addSysParameterToCollectionIfMissing([], sysParameter, sysParameter2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sysParameter);
        expect(expectedResult).toContain(sysParameter2);
      });

      it('should accept null and undefined values', () => {
        const sysParameter: ISysParameter = sampleWithRequiredData;
        expectedResult = service.addSysParameterToCollectionIfMissing([], null, sysParameter, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sysParameter);
      });

      it('should return initial array if no SysParameter is added', () => {
        const sysParameterCollection: ISysParameter[] = [sampleWithRequiredData];
        expectedResult = service.addSysParameterToCollectionIfMissing(sysParameterCollection, undefined, null);
        expect(expectedResult).toEqual(sysParameterCollection);
      });
    });

    describe('compareSysParameter', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSysParameter(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSysParameter(entity1, entity2);
        const compareResult2 = service.compareSysParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSysParameter(entity1, entity2);
        const compareResult2 = service.compareSysParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSysParameter(entity1, entity2);
        const compareResult2 = service.compareSysParameter(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
