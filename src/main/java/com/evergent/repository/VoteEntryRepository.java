package com.evergent.repository;

import com.evergent.domain.VoteEntry;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VoteEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoteEntryRepository extends JpaRepository<VoteEntry, Long> {}
