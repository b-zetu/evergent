import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDividendRegister } from '../dividend-register.model';
import { DividendRegisterService } from '../service/dividend-register.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dividend-register-delete-dialog.component.html',
})
export class DividendRegisterDeleteDialogComponent {
  dividendRegister?: IDividendRegister;

  constructor(protected dividendRegisterService: DividendRegisterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dividendRegisterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
