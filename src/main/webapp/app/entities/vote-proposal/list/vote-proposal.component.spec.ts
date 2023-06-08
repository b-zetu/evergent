import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoteProposalService } from '../service/vote-proposal.service';

import { VoteProposalComponent } from './vote-proposal.component';

describe('VoteProposal Management Component', () => {
  let comp: VoteProposalComponent;
  let fixture: ComponentFixture<VoteProposalComponent>;
  let service: VoteProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vote-proposal', component: VoteProposalComponent }]), HttpClientTestingModule],
      declarations: [VoteProposalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VoteProposalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteProposalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoteProposalService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.voteProposals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to voteProposalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVoteProposalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVoteProposalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
