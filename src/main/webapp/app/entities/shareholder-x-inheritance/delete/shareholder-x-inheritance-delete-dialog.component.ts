import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShareholderXInheritance } from '../shareholder-x-inheritance.model';
import { ShareholderXInheritanceService } from '../service/shareholder-x-inheritance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './shareholder-x-inheritance-delete-dialog.component.html',
})
export class ShareholderXInheritanceDeleteDialogComponent {
  shareholderXInheritance?: IShareholderXInheritance;

  constructor(protected shareholderXInheritanceService: ShareholderXInheritanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shareholderXInheritanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
