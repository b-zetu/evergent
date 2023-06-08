package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DividendRegisterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DividendRegister.class);
        DividendRegister dividendRegister1 = new DividendRegister();
        dividendRegister1.setId(1L);
        DividendRegister dividendRegister2 = new DividendRegister();
        dividendRegister2.setId(dividendRegister1.getId());
        assertThat(dividendRegister1).isEqualTo(dividendRegister2);
        dividendRegister2.setId(2L);
        assertThat(dividendRegister1).isNotEqualTo(dividendRegister2);
        dividendRegister1.setId(null);
        assertThat(dividendRegister1).isNotEqualTo(dividendRegister2);
    }
}
