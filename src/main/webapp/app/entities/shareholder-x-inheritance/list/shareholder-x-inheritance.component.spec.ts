import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShareholderXInheritanceService } from '../service/shareholder-x-inheritance.service';

import { ShareholderXInheritanceComponent } from './shareholder-x-inheritance.component';

describe('ShareholderXInheritance Management Component', () => {
  let comp: ShareholderXInheritanceComponent;
  let fixture: ComponentFixture<ShareholderXInheritanceComponent>;
  let service: ShareholderXInheritanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'shareholder-x-inheritance', component: ShareholderXInheritanceComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ShareholderXInheritanceComponent],
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
      .overrideTemplate(ShareholderXInheritanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderXInheritanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShareholderXInheritanceService);

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
    expect(comp.shareholderXInheritances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shareholderXInheritanceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShareholderXInheritanceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShareholderXInheritanceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
