import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDividendShareholder } from '../dividend-shareholder.model';
import { DividendShareholderService } from '../service/dividend-shareholder.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dividend-shareholder-delete-dialog.component.html',
})
export class DividendShareholderDeleteDialogComponent {
  dividendShareholder?: IDividendShareholder;

  constructor(protected dividendShareholderService: DividendShareholderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dividendShareholderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
