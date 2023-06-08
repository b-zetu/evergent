import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDividendCalculation } from '../dividend-calculation.model';
import { DividendCalculationService } from '../service/dividend-calculation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dividend-calculation-delete-dialog.component.html',
})
export class DividendCalculationDeleteDialogComponent {
  dividendCalculation?: IDividendCalculation;

  constructor(protected dividendCalculationService: DividendCalculationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dividendCalculationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
