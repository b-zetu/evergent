import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInheritance } from '../inheritance.model';
import { InheritanceService } from '../service/inheritance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './inheritance-delete-dialog.component.html',
})
export class InheritanceDeleteDialogComponent {
  inheritance?: IInheritance;

  constructor(protected inheritanceService: InheritanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inheritanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
