import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShareholderXGroupDetailComponent } from './shareholder-x-group-detail.component';

describe('ShareholderXGroup Management Detail Component', () => {
  let comp: ShareholderXGroupDetailComponent;
  let fixture: ComponentFixture<ShareholderXGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareholderXGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shareholderXGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShareholderXGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShareholderXGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shareholderXGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shareholderXGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
