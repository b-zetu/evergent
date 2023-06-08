import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../vote-entry-x-vote-option.test-samples';

import { VoteEntryXVoteOptionService } from './vote-entry-x-vote-option.service';

const requireRestSample: IVoteEntryXVoteOption = {
  ...sampleWithRequiredData,
};

describe('VoteEntryXVoteOption Service', () => {
  let service: VoteEntryXVoteOptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoteEntryXVoteOption | IVoteEntryXVoteOption[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoteEntryXVoteOptionService);
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

    it('should create a VoteEntryXVoteOption', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const voteEntryXVoteOption = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voteEntryXVoteOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VoteEntryXVoteOption', () => {
      const voteEntryXVoteOption = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voteEntryXVoteOption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VoteEntryXVoteOption', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VoteEntryXVoteOption', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VoteEntryXVoteOption', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoteEntryXVoteOptionToCollectionIfMissing', () => {
      it('should add a VoteEntryXVoteOption to an empty array', () => {
        const voteEntryXVoteOption: IVoteEntryXVoteOption = sampleWithRequiredData;
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing([], voteEntryXVoteOption);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteEntryXVoteOption);
      });

      it('should not add a VoteEntryXVoteOption to an array that contains it', () => {
        const voteEntryXVoteOption: IVoteEntryXVoteOption = sampleWithRequiredData;
        const voteEntryXVoteOptionCollection: IVoteEntryXVoteOption[] = [
          {
            ...voteEntryXVoteOption,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing(voteEntryXVoteOptionCollection, voteEntryXVoteOption);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VoteEntryXVoteOption to an array that doesn't contain it", () => {
        const voteEntryXVoteOption: IVoteEntryXVoteOption = sampleWithRequiredData;
        const voteEntryXVoteOptionCollection: IVoteEntryXVoteOption[] = [sampleWithPartialData];
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing(voteEntryXVoteOptionCollection, voteEntryXVoteOption);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteEntryXVoteOption);
      });

      it('should add only unique VoteEntryXVoteOption to an array', () => {
        const voteEntryXVoteOptionArray: IVoteEntryXVoteOption[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voteEntryXVoteOptionCollection: IVoteEntryXVoteOption[] = [sampleWithRequiredData];
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing(voteEntryXVoteOptionCollection, ...voteEntryXVoteOptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voteEntryXVoteOption: IVoteEntryXVoteOption = sampleWithRequiredData;
        const voteEntryXVoteOption2: IVoteEntryXVoteOption = sampleWithPartialData;
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing([], voteEntryXVoteOption, voteEntryXVoteOption2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteEntryXVoteOption);
        expect(expectedResult).toContain(voteEntryXVoteOption2);
      });

      it('should accept null and undefined values', () => {
        const voteEntryXVoteOption: IVoteEntryXVoteOption = sampleWithRequiredData;
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing([], null, voteEntryXVoteOption, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteEntryXVoteOption);
      });

      it('should return initial array if no VoteEntryXVoteOption is added', () => {
        const voteEntryXVoteOptionCollection: IVoteEntryXVoteOption[] = [sampleWithRequiredData];
        expectedResult = service.addVoteEntryXVoteOptionToCollectionIfMissing(voteEntryXVoteOptionCollection, undefined, null);
        expect(expectedResult).toEqual(voteEntryXVoteOptionCollection);
      });
    });

    describe('compareVoteEntryXVoteOption', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoteEntryXVoteOption(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoteEntryXVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteEntryXVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoteEntryXVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteEntryXVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoteEntryXVoteOption(entity1, entity2);
        const compareResult2 = service.compareVoteEntryXVoteOption(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
