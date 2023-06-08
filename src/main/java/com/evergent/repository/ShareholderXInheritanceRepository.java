package com.evergent.repository;

import com.evergent.domain.ShareholderXInheritance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShareholderXInheritance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShareholderXInheritanceRepository extends JpaRepository<ShareholderXInheritance, Long> {}
