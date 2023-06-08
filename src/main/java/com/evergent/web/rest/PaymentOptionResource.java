package com.evergent.web.rest;

import com.evergent.domain.PaymentOption;
import com.evergent.repository.PaymentOptionRepository;
import com.evergent.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.evergent.domain.PaymentOption}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PaymentOptionResource {

    private final Logger log = LoggerFactory.getLogger(PaymentOptionResource.class);

    private static final String ENTITY_NAME = "paymentOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentOptionRepository paymentOptionRepository;

    public PaymentOptionResource(PaymentOptionRepository paymentOptionRepository) {
        this.paymentOptionRepository = paymentOptionRepository;
    }

    /**
     * {@code POST  /payment-options} : Create a new paymentOption.
     *
     * @param paymentOption the paymentOption to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paymentOption, or with status {@code 400 (Bad Request)} if the paymentOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payment-options")
    public ResponseEntity<PaymentOption> createPaymentOption(@RequestBody PaymentOption paymentOption) throws URISyntaxException {
        log.debug("REST request to save PaymentOption : {}", paymentOption);
        if (paymentOption.getId() != null) {
            throw new BadRequestAlertException("A new paymentOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentOption result = paymentOptionRepository.save(paymentOption);
        return ResponseEntity
            .created(new URI("/api/payment-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payment-options/:id} : Updates an existing paymentOption.
     *
     * @param id the id of the paymentOption to save.
     * @param paymentOption the paymentOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentOption,
     * or with status {@code 400 (Bad Request)} if the paymentOption is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paymentOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payment-options/{id}")
    public ResponseEntity<PaymentOption> updatePaymentOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PaymentOption paymentOption
    ) throws URISyntaxException {
        log.debug("REST request to update PaymentOption : {}, {}", id, paymentOption);
        if (paymentOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paymentOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paymentOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PaymentOption result = paymentOptionRepository.save(paymentOption);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentOption.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /payment-options/:id} : Partial updates given fields of an existing paymentOption, field will ignore if it is null
     *
     * @param id the id of the paymentOption to save.
     * @param paymentOption the paymentOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentOption,
     * or with status {@code 400 (Bad Request)} if the paymentOption is not valid,
     * or with status {@code 404 (Not Found)} if the paymentOption is not found,
     * or with status {@code 500 (Internal Server Error)} if the paymentOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/payment-options/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PaymentOption> partialUpdatePaymentOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PaymentOption paymentOption
    ) throws URISyntaxException {
        log.debug("REST request to partial update PaymentOption partially : {}, {}", id, paymentOption);
        if (paymentOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paymentOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paymentOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PaymentOption> result = paymentOptionRepository
            .findById(paymentOption.getId())
            .map(existingPaymentOption -> {
                if (paymentOption.getType() != null) {
                    existingPaymentOption.setType(paymentOption.getType());
                }
                if (paymentOption.getDetail1() != null) {
                    existingPaymentOption.setDetail1(paymentOption.getDetail1());
                }
                if (paymentOption.getDetail2() != null) {
                    existingPaymentOption.setDetail2(paymentOption.getDetail2());
                }

                return existingPaymentOption;
            })
            .map(paymentOptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentOption.getId().toString())
        );
    }

    /**
     * {@code GET  /payment-options} : get all the paymentOptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paymentOptions in body.
     */
    @GetMapping("/payment-options")
    public List<PaymentOption> getAllPaymentOptions() {
        log.debug("REST request to get all PaymentOptions");
        return paymentOptionRepository.findAll();
    }

    /**
     * {@code GET  /payment-options/:id} : get the "id" paymentOption.
     *
     * @param id the id of the paymentOption to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paymentOption, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payment-options/{id}")
    public ResponseEntity<PaymentOption> getPaymentOption(@PathVariable Long id) {
        log.debug("REST request to get PaymentOption : {}", id);
        Optional<PaymentOption> paymentOption = paymentOptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paymentOption);
    }

    /**
     * {@code DELETE  /payment-options/:id} : delete the "id" paymentOption.
     *
     * @param id the id of the paymentOption to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payment-options/{id}")
    public ResponseEntity<Void> deletePaymentOption(@PathVariable Long id) {
        log.debug("REST request to delete PaymentOption : {}", id);
        paymentOptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
