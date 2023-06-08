import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoteEntry } from '../vote-entry.model';
import { VoteEntryService } from '../service/vote-entry.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vote-entry-delete-dialog.component.html',
})
export class VoteEntryDeleteDialogComponent {
  voteEntry?: IVoteEntry;

  constructor(protected voteEntryService: VoteEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voteEntryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
