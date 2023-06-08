package com.evergent.web.rest;

import com.evergent.domain.DividendCalculation;
import com.evergent.repository.DividendCalculationRepository;
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
 * REST controller for managing {@link com.evergent.domain.DividendCalculation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DividendCalculationResource {

    private final Logger log = LoggerFactory.getLogger(DividendCalculationResource.class);

    private static final String ENTITY_NAME = "dividendCalculation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DividendCalculationRepository dividendCalculationRepository;

    public DividendCalculationResource(DividendCalculationRepository dividendCalculationRepository) {
        this.dividendCalculationRepository = dividendCalculationRepository;
    }

    /**
     * {@code POST  /dividend-calculations} : Create a new dividendCalculation.
     *
     * @param dividendCalculation the dividendCalculation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dividendCalculation, or with status {@code 400 (Bad Request)} if the dividendCalculation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dividend-calculations")
    public ResponseEntity<DividendCalculation> createDividendCalculation(@RequestBody DividendCalculation dividendCalculation)
        throws URISyntaxException {
        log.debug("REST request to save DividendCalculation : {}", dividendCalculation);
        if (dividendCalculation.getId() != null) {
            throw new BadRequestAlertException("A new dividendCalculation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DividendCalculation result = dividendCalculationRepository.save(dividendCalculation);
        return ResponseEntity
            .created(new URI("/api/dividend-calculations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dividend-calculations/:id} : Updates an existing dividendCalculation.
     *
     * @param id the id of the dividendCalculation to save.
     * @param dividendCalculation the dividendCalculation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendCalculation,
     * or with status {@code 400 (Bad Request)} if the dividendCalculation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dividendCalculation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dividend-calculations/{id}")
    public ResponseEntity<DividendCalculation> updateDividendCalculation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendCalculation dividendCalculation
    ) throws URISyntaxException {
        log.debug("REST request to update DividendCalculation : {}, {}", id, dividendCalculation);
        if (dividendCalculation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendCalculation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendCalculationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DividendCalculation result = dividendCalculationRepository.save(dividendCalculation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendCalculation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dividend-calculations/:id} : Partial updates given fields of an existing dividendCalculation, field will ignore if it is null
     *
     * @param id the id of the dividendCalculation to save.
     * @param dividendCalculation the dividendCalculation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendCalculation,
     * or with status {@code 400 (Bad Request)} if the dividendCalculation is not valid,
     * or with status {@code 404 (Not Found)} if the dividendCalculation is not found,
     * or with status {@code 500 (Internal Server Error)} if the dividendCalculation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dividend-calculations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DividendCalculation> partialUpdateDividendCalculation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendCalculation dividendCalculation
    ) throws URISyntaxException {
        log.debug("REST request to partial update DividendCalculation partially : {}, {}", id, dividendCalculation);
        if (dividendCalculation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendCalculation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendCalculationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DividendCalculation> result = dividendCalculationRepository
            .findById(dividendCalculation.getId())
            .map(existingDividendCalculation -> {
                if (dividendCalculation.getTotalNetAmount() != null) {
                    existingDividendCalculation.setTotalNetAmount(dividendCalculation.getTotalNetAmount());
                }
                if (dividendCalculation.getTaxAmountCalculated() != null) {
                    existingDividendCalculation.setTaxAmountCalculated(dividendCalculation.getTaxAmountCalculated());
                }
                if (dividendCalculation.getTotalGrossAmount() != null) {
                    existingDividendCalculation.setTotalGrossAmount(dividendCalculation.getTotalGrossAmount());
                }

                return existingDividendCalculation;
            })
            .map(dividendCalculationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendCalculation.getId().toString())
        );
    }

    /**
     * {@code GET  /dividend-calculations} : get all the dividendCalculations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dividendCalculations in body.
     */
    @GetMapping("/dividend-calculations")
    public List<DividendCalculation> getAllDividendCalculations() {
        log.debug("REST request to get all DividendCalculations");
        return dividendCalculationRepository.findAll();
    }

    /**
     * {@code GET  /dividend-calculations/:id} : get the "id" dividendCalculation.
     *
     * @param id the id of the dividendCalculation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dividendCalculation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dividend-calculations/{id}")
    public ResponseEntity<DividendCalculation> getDividendCalculation(@PathVariable Long id) {
        log.debug("REST request to get DividendCalculation : {}", id);
        Optional<DividendCalculation> dividendCalculation = dividendCalculationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dividendCalculation);
    }

    /**
     * {@code DELETE  /dividend-calculations/:id} : delete the "id" dividendCalculation.
     *
     * @param id the id of the dividendCalculation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dividend-calculations/{id}")
    public ResponseEntity<Void> deleteDividendCalculation(@PathVariable Long id) {
        log.debug("REST request to delete DividendCalculation : {}", id);
        dividendCalculationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
