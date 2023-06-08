package com.evergent.repository;

import com.evergent.domain.ShareholderXGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShareholderXGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShareholderXGroupRepository extends JpaRepository<ShareholderXGroup, Long> {}
