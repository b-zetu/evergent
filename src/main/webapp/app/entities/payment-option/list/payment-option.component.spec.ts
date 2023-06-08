import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaymentOptionService } from '../service/payment-option.service';

import { PaymentOptionComponent } from './payment-option.component';

describe('PaymentOption Management Component', () => {
  let comp: PaymentOptionComponent;
  let fixture: ComponentFixture<PaymentOptionComponent>;
  let service: PaymentOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'payment-option', component: PaymentOptionComponent }]), HttpClientTestingModule],
      declarations: [PaymentOptionComponent],
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
      .overrideTemplate(PaymentOptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentOptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PaymentOptionService);

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
    expect(comp.paymentOptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to paymentOptionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPaymentOptionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPaymentOptionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
