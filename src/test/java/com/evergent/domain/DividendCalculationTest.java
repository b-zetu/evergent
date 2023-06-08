package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DividendCalculationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DividendCalculation.class);
        DividendCalculation dividendCalculation1 = new DividendCalculation();
        dividendCalculation1.setId(1L);
        DividendCalculation dividendCalculation2 = new DividendCalculation();
        dividendCalculation2.setId(dividendCalculation1.getId());
        assertThat(dividendCalculation1).isEqualTo(dividendCalculation2);
        dividendCalculation2.setId(2L);
        assertThat(dividendCalculation1).isNotEqualTo(dividendCalculation2);
        dividendCalculation1.setId(null);
        assertThat(dividendCalculation1).isNotEqualTo(dividendCalculation2);
    }
}
