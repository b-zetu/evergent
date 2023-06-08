package com.evergent.repository;

import com.evergent.domain.DividendShareholder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DividendShareholder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DividendShareholderRepository extends JpaRepository<DividendShareholder, Long> {}
