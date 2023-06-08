import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoteOption } from '../vote-option.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vote-option.test-samples';

import { VoteOptionService } from './vote-option.service';

const requireRestSample: IVoteOption = {
  ...sampleWithRequiredData,
};

describe('VoteOption Service', () => {
  let service: VoteOptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoteOption | IVoteOption[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoteOptionService);
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

    it('should create a VoteOption', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const voteOption = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voteOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VoteOption', () => {
      const voteOption = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voteOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VoteOption', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VoteOption', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VoteOption', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoteOptionToCollectionIfMissing', () => {
      it('should add a VoteOption to an empty array', () => {
        const voteOption: IVoteOption = sampleWithRequiredData;
        expectedResult = service.addVoteOptionToCollectionIfMissing([], voteOption);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteOption);
      });

      it('should not add a VoteOption to an array that contains it', () => {
        const voteOption: IVoteOption = sampleWithRequiredData;
        const voteOptionCollection: IVoteOption[] = [
          {
            ...voteOption,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoteOptionToCollectionIfMissing(voteOptionCollection, voteOption);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VoteOption to an array that doesn't contain it", () => {
        const voteOption: IVoteOption = sampleWithRequiredData;
        const voteOptionCollection: IVoteOption[] = [sampleWithPartialData];
        expectedResult = service.addVoteOptionToCollectionIfMissing(voteOptionCollection, voteOption);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteOption);
      });

      it('should add only unique VoteOption to an array', () => {
        const voteOptionArray: IVoteOption[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voteOptionCollection: IVoteOption[] = [sampleWithRequiredData];
        expectedResult = service.addVoteOptionToCollectionIfMissing(voteOptionCollection, ...voteOptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voteOption: IVoteOption = sampleWithRequiredData;
        const voteOption2: IVoteOption = sampleWithPartialData;
        expectedResult = service.addVoteOptionToCollectionIfMissing([], voteOption, voteOption2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteOption);
        expect(expectedResult).toContain(voteOption2);
      });

      it('should accept null and undefined values', () => {
        const voteOption: IVoteOption = sampleWithRequiredData;
        expectedResult = service.addVoteOptionToCollectionIfMissing([], null, voteOption, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteOption);
      });

      it('should return initial array if no VoteOption is added', () => {
        const voteOptionCollection: IVoteOption[] = [sampleWithRequiredData];
        expectedResult = service.addVoteOptionToCollectionIfMissing(voteOptionCollection, undefined, null);
        expect(expectedResult).toEqual(voteOptionCollection);
      });
    });

    describe('compareVoteOption', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoteOption(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
