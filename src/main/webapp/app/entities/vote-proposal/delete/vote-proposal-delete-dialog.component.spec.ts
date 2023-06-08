jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VoteProposalService } from '../service/vote-proposal.service';

import { VoteProposalDeleteDialogComponent } from './vote-proposal-delete-dialog.component';

describe('VoteProposal Management Delete Component', () => {
  let comp: VoteProposalDeleteDialogComponent;
  let fixture: ComponentFixture<VoteProposalDeleteDialogComponent>;
  let service: VoteProposalService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VoteProposalDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(VoteProposalDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoteProposalDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoteProposalService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
