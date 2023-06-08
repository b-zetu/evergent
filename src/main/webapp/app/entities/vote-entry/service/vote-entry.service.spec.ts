import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoteEntry } from '../vote-entry.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vote-entry.test-samples';

import { VoteEntryService } from './vote-entry.service';

const requireRestSample: IVoteEntry = {
  ...sampleWithRequiredData,
};

describe('VoteEntry Service', () => {
  let service: VoteEntryService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoteEntry | IVoteEntry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoteEntryService);
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

    it('should create a VoteEntry', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const voteEntry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voteEntry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VoteEntry', () => {
      const voteEntry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voteEntry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VoteEntry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VoteEntry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VoteEntry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoteEntryToCollectionIfMissing', () => {
      it('should add a VoteEntry to an empty array', () => {
        const voteEntry: IVoteEntry = sampleWithRequiredData;
        expectedResult = service.addVoteEntryToCollectionIfMissing([], voteEntry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteEntry);
      });

      it('should not add a VoteEntry to an array that contains it', () => {
        const voteEntry: IVoteEntry = sampleWithRequiredData;
        const voteEntryCollection: IVoteEntry[] = [
          {
            ...voteEntry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoteEntryToCollectionIfMissing(voteEntryCollection, voteEntry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VoteEntry to an array that doesn't contain it", () => {
        const voteEntry: IVoteEntry = sampleWithRequiredData;
        const voteEntryCollection: IVoteEntry[] = [sampleWithPartialData];
        expectedResult = service.addVoteEntryToCollectionIfMissing(voteEntryCollection, voteEntry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteEntry);
      });

      it('should add only unique VoteEntry to an array', () => {
        const voteEntryArray: IVoteEntry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voteEntryCollection: IVoteEntry[] = [sampleWithRequiredData];
        expectedResult = service.addVoteEntryToCollectionIfMissing(voteEntryCollection, ...voteEntryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voteEntry: IVoteEntry = sampleWithRequiredData;
        const voteEntry2: IVoteEntry = sampleWithPartialData;
        expectedResult = service.addVoteEntryToCollectionIfMissing([], voteEntry, voteEntry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteEntry);
        expect(expectedResult).toContain(voteEntry2);
      });

      it('should accept null and undefined values', () => {
        const voteEntry: IVoteEntry = sampleWithRequiredData;
        expectedResult = service.addVoteEntryToCollectionIfMissing([], null, voteEntry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteEntry);
      });

      it('should return initial array if no VoteEntry is added', () => {
        const voteEntryCollection: IVoteEntry[] = [sampleWithRequiredData];
        expectedResult = service.addVoteEntryToCollectionIfMissing(voteEntryCollection, undefined, null);
        expect(expectedResult).toEqual(voteEntryCollection);
      });
    });

    describe('compareVoteEntry', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoteEntry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoteEntry(entity1, entity2);
        const compareResult2 = service.compareVoteEntry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoteEntry(entity1, entity2);
        const compareResult2 = service.compareVoteEntry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoteEntry(entity1, entity2);
        const compareResult2 = service.compareVoteEntry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
