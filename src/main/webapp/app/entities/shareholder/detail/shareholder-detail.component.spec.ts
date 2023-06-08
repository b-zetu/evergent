import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShareholderDetailComponent } from './shareholder-detail.component';

describe('Shareholder Management Detail Component', () => {
  let comp: ShareholderDetailComponent;
  let fixture: ComponentFixture<ShareholderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareholderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shareholder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShareholderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShareholderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shareholder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shareholder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
