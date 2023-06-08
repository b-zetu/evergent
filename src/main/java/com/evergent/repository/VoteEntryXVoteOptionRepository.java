package com.evergent.repository;

import com.evergent.domain.VoteEntryXVoteOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VoteEntryXVoteOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoteEntryXVoteOptionRepository extends JpaRepository<VoteEntryXVoteOption, Long> {}
