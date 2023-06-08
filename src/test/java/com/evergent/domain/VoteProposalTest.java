package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VoteProposalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VoteProposal.class);
        VoteProposal voteProposal1 = new VoteProposal();
        voteProposal1.setId(1L);
        VoteProposal voteProposal2 = new VoteProposal();
        voteProposal2.setId(voteProposal1.getId());
        assertThat(voteProposal1).isEqualTo(voteProposal2);
        voteProposal2.setId(2L);
        assertThat(voteProposal1).isNotEqualTo(voteProposal2);
        voteProposal1.setId(null);
        assertThat(voteProposal1).isNotEqualTo(voteProposal2);
    }
}
