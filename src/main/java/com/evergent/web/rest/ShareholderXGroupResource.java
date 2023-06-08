package com.evergent.web.rest;

import com.evergent.domain.ShareholderXGroup;
import com.evergent.repository.ShareholderXGroupRepository;
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
 * REST controller for managing {@link com.evergent.domain.ShareholderXGroup}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShareholderXGroupResource {

    private final Logger log = LoggerFactory.getLogger(ShareholderXGroupResource.class);

    private static final String ENTITY_NAME = "shareholderXGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShareholderXGroupRepository shareholderXGroupRepository;

    public ShareholderXGroupResource(ShareholderXGroupRepository shareholderXGroupRepository) {
        this.shareholderXGroupRepository = shareholderXGroupRepository;
    }

    /**
     * {@code POST  /shareholder-x-groups} : Create a new shareholderXGroup.
     *
     * @param shareholderXGroup the shareholderXGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shareholderXGroup, or with status {@code 400 (Bad Request)} if the shareholderXGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shareholder-x-groups")
    public ResponseEntity<ShareholderXGroup> createShareholderXGroup(@RequestBody ShareholderXGroup shareholderXGroup)
        throws URISyntaxException {
        log.debug("REST request to save ShareholderXGroup : {}", shareholderXGroup);
        if (shareholderXGroup.getId() != null) {
            throw new BadRequestAlertException("A new shareholderXGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShareholderXGroup result = shareholderXGroupRepository.save(shareholderXGroup);
        return ResponseEntity
            .created(new URI("/api/shareholder-x-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shareholder-x-groups/:id} : Updates an existing shareholderXGroup.
     *
     * @param id the id of the shareholderXGroup to save.
     * @param shareholderXGroup the shareholderXGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholderXGroup,
     * or with status {@code 400 (Bad Request)} if the shareholderXGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shareholderXGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shareholder-x-groups/{id}")
    public ResponseEntity<ShareholderXGroup> updateShareholderXGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShareholderXGroup shareholderXGroup
    ) throws URISyntaxException {
        log.debug("REST request to update ShareholderXGroup : {}, {}", id, shareholderXGroup);
        if (shareholderXGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholderXGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderXGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShareholderXGroup result = shareholderXGroupRepository.save(shareholderXGroup);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholderXGroup.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shareholder-x-groups/:id} : Partial updates given fields of an existing shareholderXGroup, field will ignore if it is null
     *
     * @param id the id of the shareholderXGroup to save.
     * @param shareholderXGroup the shareholderXGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholderXGroup,
     * or with status {@code 400 (Bad Request)} if the shareholderXGroup is not valid,
     * or with status {@code 404 (Not Found)} if the shareholderXGroup is not found,
     * or with status {@code 500 (Internal Server Error)} if the shareholderXGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shareholder-x-groups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShareholderXGroup> partialUpdateShareholderXGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ShareholderXGroup shareholderXGroup
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShareholderXGroup partially : {}, {}", id, shareholderXGroup);
        if (shareholderXGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholderXGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderXGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShareholderXGroup> result = shareholderXGroupRepository
            .findById(shareholderXGroup.getId())
            .map(existingShareholderXGroup -> {
                return existingShareholderXGroup;
            })
            .map(shareholderXGroupRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholderXGroup.getId().toString())
        );
    }

    /**
     * {@code GET  /shareholder-x-groups} : get all the shareholderXGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shareholderXGroups in body.
     */
    @GetMapping("/shareholder-x-groups")
    public List<ShareholderXGroup> getAllShareholderXGroups() {
        log.debug("REST request to get all ShareholderXGroups");
        return shareholderXGroupRepository.findAll();
    }

    /**
     * {@code GET  /shareholder-x-groups/:id} : get the "id" shareholderXGroup.
     *
     * @param id the id of the shareholderXGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shareholderXGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shareholder-x-groups/{id}")
    public ResponseEntity<ShareholderXGroup> getShareholderXGroup(@PathVariable Long id) {
        log.debug("REST request to get ShareholderXGroup : {}", id);
        Optional<ShareholderXGroup> shareholderXGroup = shareholderXGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shareholderXGroup);
    }

    /**
     * {@code DELETE  /shareholder-x-groups/:id} : delete the "id" shareholderXGroup.
     *
     * @param id the id of the shareholderXGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shareholder-x-groups/{id}")
    public ResponseEntity<Void> deleteShareholderXGroup(@PathVariable Long id) {
        log.debug("REST request to delete ShareholderXGroup : {}", id);
        shareholderXGroupRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
