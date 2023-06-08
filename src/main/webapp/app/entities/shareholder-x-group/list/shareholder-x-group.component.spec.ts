import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShareholderXGroupService } from '../service/shareholder-x-group.service';

import { ShareholderXGroupComponent } from './shareholder-x-group.component';

describe('ShareholderXGroup Management Component', () => {
  let comp: ShareholderXGroupComponent;
  let fixture: ComponentFixture<ShareholderXGroupComponent>;
  let service: ShareholderXGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'shareholder-x-group', component: ShareholderXGroupComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ShareholderXGroupComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ShareholderXGroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderXGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShareholderXGroupService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.shareholderXGroups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shareholderXGroupService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShareholderXGroupIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShareholderXGroupIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
