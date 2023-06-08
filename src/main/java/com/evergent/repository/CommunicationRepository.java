package com.evergent.repository;

import com.evergent.domain.Communication;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Communication entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Long> {}
