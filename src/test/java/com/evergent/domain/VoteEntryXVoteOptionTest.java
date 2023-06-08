package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VoteEntryXVoteOptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VoteEntryXVoteOption.class);
        VoteEntryXVoteOption voteEntryXVoteOption1 = new VoteEntryXVoteOption();
        voteEntryXVoteOption1.setId(1L);
        VoteEntryXVoteOption voteEntryXVoteOption2 = new VoteEntryXVoteOption();
        voteEntryXVoteOption2.setId(voteEntryXVoteOption1.getId());
        assertThat(voteEntryXVoteOption1).isEqualTo(voteEntryXVoteOption2);
        voteEntryXVoteOption2.setId(2L);
        assertThat(voteEntryXVoteOption1).isNotEqualTo(voteEntryXVoteOption2);
        voteEntryXVoteOption1.setId(null);
        assertThat(voteEntryXVoteOption1).isNotEqualTo(voteEntryXVoteOption2);
    }
}
