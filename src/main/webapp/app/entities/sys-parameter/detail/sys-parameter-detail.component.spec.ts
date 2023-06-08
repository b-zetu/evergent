import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SysParameterDetailComponent } from './sys-parameter-detail.component';

describe('SysParameter Management Detail Component', () => {
  let comp: SysParameterDetailComponent;
  let fixture: ComponentFixture<SysParameterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SysParameterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sysParameter: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SysParameterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SysParameterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sysParameter on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sysParameter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
