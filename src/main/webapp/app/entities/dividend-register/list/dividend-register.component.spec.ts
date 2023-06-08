import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DividendRegisterService } from '../service/dividend-register.service';

import { DividendRegisterComponent } from './dividend-register.component';

describe('DividendRegister Management Component', () => {
  let comp: DividendRegisterComponent;
  let fixture: ComponentFixture<DividendRegisterComponent>;
  let service: DividendRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'dividend-register', component: DividendRegisterComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DividendRegisterComponent],
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
      .overrideTemplate(DividendRegisterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendRegisterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DividendRegisterService);

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
    expect(comp.dividendRegisters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to dividendRegisterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDividendRegisterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDividendRegisterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
