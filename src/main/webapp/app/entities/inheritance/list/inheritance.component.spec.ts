import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InheritanceService } from '../service/inheritance.service';

import { InheritanceComponent } from './inheritance.component';

describe('Inheritance Management Component', () => {
  let comp: InheritanceComponent;
  let fixture: ComponentFixture<InheritanceComponent>;
  let service: InheritanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'inheritance', component: InheritanceComponent }]), HttpClientTestingModule],
      declarations: [InheritanceComponent],
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
      .overrideTemplate(InheritanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InheritanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InheritanceService);

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
    expect(comp.inheritances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to inheritanceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInheritanceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInheritanceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
