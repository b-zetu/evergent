package com.evergent.repository;

import com.evergent.domain.Inheritance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Inheritance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InheritanceRepository extends JpaRepository<Inheritance, Long> {}
