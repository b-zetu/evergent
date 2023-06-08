package com.evergent.web.rest;

import com.evergent.domain.DividendShareholder;
import com.evergent.repository.DividendShareholderRepository;
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
 * REST controller for managing {@link com.evergent.domain.DividendShareholder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DividendShareholderResource {

    private final Logger log = LoggerFactory.getLogger(DividendShareholderResource.class);

    private static final String ENTITY_NAME = "dividendShareholder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DividendShareholderRepository dividendShareholderRepository;

    public DividendShareholderResource(DividendShareholderRepository dividendShareholderRepository) {
        this.dividendShareholderRepository = dividendShareholderRepository;
    }

    /**
     * {@code POST  /dividend-shareholders} : Create a new dividendShareholder.
     *
     * @param dividendShareholder the dividendShareholder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dividendShareholder, or with status {@code 400 (Bad Request)} if the dividendShareholder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dividend-shareholders")
    public ResponseEntity<DividendShareholder> createDividendShareholder(@RequestBody DividendShareholder dividendShareholder)
        throws URISyntaxException {
        log.debug("REST request to save DividendShareholder : {}", dividendShareholder);
        if (dividendShareholder.getId() != null) {
            throw new BadRequestAlertException("A new dividendShareholder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DividendShareholder result = dividendShareholderRepository.save(dividendShareholder);
        return ResponseEntity
            .created(new URI("/api/dividend-shareholders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dividend-shareholders/:id} : Updates an existing dividendShareholder.
     *
     * @param id the id of the dividendShareholder to save.
     * @param dividendShareholder the dividendShareholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendShareholder,
     * or with status {@code 400 (Bad Request)} if the dividendShareholder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dividendShareholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dividend-shareholders/{id}")
    public ResponseEntity<DividendShareholder> updateDividendShareholder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendShareholder dividendShareholder
    ) throws URISyntaxException {
        log.debug("REST request to update DividendShareholder : {}, {}", id, dividendShareholder);
        if (dividendShareholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendShareholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendShareholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DividendShareholder result = dividendShareholderRepository.save(dividendShareholder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendShareholder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dividend-shareholders/:id} : Partial updates given fields of an existing dividendShareholder, field will ignore if it is null
     *
     * @param id the id of the dividendShareholder to save.
     * @param dividendShareholder the dividendShareholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendShareholder,
     * or with status {@code 400 (Bad Request)} if the dividendShareholder is not valid,
     * or with status {@code 404 (Not Found)} if the dividendShareholder is not found,
     * or with status {@code 500 (Internal Server Error)} if the dividendShareholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dividend-shareholders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DividendShareholder> partialUpdateDividendShareholder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendShareholder dividendShareholder
    ) throws URISyntaxException {
        log.debug("REST request to partial update DividendShareholder partially : {}, {}", id, dividendShareholder);
        if (dividendShareholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendShareholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendShareholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DividendShareholder> result = dividendShareholderRepository
            .findById(dividendShareholder.getId())
            .map(existingDividendShareholder -> {
                if (dividendShareholder.getSharesNo() != null) {
                    existingDividendShareholder.setSharesNo(dividendShareholder.getSharesNo());
                }
                if (dividendShareholder.getIsResident() != null) {
                    existingDividendShareholder.setIsResident(dividendShareholder.getIsResident());
                }
                if (dividendShareholder.getTaxValue() != null) {
                    existingDividendShareholder.setTaxValue(dividendShareholder.getTaxValue());
                }
                if (dividendShareholder.getStatus() != null) {
                    existingDividendShareholder.setStatus(dividendShareholder.getStatus());
                }

                return existingDividendShareholder;
            })
            .map(dividendShareholderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendShareholder.getId().toString())
        );
    }

    /**
     * {@code GET  /dividend-shareholders} : get all the dividendShareholders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dividendShareholders in body.
     */
    @GetMapping("/dividend-shareholders")
    public List<DividendShareholder> getAllDividendShareholders() {
        log.debug("REST request to get all DividendShareholders");
        return dividendShareholderRepository.findAll();
    }

    /**
     * {@code GET  /dividend-shareholders/:id} : get the "id" dividendShareholder.
     *
     * @param id the id of the dividendShareholder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dividendShareholder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dividend-shareholders/{id}")
    public ResponseEntity<DividendShareholder> getDividendShareholder(@PathVariable Long id) {
        log.debug("REST request to get DividendShareholder : {}", id);
        Optional<DividendShareholder> dividendShareholder = dividendShareholderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dividendShareholder);
    }

    /**
     * {@code DELETE  /dividend-shareholders/:id} : delete the "id" dividendShareholder.
     *
     * @param id the id of the dividendShareholder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dividend-shareholders/{id}")
    public ResponseEntity<Void> deleteDividendShareholder(@PathVariable Long id) {
        log.debug("REST request to delete DividendShareholder : {}", id);
        dividendShareholderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
