package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SysParameterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SysParameter.class);
        SysParameter sysParameter1 = new SysParameter();
        sysParameter1.setId(1L);
        SysParameter sysParameter2 = new SysParameter();
        sysParameter2.setId(sysParameter1.getId());
        assertThat(sysParameter1).isEqualTo(sysParameter2);
        sysParameter2.setId(2L);
        assertThat(sysParameter1).isNotEqualTo(sysParameter2);
        sysParameter1.setId(null);
        assertThat(sysParameter1).isNotEqualTo(sysParameter2);
    }
}
