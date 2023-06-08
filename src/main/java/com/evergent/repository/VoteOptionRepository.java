package com.evergent.repository;

import com.evergent.domain.VoteOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VoteOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoteOptionRepository extends JpaRepository<VoteOption, Long> {}
