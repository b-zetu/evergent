package com.evergent.web.rest;

import com.evergent.domain.DividendRegister;
import com.evergent.repository.DividendRegisterRepository;
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
 * REST controller for managing {@link com.evergent.domain.DividendRegister}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DividendRegisterResource {

    private final Logger log = LoggerFactory.getLogger(DividendRegisterResource.class);

    private static final String ENTITY_NAME = "dividendRegister";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DividendRegisterRepository dividendRegisterRepository;

    public DividendRegisterResource(DividendRegisterRepository dividendRegisterRepository) {
        this.dividendRegisterRepository = dividendRegisterRepository;
    }

    /**
     * {@code POST  /dividend-registers} : Create a new dividendRegister.
     *
     * @param dividendRegister the dividendRegister to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dividendRegister, or with status {@code 400 (Bad Request)} if the dividendRegister has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dividend-registers")
    public ResponseEntity<DividendRegister> createDividendRegister(@RequestBody DividendRegister dividendRegister)
        throws URISyntaxException {
        log.debug("REST request to save DividendRegister : {}", dividendRegister);
        if (dividendRegister.getId() != null) {
            throw new BadRequestAlertException("A new dividendRegister cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DividendRegister result = dividendRegisterRepository.save(dividendRegister);
        return ResponseEntity
            .created(new URI("/api/dividend-registers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dividend-registers/:id} : Updates an existing dividendRegister.
     *
     * @param id the id of the dividendRegister to save.
     * @param dividendRegister the dividendRegister to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendRegister,
     * or with status {@code 400 (Bad Request)} if the dividendRegister is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dividendRegister couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dividend-registers/{id}")
    public ResponseEntity<DividendRegister> updateDividendRegister(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendRegister dividendRegister
    ) throws URISyntaxException {
        log.debug("REST request to update DividendRegister : {}, {}", id, dividendRegister);
        if (dividendRegister.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendRegister.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendRegisterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DividendRegister result = dividendRegisterRepository.save(dividendRegister);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendRegister.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dividend-registers/:id} : Partial updates given fields of an existing dividendRegister, field will ignore if it is null
     *
     * @param id the id of the dividendRegister to save.
     * @param dividendRegister the dividendRegister to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dividendRegister,
     * or with status {@code 400 (Bad Request)} if the dividendRegister is not valid,
     * or with status {@code 404 (Not Found)} if the dividendRegister is not found,
     * or with status {@code 500 (Internal Server Error)} if the dividendRegister couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dividend-registers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DividendRegister> partialUpdateDividendRegister(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DividendRegister dividendRegister
    ) throws URISyntaxException {
        log.debug("REST request to partial update DividendRegister partially : {}, {}", id, dividendRegister);
        if (dividendRegister.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dividendRegister.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dividendRegisterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DividendRegister> result = dividendRegisterRepository
            .findById(dividendRegister.getId())
            .map(existingDividendRegister -> {
                if (dividendRegister.getReferenceDate() != null) {
                    existingDividendRegister.setReferenceDate(dividendRegister.getReferenceDate());
                }
                if (dividendRegister.getDividendGrossValue() != null) {
                    existingDividendRegister.setDividendGrossValue(dividendRegister.getDividendGrossValue());
                }
                if (dividendRegister.getStatus() != null) {
                    existingDividendRegister.setStatus(dividendRegister.getStatus());
                }

                return existingDividendRegister;
            })
            .map(dividendRegisterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dividendRegister.getId().toString())
        );
    }

    /**
     * {@code GET  /dividend-registers} : get all the dividendRegisters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dividendRegisters in body.
     */
    @GetMapping("/dividend-registers")
    public List<DividendRegister> getAllDividendRegisters() {
        log.debug("REST request to get all DividendRegisters");
        return dividendRegisterRepository.findAll();
    }

    /**
     * {@code GET  /dividend-registers/:id} : get the "id" dividendRegister.
     *
     * @param id the id of the dividendRegister to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dividendRegister, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dividend-registers/{id}")
    public ResponseEntity<DividendRegister> getDividendRegister(@PathVariable Long id) {
        log.debug("REST request to get DividendRegister : {}", id);
        Optional<DividendRegister> dividendRegister = dividendRegisterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dividendRegister);
    }

    /**
     * {@code DELETE  /dividend-registers/:id} : delete the "id" dividendRegister.
     *
     * @param id the id of the dividendRegister to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dividend-registers/{id}")
    public ResponseEntity<Void> deleteDividendRegister(@PathVariable Long id) {
        log.debug("REST request to delete DividendRegister : {}", id);
        dividendRegisterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
