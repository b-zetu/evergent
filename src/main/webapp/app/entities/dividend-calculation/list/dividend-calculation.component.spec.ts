import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DividendCalculationService } from '../service/dividend-calculation.service';

import { DividendCalculationComponent } from './dividend-calculation.component';

describe('DividendCalculation Management Component', () => {
  let comp: DividendCalculationComponent;
  let fixture: ComponentFixture<DividendCalculationComponent>;
  let service: DividendCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'dividend-calculation', component: DividendCalculationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DividendCalculationComponent],
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
      .overrideTemplate(DividendCalculationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendCalculationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DividendCalculationService);

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
    expect(comp.dividendCalculations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to dividendCalculationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDividendCalculationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDividendCalculationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
