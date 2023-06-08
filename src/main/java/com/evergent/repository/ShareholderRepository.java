package com.evergent.repository;

import com.evergent.domain.Shareholder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Shareholder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShareholderRepository extends JpaRepository<Shareholder, Long> {}
