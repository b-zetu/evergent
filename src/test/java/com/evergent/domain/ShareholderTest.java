package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShareholderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Shareholder.class);
        Shareholder shareholder1 = new Shareholder();
        shareholder1.setId(1L);
        Shareholder shareholder2 = new Shareholder();
        shareholder2.setId(shareholder1.getId());
        assertThat(shareholder1).isEqualTo(shareholder2);
        shareholder2.setId(2L);
        assertThat(shareholder1).isNotEqualTo(shareholder2);
        shareholder1.setId(null);
        assertThat(shareholder1).isNotEqualTo(shareholder2);
    }
}
