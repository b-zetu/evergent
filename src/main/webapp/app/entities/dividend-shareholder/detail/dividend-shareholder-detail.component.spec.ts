import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DividendShareholderDetailComponent } from './dividend-shareholder-detail.component';

describe('DividendShareholder Management Detail Component', () => {
  let comp: DividendShareholderDetailComponent;
  let fixture: ComponentFixture<DividendShareholderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DividendShareholderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dividendShareholder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DividendShareholderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DividendShareholderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dividendShareholder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dividendShareholder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
