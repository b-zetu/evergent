package com.evergent.repository;

import com.evergent.domain.DividendRegister;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DividendRegister entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DividendRegisterRepository extends JpaRepository<DividendRegister, Long> {}
