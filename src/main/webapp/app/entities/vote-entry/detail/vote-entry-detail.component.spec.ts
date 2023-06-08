import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteEntryDetailComponent } from './vote-entry-detail.component';

describe('VoteEntry Management Detail Component', () => {
  let comp: VoteEntryDetailComponent;
  let fixture: ComponentFixture<VoteEntryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteEntryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voteEntry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VoteEntryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoteEntryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voteEntry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voteEntry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
