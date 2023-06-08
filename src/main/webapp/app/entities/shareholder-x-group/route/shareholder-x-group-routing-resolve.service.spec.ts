import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IShareholderXGroup } from '../shareholder-x-group.model';
import { ShareholderXGroupService } from '../service/shareholder-x-group.service';

import { ShareholderXGroupRoutingResolveService } from './shareholder-x-group-routing-resolve.service';

describe('ShareholderXGroup routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ShareholderXGroupRoutingResolveService;
  let service: ShareholderXGroupService;
  let resultShareholderXGroup: IShareholderXGroup | null | undefined;

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
    routingResolveService = TestBed.inject(ShareholderXGroupRoutingResolveService);
    service = TestBed.inject(ShareholderXGroupService);
    resultShareholderXGroup = undefined;
  });

  describe('resolve', () => {
    it('should return IShareholderXGroup returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShareholderXGroup = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShareholderXGroup).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShareholderXGroup = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultShareholderXGroup).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IShareholderXGroup>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShareholderXGroup = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShareholderXGroup).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
