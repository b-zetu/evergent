import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteEntryXVoteOptionDetailComponent } from './vote-entry-x-vote-option-detail.component';

describe('VoteEntryXVoteOption Management Detail Component', () => {
  let comp: VoteEntryXVoteOptionDetailComponent;
  let fixture: ComponentFixture<VoteEntryXVoteOptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteEntryXVoteOptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voteEntryXVoteOption: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VoteEntryXVoteOptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoteEntryXVoteOptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voteEntryXVoteOption on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voteEntryXVoteOption).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
