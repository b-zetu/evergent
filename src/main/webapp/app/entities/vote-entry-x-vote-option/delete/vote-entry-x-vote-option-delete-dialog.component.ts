import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoteEntryXVoteOption } from '../vote-entry-x-vote-option.model';
import { VoteEntryXVoteOptionService } from '../service/vote-entry-x-vote-option.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vote-entry-x-vote-option-delete-dialog.component.html',
})
export class VoteEntryXVoteOptionDeleteDialogComponent {
  voteEntryXVoteOption?: IVoteEntryXVoteOption;

  constructor(protected voteEntryXVoteOptionService: VoteEntryXVoteOptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voteEntryXVoteOptionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
