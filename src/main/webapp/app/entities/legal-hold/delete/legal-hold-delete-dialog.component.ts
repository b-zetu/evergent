import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalHold } from '../legal-hold.model';
import { LegalHoldService } from '../service/legal-hold.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './legal-hold-delete-dialog.component.html',
})
export class LegalHoldDeleteDialogComponent {
  legalHold?: ILegalHold;

  constructor(protected legalHoldService: LegalHoldService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.legalHoldService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
