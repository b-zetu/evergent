import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShareholderXInheritanceDetailComponent } from './shareholder-x-inheritance-detail.component';

describe('ShareholderXInheritance Management Detail Component', () => {
  let comp: ShareholderXInheritanceDetailComponent;
  let fixture: ComponentFixture<ShareholderXInheritanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareholderXInheritanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shareholderXInheritance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShareholderXInheritanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShareholderXInheritanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shareholderXInheritance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shareholderXInheritance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
