import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ShareholderService } from '../service/shareholder.service';

import { ShareholderComponent } from './shareholder.component';

describe('Shareholder Management Component', () => {
  let comp: ShareholderComponent;
  let fixture: ComponentFixture<ShareholderComponent>;
  let service: ShareholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'shareholder', component: ShareholderComponent }]), HttpClientTestingModule],
      declarations: [ShareholderComponent],
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
      .overrideTemplate(ShareholderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShareholderService);

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
    expect(comp.shareholders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to shareholderService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getShareholderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getShareholderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
