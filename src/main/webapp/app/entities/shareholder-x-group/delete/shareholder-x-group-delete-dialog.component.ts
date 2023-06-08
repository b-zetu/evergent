import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShareholderXGroup } from '../shareholder-x-group.model';
import { ShareholderXGroupService } from '../service/shareholder-x-group.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './shareholder-x-group-delete-dialog.component.html',
})
export class ShareholderXGroupDeleteDialogComponent {
  shareholderXGroup?: IShareholderXGroup;

  constructor(protected shareholderXGroupService: ShareholderXGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shareholderXGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
