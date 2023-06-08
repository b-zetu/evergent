import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoteOption } from '../vote-option.model';
import { VoteOptionService } from '../service/vote-option.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vote-option-delete-dialog.component.html',
})
export class VoteOptionDeleteDialogComponent {
  voteOption?: IVoteOption;

  constructor(protected voteOptionService: VoteOptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voteOptionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
