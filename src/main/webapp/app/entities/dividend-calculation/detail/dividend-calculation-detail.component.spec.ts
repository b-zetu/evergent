import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DividendCalculationDetailComponent } from './dividend-calculation-detail.component';

describe('DividendCalculation Management Detail Component', () => {
  let comp: DividendCalculationDetailComponent;
  let fixture: ComponentFixture<DividendCalculationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DividendCalculationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dividendCalculation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DividendCalculationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DividendCalculationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dividendCalculation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dividendCalculation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
