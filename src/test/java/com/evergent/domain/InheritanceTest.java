package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InheritanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inheritance.class);
        Inheritance inheritance1 = new Inheritance();
        inheritance1.setId(1L);
        Inheritance inheritance2 = new Inheritance();
        inheritance2.setId(inheritance1.getId());
        assertThat(inheritance1).isEqualTo(inheritance2);
        inheritance2.setId(2L);
        assertThat(inheritance1).isNotEqualTo(inheritance2);
        inheritance1.setId(null);
        assertThat(inheritance1).isNotEqualTo(inheritance2);
    }
}
