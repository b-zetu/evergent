import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVoteProposal } from '../vote-proposal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vote-proposal.test-samples';

import { VoteProposalService, RestVoteProposal } from './vote-proposal.service';

const requireRestSample: RestVoteProposal = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
};

describe('VoteProposal Service', () => {
  let service: VoteProposalService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoteProposal | IVoteProposal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoteProposalService);
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

    it('should create a VoteProposal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const voteProposal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voteProposal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VoteProposal', () => {
      const voteProposal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voteProposal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VoteProposal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VoteProposal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VoteProposal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoteProposalToCollectionIfMissing', () => {
      it('should add a VoteProposal to an empty array', () => {
        const voteProposal: IVoteProposal = sampleWithRequiredData;
        expectedResult = service.addVoteProposalToCollectionIfMissing([], voteProposal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteProposal);
      });

      it('should not add a VoteProposal to an array that contains it', () => {
        const voteProposal: IVoteProposal = sampleWithRequiredData;
        const voteProposalCollection: IVoteProposal[] = [
          {
            ...voteProposal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoteProposalToCollectionIfMissing(voteProposalCollection, voteProposal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VoteProposal to an array that doesn't contain it", () => {
        const voteProposal: IVoteProposal = sampleWithRequiredData;
        const voteProposalCollection: IVoteProposal[] = [sampleWithPartialData];
        expectedResult = service.addVoteProposalToCollectionIfMissing(voteProposalCollection, voteProposal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteProposal);
      });

      it('should add only unique VoteProposal to an array', () => {
        const voteProposalArray: IVoteProposal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voteProposalCollection: IVoteProposal[] = [sampleWithRequiredData];
        expectedResult = service.addVoteProposalToCollectionIfMissing(voteProposalCollection, ...voteProposalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voteProposal: IVoteProposal = sampleWithRequiredData;
        const voteProposal2: IVoteProposal = sampleWithPartialData;
        expectedResult = service.addVoteProposalToCollectionIfMissing([], voteProposal, voteProposal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voteProposal);
        expect(expectedResult).toContain(voteProposal2);
      });

      it('should accept null and undefined values', () => {
        const voteProposal: IVoteProposal = sampleWithRequiredData;
        expectedResult = service.addVoteProposalToCollectionIfMissing([], null, voteProposal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voteProposal);
      });

      it('should return initial array if no VoteProposal is added', () => {
        const voteProposalCollection: IVoteProposal[] = [sampleWithRequiredData];
        expectedResult = service.addVoteProposalToCollectionIfMissing(voteProposalCollection, undefined, null);
        expect(expectedResult).toEqual(voteProposalCollection);
      });
    });

    describe('compareVoteProposal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoteProposal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoteProposal(entity1, entity2);
        const compareResult2 = service.compareVoteProposal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoteProposal(entity1, entity2);
        const compareResult2 = service.compareVoteProposal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoteProposal(entity1, entity2);
        const compareResult2 = service.compareVoteProposal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
