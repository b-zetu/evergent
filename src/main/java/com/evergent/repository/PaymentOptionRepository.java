package com.evergent.repository;

import com.evergent.domain.PaymentOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PaymentOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentOptionRepository extends JpaRepository<PaymentOption, Long> {}
