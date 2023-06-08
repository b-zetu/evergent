import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoteProposal } from '../vote-proposal.model';
import { VoteProposalService } from '../service/vote-proposal.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vote-proposal-delete-dialog.component.html',
})
export class VoteProposalDeleteDialogComponent {
  voteProposal?: IVoteProposal;

  constructor(protected voteProposalService: VoteProposalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voteProposalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
