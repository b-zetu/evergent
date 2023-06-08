package com.evergent.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.evergent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShareholderXGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShareholderXGroup.class);
        ShareholderXGroup shareholderXGroup1 = new ShareholderXGroup();
        shareholderXGroup1.setId(1L);
        ShareholderXGroup shareholderXGroup2 = new ShareholderXGroup();
        shareholderXGroup2.setId(shareholderXGroup1.getId());
        assertThat(shareholderXGroup1).isEqualTo(shareholderXGroup2);
        shareholderXGroup2.setId(2L);
        assertThat(shareholderXGroup1).isNotEqualTo(shareholderXGroup2);
        shareholderXGroup1.setId(null);
        assertThat(shareholderXGroup1).isNotEqualTo(shareholderXGroup2);
    }
}
