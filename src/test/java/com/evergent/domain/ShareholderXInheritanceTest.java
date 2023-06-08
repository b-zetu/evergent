package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShareholderXInheritanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShareholderXInheritance.class);
        ShareholderXInheritance shareholderXInheritance1 = new ShareholderXInheritance();
        shareholderXInheritance1.setId(1L);
        ShareholderXInheritance shareholderXInheritance2 = new ShareholderXInheritance();
        shareholderXInheritance2.setId(shareholderXInheritance1.getId());
        assertThat(shareholderXInheritance1).isEqualTo(shareholderXInheritance2);
        shareholderXInheritance2.setId(2L);
        assertThat(shareholderXInheritance1).isNotEqualTo(shareholderXInheritance2);
        shareholderXInheritance1.setId(null);
        assertThat(shareholderXInheritance1).isNotEqualTo(shareholderXInheritance2);
    }
}
