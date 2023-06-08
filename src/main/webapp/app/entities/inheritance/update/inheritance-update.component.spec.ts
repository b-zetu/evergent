import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InheritanceFormService } from './inheritance-form.service';
import { InheritanceService } from '../service/inheritance.service';
import { IInheritance } from '../inheritance.model';

import { InheritanceUpdateComponent } from './inheritance-update.component';

describe('Inheritance Management Update Component', () => {
  let comp: InheritanceUpdateComponent;
  let fixture: ComponentFixture<InheritanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inheritanceFormService: InheritanceFormService;
  let inheritanceService: InheritanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InheritanceUpdateComponent],
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
      .overrideTemplate(InheritanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InheritanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inheritanceFormService = TestBed.inject(InheritanceFormService);
    inheritanceService = TestBed.inject(InheritanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const inheritance: IInheritance = { id: 456 };

      activatedRoute.data = of({ inheritance });
      comp.ngOnInit();

      expect(comp.inheritance).toEqual(inheritance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInheritance>>();
      const inheritance = { id: 123 };
      jest.spyOn(inheritanceFormService, 'getInheritance').mockReturnValue(inheritance);
      jest.spyOn(inheritanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inheritance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inheritance }));
      saveSubject.complete();

      // THEN
      expect(inheritanceFormService.getInheritance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inheritanceService.update).toHaveBeenCalledWith(expect.objectContaining(inheritance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInheritance>>();
      const inheritance = { id: 123 };
      jest.spyOn(inheritanceFormService, 'getInheritance').mockReturnValue({ id: null });
      jest.spyOn(inheritanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inheritance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inheritance }));
      saveSubject.complete();

      // THEN
      expect(inheritanceFormService.getInheritance).toHaveBeenCalled();
      expect(inheritanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInheritance>>();
      const inheritance = { id: 123 };
      jest.spyOn(inheritanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inheritance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inheritanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
