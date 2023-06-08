import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoteEntryService } from '../service/vote-entry.service';

import { VoteEntryComponent } from './vote-entry.component';

describe('VoteEntry Management Component', () => {
  let comp: VoteEntryComponent;
  let fixture: ComponentFixture<VoteEntryComponent>;
  let service: VoteEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vote-entry', component: VoteEntryComponent }]), HttpClientTestingModule],
      declarations: [VoteEntryComponent],
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
      .overrideTemplate(VoteEntryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteEntryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoteEntryService);

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
    expect(comp.voteEntries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to voteEntryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVoteEntryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVoteEntryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
