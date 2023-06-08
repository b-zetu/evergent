import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InheritanceDetailComponent } from './inheritance-detail.component';

describe('Inheritance Management Detail Component', () => {
  let comp: InheritanceDetailComponent;
  let fixture: ComponentFixture<InheritanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InheritanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ inheritance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InheritanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InheritanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load inheritance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.inheritance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
