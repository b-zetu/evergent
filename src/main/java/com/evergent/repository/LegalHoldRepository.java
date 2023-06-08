package com.evergent.repository;

import com.evergent.domain.LegalHold;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LegalHold entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LegalHoldRepository extends JpaRepository<LegalHold, Long> {}
