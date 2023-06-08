import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DividendRegisterFormService } from './dividend-register-form.service';
import { DividendRegisterService } from '../service/dividend-register.service';
import { IDividendRegister } from '../dividend-register.model';

import { DividendRegisterUpdateComponent } from './dividend-register-update.component';

describe('DividendRegister Management Update Component', () => {
  let comp: DividendRegisterUpdateComponent;
  let fixture: ComponentFixture<DividendRegisterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dividendRegisterFormService: DividendRegisterFormService;
  let dividendRegisterService: DividendRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DividendRegisterUpdateComponent],
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
      .overrideTemplate(DividendRegisterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DividendRegisterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dividendRegisterFormService = TestBed.inject(DividendRegisterFormService);
    dividendRegisterService = TestBed.inject(DividendRegisterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const dividendRegister: IDividendRegister = { id: 456 };

      activatedRoute.data = of({ dividendRegister });
      comp.ngOnInit();

      expect(comp.dividendRegister).toEqual(dividendRegister);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendRegister>>();
      const dividendRegister = { id: 123 };
      jest.spyOn(dividendRegisterFormService, 'getDividendRegister').mockReturnValue(dividendRegister);
      jest.spyOn(dividendRegisterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendRegister });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendRegister }));
      saveSubject.complete();

      // THEN
      expect(dividendRegisterFormService.getDividendRegister).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dividendRegisterService.update).toHaveBeenCalledWith(expect.objectContaining(dividendRegister));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendRegister>>();
      const dividendRegister = { id: 123 };
      jest.spyOn(dividendRegisterFormService, 'getDividendRegister').mockReturnValue({ id: null });
      jest.spyOn(dividendRegisterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendRegister: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dividendRegister }));
      saveSubject.complete();

      // THEN
      expect(dividendRegisterFormService.getDividendRegister).toHaveBeenCalled();
      expect(dividendRegisterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDividendRegister>>();
      const dividendRegister = { id: 123 };
      jest.spyOn(dividendRegisterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dividendRegister });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dividendRegisterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
