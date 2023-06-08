package com.evergent.web.rest;

import com.evergent.domain.ShareholderXInheritance;
import com.evergent.repository.ShareholderXInheritanceRepository;
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
 * REST controller for managing {@link com.evergent.domain.ShareholderXInheritance}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShareholderXInheritanceResource {

    private final Logger log = LoggerFactory.getLogger(ShareholderXInheritanceResource.class);

    private static final String ENTITY_NAME = "shareholderXInheritance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShareholderXInheritanceRepository shareholderXInheritanceRepository;

    public ShareholderXInheritanceResource(ShareholderXInheritanceRepository shareholderXInheritanceRepository) {
        this.shareholderXInheritanceRepository = shareholderXInheritanceRepository;
    }

    /**
     * {@code POST  /shareholder-x-inheritances} : Create a new shareholderXInheritance.
     *
     * @param shareholderXInheritance the shareholderXInheritance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shareholderXInheritance, or with status {@code 400 (Bad Request)} if the shareholderXInheritance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shareholder-x-inheritances")
    public ResponseEntity<ShareholderXInheritance> createShareholderXInheritance(
        @RequestBody ShareholderXInheritance shareholderXInheritance
    ) throws URISyntaxException {
        log.debug("REST request to save ShareholderXInheritance : {}", shareholderXInheritance);
        if (shareholderXInheritance.getId() != null) {
            throw new BadRequestAlertException("A new shareholderXInheritance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShareholderXInheritance result = shareholderXInheritanceRepository.save(shareholderXInheritance);
        return ResponseEntity
            .created(new URI("/api/shareholder-x-inheritances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shareholder-x-inheritances/:id} : Updates an existing shareholderXInheritance.
     *
     * @param id the id of the shareholderXInheritance to save.
     * @param shareholderXInheritance the shareholderXInheritance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholderXInheritance,
     * or with status {@code 400 (Bad Request)} if the shareholderXInheritance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shareholderXInheritance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shareholder-x-inheritances/{id}")
    public ResponseEntity<ShareholderXInheritance> updateShareholderXInheritance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShareholderXInheritance shareholderXInheritance
    ) throws URISyntaxException {
        log.debug("REST request to update ShareholderXInheritance : {}, {}", id, shareholderXInheritance);
        if (shareholderXInheritance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholderXInheritance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderXInheritanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShareholderXInheritance result = shareholderXInheritanceRepository.save(shareholderXInheritance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholderXInheritance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shareholder-x-inheritances/:id} : Partial updates given fields of an existing shareholderXInheritance, field will ignore if it is null
     *
     * @param id the id of the shareholderXInheritance to save.
     * @param shareholderXInheritance the shareholderXInheritance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholderXInheritance,
     * or with status {@code 400 (Bad Request)} if the shareholderXInheritance is not valid,
     * or with status {@code 404 (Not Found)} if the shareholderXInheritance is not found,
     * or with status {@code 500 (Internal Server Error)} if the shareholderXInheritance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shareholder-x-inheritances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShareholderXInheritance> partialUpdateShareholderXInheritance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShareholderXInheritance shareholderXInheritance
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShareholderXInheritance partially : {}, {}", id, shareholderXInheritance);
        if (shareholderXInheritance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholderXInheritance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderXInheritanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShareholderXInheritance> result = shareholderXInheritanceRepository
            .findById(shareholderXInheritance.getId())
            .map(existingShareholderXInheritance -> {
                return existingShareholderXInheritance;
            })
            .map(shareholderXInheritanceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholderXInheritance.getId().toString())
        );
    }

    /**
     * {@code GET  /shareholder-x-inheritances} : get all the shareholderXInheritances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shareholderXInheritances in body.
     */
    @GetMapping("/shareholder-x-inheritances")
    public List<ShareholderXInheritance> getAllShareholderXInheritances() {
        log.debug("REST request to get all ShareholderXInheritances");
        return shareholderXInheritanceRepository.findAll();
    }

    /**
     * {@code GET  /shareholder-x-inheritances/:id} : get the "id" shareholderXInheritance.
     *
     * @param id the id of the shareholderXInheritance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shareholderXInheritance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shareholder-x-inheritances/{id}")
    public ResponseEntity<ShareholderXInheritance> getShareholderXInheritance(@PathVariable Long id) {
        log.debug("REST request to get ShareholderXInheritance : {}", id);
        Optional<ShareholderXInheritance> shareholderXInheritance = shareholderXInheritanceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shareholderXInheritance);
    }

    /**
     * {@code DELETE  /shareholder-x-inheritances/:id} : delete the "id" shareholderXInheritance.
     *
     * @param id the id of the shareholderXInheritance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shareholder-x-inheritances/{id}")
    public ResponseEntity<Void> deleteShareholderXInheritance(@PathVariable Long id) {
        log.debug("REST request to delete ShareholderXInheritance : {}", id);
        shareholderXInheritanceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
