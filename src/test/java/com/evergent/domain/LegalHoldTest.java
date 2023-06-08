package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LegalHoldTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LegalHold.class);
        LegalHold legalHold1 = new LegalHold();
        legalHold1.setId(1L);
        LegalHold legalHold2 = new LegalHold();
        legalHold2.setId(legalHold1.getId());
        assertThat(legalHold1).isEqualTo(legalHold2);
        legalHold2.setId(2L);
        assertThat(legalHold1).isNotEqualTo(legalHold2);
        legalHold1.setId(null);
        assertThat(legalHold1).isNotEqualTo(legalHold2);
    }
}
