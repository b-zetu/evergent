package com.evergent.web.rest;

import com.evergent.domain.VoteEntry;
import com.evergent.repository.VoteEntryRepository;
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
 * REST controller for managing {@link com.evergent.domain.VoteEntry}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoteEntryResource {

    private final Logger log = LoggerFactory.getLogger(VoteEntryResource.class);

    private static final String ENTITY_NAME = "voteEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoteEntryRepository voteEntryRepository;

    public VoteEntryResource(VoteEntryRepository voteEntryRepository) {
        this.voteEntryRepository = voteEntryRepository;
    }

    /**
     * {@code POST  /vote-entries} : Create a new voteEntry.
     *
     * @param voteEntry the voteEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voteEntry, or with status {@code 400 (Bad Request)} if the voteEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vote-entries")
    public ResponseEntity<VoteEntry> createVoteEntry(@RequestBody VoteEntry voteEntry) throws URISyntaxException {
        log.debug("REST request to save VoteEntry : {}", voteEntry);
        if (voteEntry.getId() != null) {
            throw new BadRequestAlertException("A new voteEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VoteEntry result = voteEntryRepository.save(voteEntry);
        return ResponseEntity
            .created(new URI("/api/vote-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vote-entries/:id} : Updates an existing voteEntry.
     *
     * @param id the id of the voteEntry to save.
     * @param voteEntry the voteEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteEntry,
     * or with status {@code 400 (Bad Request)} if the voteEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voteEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vote-entries/{id}")
    public ResponseEntity<VoteEntry> updateVoteEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteEntry voteEntry
    ) throws URISyntaxException {
        log.debug("REST request to update VoteEntry : {}, {}", id, voteEntry);
        if (voteEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VoteEntry result = voteEntryRepository.save(voteEntry);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vote-entries/:id} : Partial updates given fields of an existing voteEntry, field will ignore if it is null
     *
     * @param id the id of the voteEntry to save.
     * @param voteEntry the voteEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteEntry,
     * or with status {@code 400 (Bad Request)} if the voteEntry is not valid,
     * or with status {@code 404 (Not Found)} if the voteEntry is not found,
     * or with status {@code 500 (Internal Server Error)} if the voteEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vote-entries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VoteEntry> partialUpdateVoteEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteEntry voteEntry
    ) throws URISyntaxException {
        log.debug("REST request to partial update VoteEntry partially : {}, {}", id, voteEntry);
        if (voteEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteEntry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VoteEntry> result = voteEntryRepository
            .findById(voteEntry.getId())
            .map(existingVoteEntry -> {
                return existingVoteEntry;
            })
            .map(voteEntryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteEntry.getId().toString())
        );
    }

    /**
     * {@code GET  /vote-entries} : get all the voteEntries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voteEntries in body.
     */
    @GetMapping("/vote-entries")
    public List<VoteEntry> getAllVoteEntries() {
        log.debug("REST request to get all VoteEntries");
        return voteEntryRepository.findAll();
    }

    /**
     * {@code GET  /vote-entries/:id} : get the "id" voteEntry.
     *
     * @param id the id of the voteEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voteEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vote-entries/{id}")
    public ResponseEntity<VoteEntry> getVoteEntry(@PathVariable Long id) {
        log.debug("REST request to get VoteEntry : {}", id);
        Optional<VoteEntry> voteEntry = voteEntryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voteEntry);
    }

    /**
     * {@code DELETE  /vote-entries/:id} : delete the "id" voteEntry.
     *
     * @param id the id of the voteEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vote-entries/{id}")
    public ResponseEntity<Void> deleteVoteEntry(@PathVariable Long id) {
        log.debug("REST request to delete VoteEntry : {}", id);
        voteEntryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
