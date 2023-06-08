package com.evergent.web.rest;

import com.evergent.domain.VoteOption;
import com.evergent.repository.VoteOptionRepository;
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
 * REST controller for managing {@link com.evergent.domain.VoteOption}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoteOptionResource {

    private final Logger log = LoggerFactory.getLogger(VoteOptionResource.class);

    private static final String ENTITY_NAME = "voteOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoteOptionRepository voteOptionRepository;

    public VoteOptionResource(VoteOptionRepository voteOptionRepository) {
        this.voteOptionRepository = voteOptionRepository;
    }

    /**
     * {@code POST  /vote-options} : Create a new voteOption.
     *
     * @param voteOption the voteOption to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voteOption, or with status {@code 400 (Bad Request)} if the voteOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vote-options")
    public ResponseEntity<VoteOption> createVoteOption(@RequestBody VoteOption voteOption) throws URISyntaxException {
        log.debug("REST request to save VoteOption : {}", voteOption);
        if (voteOption.getId() != null) {
            throw new BadRequestAlertException("A new voteOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VoteOption result = voteOptionRepository.save(voteOption);
        return ResponseEntity
            .created(new URI("/api/vote-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vote-options/:id} : Updates an existing voteOption.
     *
     * @param id the id of the voteOption to save.
     * @param voteOption the voteOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteOption,
     * or with status {@code 400 (Bad Request)} if the voteOption is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voteOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vote-options/{id}")
    public ResponseEntity<VoteOption> updateVoteOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteOption voteOption
    ) throws URISyntaxException {
        log.debug("REST request to update VoteOption : {}, {}", id, voteOption);
        if (voteOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VoteOption result = voteOptionRepository.save(voteOption);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteOption.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vote-options/:id} : Partial updates given fields of an existing voteOption, field will ignore if it is null
     *
     * @param id the id of the voteOption to save.
     * @param voteOption the voteOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteOption,
     * or with status {@code 400 (Bad Request)} if the voteOption is not valid,
     * or with status {@code 404 (Not Found)} if the voteOption is not found,
     * or with status {@code 500 (Internal Server Error)} if the voteOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vote-options/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VoteOption> partialUpdateVoteOption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteOption voteOption
    ) throws URISyntaxException {
        log.debug("REST request to partial update VoteOption partially : {}, {}", id, voteOption);
        if (voteOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VoteOption> result = voteOptionRepository
            .findById(voteOption.getId())
            .map(existingVoteOption -> {
                if (voteOption.getCode() != null) {
                    existingVoteOption.setCode(voteOption.getCode());
                }
                if (voteOption.getText() != null) {
                    existingVoteOption.setText(voteOption.getText());
                }

                return existingVoteOption;
            })
            .map(voteOptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteOption.getId().toString())
        );
    }

    /**
     * {@code GET  /vote-options} : get all the voteOptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voteOptions in body.
     */
    @GetMapping("/vote-options")
    public List<VoteOption> getAllVoteOptions() {
        log.debug("REST request to get all VoteOptions");
        return voteOptionRepository.findAll();
    }

    /**
     * {@code GET  /vote-options/:id} : get the "id" voteOption.
     *
     * @param id the id of the voteOption to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voteOption, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vote-options/{id}")
    public ResponseEntity<VoteOption> getVoteOption(@PathVariable Long id) {
        log.debug("REST request to get VoteOption : {}", id);
        Optional<VoteOption> voteOption = voteOptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voteOption);
    }

    /**
     * {@code DELETE  /vote-options/:id} : delete the "id" voteOption.
     *
     * @param id the id of the voteOption to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vote-options/{id}")
    public ResponseEntity<Void> deleteVoteOption(@PathVariable Long id) {
        log.debug("REST request to delete VoteOption : {}", id);
        voteOptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
