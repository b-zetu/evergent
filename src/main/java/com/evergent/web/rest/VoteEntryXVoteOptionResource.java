package com.evergent.web.rest;

import com.evergent.domain.VoteEntryXVoteOption;
import com.evergent.repository.VoteEntryXVoteOptionRepository;
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
 * REST controller for managing {@link com.evergent.domain.VoteEntryXVoteOption}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoteEntryXVoteOptionResource {

    private final Logger log = LoggerFactory.getLogger(VoteEntryXVoteOptionResource.class);

    private static final String ENTITY_NAME = "voteEntryXVoteOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoteEntryXVoteOptionRepository voteEntryXVoteOptionRepository;

    public VoteEntryXVoteOptionResource(VoteEntryXVoteOptionRepository voteEntryXVoteOptionRepository) {
        this.voteEntryXVoteOptionRepository = voteEntryXVoteOptionRepository;
    }

    /**
     * {@code POST  /vote-entry-x-vote-options} : Create a new voteEntryXVoteOption.
     *
     * @param voteEntryXVoteOption the voteEntryXVoteOption to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voteEntryXVoteOption, or with status {@code 400 (Bad Request)} if the voteEntryXVoteOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vote-entry-x-vote-options")
    public ResponseEntity<VoteEntryXVoteOption> createVoteEntryXVoteOption(@RequestBody VoteEntryXVoteOption voteEntryXVoteOption)
        throws URISyntaxException {
        log.debug("REST request to save VoteEntryXVoteOption : {}", voteEntryXVoteOption);
        if (voteEntryXVoteOption.getId() != null) {
            throw new BadRequestAlertException("A new voteEntryXVoteOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VoteEntryXVoteOption result = voteEntryXVoteOptionRepository.save(voteEntryXVoteOption);
        return ResponseEntity
            .created(new URI("/api/vote-entry-x-vote-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vote-entry-x-vote-options/:id} : Updates an existing voteEntryXVoteOption.
     *
     * @param id the id of the voteEntryXVoteOption to save.
     * @param voteEntryXVoteOption the voteEntryXVoteOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteEntryXVoteOption,
     * or with status {@code 400 (Bad Request)} if the voteEntryXVoteOption is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voteEntryXVoteOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vote-entry-x-vote-options/{id}")
    public ResponseEntity<VoteEntryXVoteOption> updateVoteEntryXVoteOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteEntryXVoteOption voteEntryXVoteOption
    ) throws URISyntaxException {
        log.debug("REST request to update VoteEntryXVoteOption : {}, {}", id, voteEntryXVoteOption);
        if (voteEntryXVoteOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteEntryXVoteOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteEntryXVoteOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VoteEntryXVoteOption result = voteEntryXVoteOptionRepository.save(voteEntryXVoteOption);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteEntryXVoteOption.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vote-entry-x-vote-options/:id} : Partial updates given fields of an existing voteEntryXVoteOption, field will ignore if it is null
     *
     * @param id the id of the voteEntryXVoteOption to save.
     * @param voteEntryXVoteOption the voteEntryXVoteOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteEntryXVoteOption,
     * or with status {@code 400 (Bad Request)} if the voteEntryXVoteOption is not valid,
     * or with status {@code 404 (Not Found)} if the voteEntryXVoteOption is not found,
     * or with status {@code 500 (Internal Server Error)} if the voteEntryXVoteOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vote-entry-x-vote-options/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VoteEntryXVoteOption> partialUpdateVoteEntryXVoteOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteEntryXVoteOption voteEntryXVoteOption
    ) throws URISyntaxException {
        log.debug("REST request to partial update VoteEntryXVoteOption partially : {}, {}", id, voteEntryXVoteOption);
        if (voteEntryXVoteOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteEntryXVoteOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteEntryXVoteOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VoteEntryXVoteOption> result = voteEntryXVoteOptionRepository
            .findById(voteEntryXVoteOption.getId())
            .map(existingVoteEntryXVoteOption -> {
                return existingVoteEntryXVoteOption;
            })
            .map(voteEntryXVoteOptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteEntryXVoteOption.getId().toString())
        );
    }

    /**
     * {@code GET  /vote-entry-x-vote-options} : get all the voteEntryXVoteOptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voteEntryXVoteOptions in body.
     */
    @GetMapping("/vote-entry-x-vote-options")
    public List<VoteEntryXVoteOption> getAllVoteEntryXVoteOptions() {
        log.debug("REST request to get all VoteEntryXVoteOptions");
        return voteEntryXVoteOptionRepository.findAll();
    }

    /**
     * {@code GET  /vote-entry-x-vote-options/:id} : get the "id" voteEntryXVoteOption.
     *
     * @param id the id of the voteEntryXVoteOption to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voteEntryXVoteOption, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vote-entry-x-vote-options/{id}")
    public ResponseEntity<VoteEntryXVoteOption> getVoteEntryXVoteOption(@PathVariable Long id) {
        log.debug("REST request to get VoteEntryXVoteOption : {}", id);
        Optional<VoteEntryXVoteOption> voteEntryXVoteOption = voteEntryXVoteOptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voteEntryXVoteOption);
    }

    /**
     * {@code DELETE  /vote-entry-x-vote-options/:id} : delete the "id" voteEntryXVoteOption.
     *
     * @param id the id of the voteEntryXVoteOption to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vote-entry-x-vote-options/{id}")
    public ResponseEntity<Void> deleteVoteEntryXVoteOption(@PathVariable Long id) {
        log.debug("REST request to delete VoteEntryXVoteOption : {}", id);
        voteEntryXVoteOptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
