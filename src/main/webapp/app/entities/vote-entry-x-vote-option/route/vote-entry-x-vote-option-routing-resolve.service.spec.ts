import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import { VoteEntryXVoteOptionService } from '../service/vote-entry-x-vote-option.service';

import { VoteEntryXVoteOptionRoutingResolveService } from './vote-entry-x-vote-option-routing-resolve.service';

describe('VoteEntryXVoteOption routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: VoteEntryXVoteOptionRoutingResolveService;
  let service: VoteEntryXVoteOptionService;
  let resultVoteEntryXVoteOption: IVoteEntryXVoteOption | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(VoteEntryXVoteOptionRoutingResolveService);
    service = TestBed.inject(VoteEntryXVoteOptionService);
    resultVoteEntryXVoteOption = undefined;
  });

  describe('resolve', () => {
    it('should return IVoteEntryXVoteOption returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVoteEntryXVoteOption = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVoteEntryXVoteOption).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVoteEntryXVoteOption = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultVoteEntryXVoteOption).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IVoteEntryXVoteOption>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVoteEntryXVoteOption = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVoteEntryXVoteOption).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
