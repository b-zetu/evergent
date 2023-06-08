package com.evergent.repository;

import com.evergent.domain.VoteProposal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VoteProposal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoteProposalRepository extends JpaRepository<VoteProposal, Long> {}
