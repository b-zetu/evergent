import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoteOptionService } from '../service/vote-option.service';

import { VoteOptionComponent } from './vote-option.component';

describe('VoteOption Management Component', () => {
  let comp: VoteOptionComponent;
  let fixture: ComponentFixture<VoteOptionComponent>;
  let service: VoteOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vote-option', component: VoteOptionComponent }]), HttpClientTestingModule],
      declarations: [VoteOptionComponent],
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
      .overrideTemplate(VoteOptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteOptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoteOptionService);

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
    expect(comp.voteOptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to voteOptionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVoteOptionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVoteOptionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
