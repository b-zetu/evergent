import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DividendRegisterDetailComponent } from './dividend-register-detail.component';

describe('DividendRegister Management Detail Component', () => {
  let comp: DividendRegisterDetailComponent;
  let fixture: ComponentFixture<DividendRegisterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DividendRegisterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dividendRegister: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DividendRegisterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DividendRegisterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dividendRegister on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dividendRegister).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
