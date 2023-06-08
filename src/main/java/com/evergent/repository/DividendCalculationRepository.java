package com.evergent.repository;

import com.evergent.domain.DividendCalculation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DividendCalculation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DividendCalculationRepository extends JpaRepository<DividendCalculation, Long> {}
