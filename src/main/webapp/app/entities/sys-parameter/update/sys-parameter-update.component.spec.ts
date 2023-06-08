import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SysParameterFormService } from './sys-parameter-form.service';
import { SysParameterService } from '../service/sys-parameter.service';
import { ISysParameter } from '../sys-parameter.model';

import { SysParameterUpdateComponent } from './sys-parameter-update.component';

describe('SysParameter Management Update Component', () => {
  let comp: SysParameterUpdateComponent;
  let fixture: ComponentFixture<SysParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sysParameterFormService: SysParameterFormService;
  let sysParameterService: SysParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SysParameterUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SysParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SysParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sysParameterFormService = TestBed.inject(SysParameterFormService);
    sysParameterService = TestBed.inject(SysParameterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sysParameter: ISysParameter = { id: 456 };

      activatedRoute.data = of({ sysParameter });
      comp.ngOnInit();

      expect(comp.sysParameter).toEqual(sysParameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISysParameter>>();
      const sysParameter = { id: 123 };
      jest.spyOn(sysParameterFormService, 'getSysParameter').mockReturnValue(sysParameter);
      jest.spyOn(sysParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sysParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sysParameter }));
      saveSubject.complete();

      // THEN
      expect(sysParameterFormService.getSysParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sysParameterService.update).toHaveBeenCalledWith(expect.objectContaining(sysParameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISysParameter>>();
      const sysParameter = { id: 123 };
      jest.spyOn(sysParameterFormService, 'getSysParameter').mockReturnValue({ id: null });
      jest.spyOn(sysParameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sysParameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sysParameter }));
      saveSubject.complete();

      // THEN
      expect(sysParameterFormService.getSysParameter).toHaveBeenCalled();
      expect(sysParameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISysParameter>>();
      const sysParameter = { id: 123 };
      jest.spyOn(sysParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sysParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sysParameterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
