import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SysParameterService } from '../service/sys-parameter.service';

import { SysParameterComponent } from './sys-parameter.component';

describe('SysParameter Management Component', () => {
  let comp: SysParameterComponent;
  let fixture: ComponentFixture<SysParameterComponent>;
  let service: SysParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sys-parameter', component: SysParameterComponent }]), HttpClientTestingModule],
      declarations: [SysParameterComponent],
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
      .overrideTemplate(SysParameterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SysParameterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SysParameterService);

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
    expect(comp.sysParameters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to sysParameterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSysParameterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSysParameterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
