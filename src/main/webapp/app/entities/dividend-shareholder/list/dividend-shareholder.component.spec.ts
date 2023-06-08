import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DividendShareholderService } from '../service/dividend-shareholder.service';

import { DividendShareholderComponent } from './dividend-shareholder.component';

describe('DividendShareholder Management Component', () => {
  let comp: DividendShareholderComponent;
  let fixture: ComponentFixture<DividendShareholderComponent>;
  let service: DividendShareholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'dividend-shareholder', component: DividendShareholderComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DividendShareholderComponent],
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
      .overrideTemplate(DividendShareholderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendShareholderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DividendShareholderService);

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
    expect(comp.dividendShareholders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to dividendShareholderService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDividendShareholderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDividendShareholderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
