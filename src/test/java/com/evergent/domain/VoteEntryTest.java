package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VoteEntryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VoteEntry.class);
        VoteEntry voteEntry1 = new VoteEntry();
        voteEntry1.setId(1L);
        VoteEntry voteEntry2 = new VoteEntry();
        voteEntry2.setId(voteEntry1.getId());
        assertThat(voteEntry1).isEqualTo(voteEntry2);
        voteEntry2.setId(2L);
        assertThat(voteEntry1).isNotEqualTo(voteEntry2);
        voteEntry1.setId(null);
        assertThat(voteEntry1).isNotEqualTo(voteEntry2);
    }
}
