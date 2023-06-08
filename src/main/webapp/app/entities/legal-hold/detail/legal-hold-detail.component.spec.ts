import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LegalHoldDetailComponent } from './legal-hold-detail.component';

describe('LegalHold Management Detail Component', () => {
  let comp: LegalHoldDetailComponent;
  let fixture: ComponentFixture<LegalHoldDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalHoldDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ legalHold: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LegalHoldDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LegalHoldDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load legalHold on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.legalHold).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
