import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShareholder } from '../shareholder.model';
import { ShareholderService } from '../service/shareholder.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './shareholder-delete-dialog.component.html',
})
export class ShareholderDeleteDialogComponent {
  shareholder?: IShareholder;

  constructor(protected shareholderService: ShareholderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shareholderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
