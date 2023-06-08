import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISysParameter } from '../sys-parameter.model';
import { SysParameterService } from '../service/sys-parameter.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sys-parameter-delete-dialog.component.html',
})
export class SysParameterDeleteDialogComponent {
  sysParameter?: ISysParameter;

  constructor(protected sysParameterService: SysParameterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sysParameterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
