import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommunicationService } from '../service/communication.service';

import { CommunicationComponent } from './communication.component';

describe('Communication Management Component', () => {
  let comp: CommunicationComponent;
  let fixture: ComponentFixture<CommunicationComponent>;
  let service: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'communication', component: CommunicationComponent }]), HttpClientTestingModule],
      declarations: [CommunicationComponent],
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
      .overrideTemplate(CommunicationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommunicationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommunicationService);

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
    expect(comp.communications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to communicationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCommunicationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCommunicationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
