import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteOptionDetailComponent } from './vote-option-detail.component';

describe('VoteOption Management Detail Component', () => {
  let comp: VoteOptionDetailComponent;
  let fixture: ComponentFixture<VoteOptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteOptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voteOption: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VoteOptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoteOptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voteOption on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voteOption).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
