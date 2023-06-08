package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VoteOptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VoteOption.class);
        VoteOption voteOption1 = new VoteOption();
        voteOption1.setId(1L);
        VoteOption voteOption2 = new VoteOption();
        voteOption2.setId(voteOption1.getId());
        assertThat(voteOption1).isEqualTo(voteOption2);
        voteOption2.setId(2L);
        assertThat(voteOption1).isNotEqualTo(voteOption2);
        voteOption1.setId(null);
        assertThat(voteOption1).isNotEqualTo(voteOption2);
    }
}
