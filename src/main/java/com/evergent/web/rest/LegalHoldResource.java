package com.evergent.web.rest;

import com.evergent.domain.LegalHold;
import com.evergent.repository.LegalHoldRepository;
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
 * REST controller for managing {@link com.evergent.domain.LegalHold}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LegalHoldResource {

    private final Logger log = LoggerFactory.getLogger(LegalHoldResource.class);

    private static final String ENTITY_NAME = "legalHold";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LegalHoldRepository legalHoldRepository;

    public LegalHoldResource(LegalHoldRepository legalHoldRepository) {
        this.legalHoldRepository = legalHoldRepository;
    }

    /**
     * {@code POST  /legal-holds} : Create a new legalHold.
     *
     * @param legalHold the legalHold to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new legalHold, or with status {@code 400 (Bad Request)} if the legalHold has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/legal-holds")
    public ResponseEntity<LegalHold> createLegalHold(@RequestBody LegalHold legalHold) throws URISyntaxException {
        log.debug("REST request to save LegalHold : {}", legalHold);
        if (legalHold.getId() != null) {
            throw new BadRequestAlertException("A new legalHold cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LegalHold result = legalHoldRepository.save(legalHold);
        return ResponseEntity
            .created(new URI("/api/legal-holds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /legal-holds/:id} : Updates an existing legalHold.
     *
     * @param id the id of the legalHold to save.
     * @param legalHold the legalHold to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalHold,
     * or with status {@code 400 (Bad Request)} if the legalHold is not valid,
     * or with status {@code 500 (Internal Server Error)} if the legalHold couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/legal-holds/{id}")
    public ResponseEntity<LegalHold> updateLegalHold(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LegalHold legalHold
    ) throws URISyntaxException {
        log.debug("REST request to update LegalHold : {}, {}", id, legalHold);
        if (legalHold.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalHold.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalHoldRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LegalHold result = legalHoldRepository.save(legalHold);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalHold.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /legal-holds/:id} : Partial updates given fields of an existing legalHold, field will ignore if it is null
     *
     * @param id the id of the legalHold to save.
     * @param legalHold the legalHold to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalHold,
     * or with status {@code 400 (Bad Request)} if the legalHold is not valid,
     * or with status {@code 404 (Not Found)} if the legalHold is not found,
     * or with status {@code 500 (Internal Server Error)} if the legalHold couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/legal-holds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LegalHold> partialUpdateLegalHold(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LegalHold legalHold
    ) throws URISyntaxException {
        log.debug("REST request to partial update LegalHold partially : {}, {}", id, legalHold);
        if (legalHold.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalHold.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalHoldRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LegalHold> result = legalHoldRepository
            .findById(legalHold.getId())
            .map(existingLegalHold -> {
                if (legalHold.getBeneficiaryName() != null) {
                    existingLegalHold.setBeneficiaryName(legalHold.getBeneficiaryName());
                }
                if (legalHold.getType() != null) {
                    existingLegalHold.setType(legalHold.getType());
                }
                if (legalHold.getTotalAmount() != null) {
                    existingLegalHold.setTotalAmount(legalHold.getTotalAmount());
                }
                if (legalHold.getAmountLeft() != null) {
                    existingLegalHold.setAmountLeft(legalHold.getAmountLeft());
                }
                if (legalHold.getPoprireNumber() != null) {
                    existingLegalHold.setPoprireNumber(legalHold.getPoprireNumber());
                }
                if (legalHold.getPoprireDate() != null) {
                    existingLegalHold.setPoprireDate(legalHold.getPoprireDate());
                }
                if (legalHold.getPoprireDocumentNumber() != null) {
                    existingLegalHold.setPoprireDocumentNumber(legalHold.getPoprireDocumentNumber());
                }
                if (legalHold.getPoprireDocumentDate() != null) {
                    existingLegalHold.setPoprireDocumentDate(legalHold.getPoprireDocumentDate());
                }
                if (legalHold.getSistareNumber() != null) {
                    existingLegalHold.setSistareNumber(legalHold.getSistareNumber());
                }
                if (legalHold.getSistareDate() != null) {
                    existingLegalHold.setSistareDate(legalHold.getSistareDate());
                }
                if (legalHold.getSistareIntrareNumber() != null) {
                    existingLegalHold.setSistareIntrareNumber(legalHold.getSistareIntrareNumber());
                }
                if (legalHold.getSistareIntrareDate() != null) {
                    existingLegalHold.setSistareIntrareDate(legalHold.getSistareIntrareDate());
                }
                if (legalHold.getStatus() != null) {
                    existingLegalHold.setStatus(legalHold.getStatus());
                }

                return existingLegalHold;
            })
            .map(legalHoldRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalHold.getId().toString())
        );
    }

    /**
     * {@code GET  /legal-holds} : get all the legalHolds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of legalHolds in body.
     */
    @GetMapping("/legal-holds")
    public List<LegalHold> getAllLegalHolds() {
        log.debug("REST request to get all LegalHolds");
        return legalHoldRepository.findAll();
    }

    /**
     * {@code GET  /legal-holds/:id} : get the "id" legalHold.
     *
     * @param id the id of the legalHold to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the legalHold, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/legal-holds/{id}")
    public ResponseEntity<LegalHold> getLegalHold(@PathVariable Long id) {
        log.debug("REST request to get LegalHold : {}", id);
        Optional<LegalHold> legalHold = legalHoldRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(legalHold);
    }

    /**
     * {@code DELETE  /legal-holds/:id} : delete the "id" legalHold.
     *
     * @param id the id of the legalHold to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/legal-holds/{id}")
    public ResponseEntity<Void> deleteLegalHold(@PathVariable Long id) {
        log.debug("REST request to delete LegalHold : {}", id);
        legalHoldRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
