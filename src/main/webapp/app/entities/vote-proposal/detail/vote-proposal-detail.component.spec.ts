import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoteProposalDetailComponent } from './vote-proposal-detail.component';

describe('VoteProposal Management Detail Component', () => {
  let comp: VoteProposalDetailComponent;
  let fixture: ComponentFixture<VoteProposalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoteProposalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voteProposal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VoteProposalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoteProposalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voteProposal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voteProposal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
