import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommunicationDetailComponent } from './communication-detail.component';

describe('Communication Management Detail Component', () => {
  let comp: CommunicationDetailComponent;
  let fixture: ComponentFixture<CommunicationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ communication: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CommunicationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CommunicationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load communication on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.communication).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
