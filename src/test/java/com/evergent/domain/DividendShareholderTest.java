package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DividendShareholderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DividendShareholder.class);
        DividendShareholder dividendShareholder1 = new DividendShareholder();
        dividendShareholder1.setId(1L);
        DividendShareholder dividendShareholder2 = new DividendShareholder();
        dividendShareholder2.setId(dividendShareholder1.getId());
        assertThat(dividendShareholder1).isEqualTo(dividendShareholder2);
        dividendShareholder2.setId(2L);
        assertThat(dividendShareholder1).isNotEqualTo(dividendShareholder2);
        dividendShareholder1.setId(null);
        assertThat(dividendShareholder1).isNotEqualTo(dividendShareholder2);
    }
}
