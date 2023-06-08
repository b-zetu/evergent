import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShareholderXGroupFormService } from './shareholder-x-group-form.service';
import { ShareholderXGroupService } from '../service/shareholder-x-group.service';
import { IShareholderXGroup } from '../shareholder-x-group.model';
import { IShareholder } from 'app/entities/shareholder/shareholder.model';
import { ShareholderService } from 'app/entities/shareholder/service/shareholder.service';
import { IGroup } from 'app/entities/group/group.model';
import { GroupService } from 'app/entities/group/service/group.service';

import { ShareholderXGroupUpdateComponent } from './shareholder-x-group-update.component';

describe('ShareholderXGroup Management Update Component', () => {
  let comp: ShareholderXGroupUpdateComponent;
  let fixture: ComponentFixture<ShareholderXGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shareholderXGroupFormService: ShareholderXGroupFormService;
  let shareholderXGroupService: ShareholderXGroupService;
  let shareholderService: ShareholderService;
  let groupService: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShareholderXGroupUpdateComponent],
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
      .overrideTemplate(ShareholderXGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareholderXGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shareholderXGroupFormService = TestBed.inject(ShareholderXGroupFormService);
    shareholderXGroupService = TestBed.inject(ShareholderXGroupService);
    shareholderService = TestBed.inject(ShareholderService);
    groupService = TestBed.inject(GroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shareholder query and add missing value', () => {
      const shareholderXGroup: IShareholderXGroup = { id: 456 };
      const shareholder: IShareholder = { id: 34158 };
      shareholderXGroup.shareholder = shareholder;

      const shareholderCollection: IShareholder[] = [{ id: 16378 }];
      jest.spyOn(shareholderService, 'query').mockReturnValue(of(new HttpResponse({ body: shareholderCollection })));
      const additionalShareholders = [shareholder];
      const expectedCollection: IShareholder[] = [...additionalShareholders, ...shareholderCollection];
      jest.spyOn(shareholderService, 'addShareholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shareholderXGroup });
      comp.ngOnInit();

      expect(shareholderService.query).toHaveBeenCalled();
      expect(shareholderService.addShareholderToCollectionIfMissing).toHaveBeenCalledWith(
        shareholderCollection,
        ...additionalShareholders.map(expect.objectContaining)
      );
      expect(comp.shareholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Group query and add missing value', () => {
      const shareholderXGroup: IShareholderXGroup = { id: 456 };
      const group: IGroup = { id: 36491 };
      shareholderXGroup.group = group;

      const groupCollection: IGroup[] = [{ id: 87037 }];
      jest.spyOn(groupService, 'query').mockReturnValue(of(new HttpResponse({ body: groupCollection })));
      const additionalGroups = [group];
      const expectedCollection: IGroup[] = [...additionalGroups, ...groupCollection];
      jest.spyOn(groupService, 'addGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shareholderXGroup });
      comp.ngOnInit();

      expect(groupService.query).toHaveBeenCalled();
      expect(groupService.addGroupToCollectionIfMissing).toHaveBeenCalledWith(
        groupCollection,
        ...additionalGroups.map(expect.objectContaining)
      );
      expect(comp.groupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shareholderXGroup: IShareholderXGroup = { id: 456 };
      const shareholder: IShareholder = { id: 58054 };
      shareholderXGroup.shareholder = shareholder;
      const group: IGroup = { id: 55785 };
      shareholderXGroup.group = group;

      activatedRoute.data = of({ shareholderXGroup });
      comp.ngOnInit();

      expect(comp.shareholdersSharedCollection).toContain(shareholder);
      expect(comp.groupsSharedCollection).toContain(group);
      expect(comp.shareholderXGroup).toEqual(shareholderXGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXGroup>>();
      const shareholderXGroup = { id: 123 };
      jest.spyOn(shareholderXGroupFormService, 'getShareholderXGroup').mockReturnValue(shareholderXGroup);
      jest.spyOn(shareholderXGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholderXGroup }));
      saveSubject.complete();

      // THEN
      expect(shareholderXGroupFormService.getShareholderXGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shareholderXGroupService.update).toHaveBeenCalledWith(expect.objectContaining(shareholderXGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXGroup>>();
      const shareholderXGroup = { id: 123 };
      jest.spyOn(shareholderXGroupFormService, 'getShareholderXGroup').mockReturnValue({ id: null });
      jest.spyOn(shareholderXGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shareholderXGroup }));
      saveSubject.complete();

      // THEN
      expect(shareholderXGroupFormService.getShareholderXGroup).toHaveBeenCalled();
      expect(shareholderXGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShareholderXGroup>>();
      const shareholderXGroup = { id: 123 };
      jest.spyOn(shareholderXGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shareholderXGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shareholderXGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareShareholder', () => {
      it('Should forward to shareholderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shareholderService, 'compareShareholder');
        comp.compareShareholder(entity, entity2);
        expect(shareholderService.compareShareholder).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGroup', () => {
      it('Should forward to groupService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupService, 'compareGroup');
        comp.compareGroup(entity, entity2);
        expect(groupService.compareGroup).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
