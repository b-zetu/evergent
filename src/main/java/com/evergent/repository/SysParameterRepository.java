package com.evergent.repository;

import com.evergent.domain.SysParameter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SysParameter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SysParameterRepository extends JpaRepository<SysParameter, Long> {}
