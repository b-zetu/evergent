package com.evergent.web.rest;

import com.evergent.domain.VoteProposal;
import com.evergent.repository.VoteProposalRepository;
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
 * REST controller for managing {@link com.evergent.domain.VoteProposal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoteProposalResource {

    private final Logger log = LoggerFactory.getLogger(VoteProposalResource.class);

    private static final String ENTITY_NAME = "voteProposal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VoteProposalRepository voteProposalRepository;

    public VoteProposalResource(VoteProposalRepository voteProposalRepository) {
        this.voteProposalRepository = voteProposalRepository;
    }

    /**
     * {@code POST  /vote-proposals} : Create a new voteProposal.
     *
     * @param voteProposal the voteProposal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voteProposal, or with status {@code 400 (Bad Request)} if the voteProposal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vote-proposals")
    public ResponseEntity<VoteProposal> createVoteProposal(@RequestBody VoteProposal voteProposal) throws URISyntaxException {
        log.debug("REST request to save VoteProposal : {}", voteProposal);
        if (voteProposal.getId() != null) {
            throw new BadRequestAlertException("A new voteProposal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VoteProposal result = voteProposalRepository.save(voteProposal);
        return ResponseEntity
            .created(new URI("/api/vote-proposals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vote-proposals/:id} : Updates an existing voteProposal.
     *
     * @param id the id of the voteProposal to save.
     * @param voteProposal the voteProposal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteProposal,
     * or with status {@code 400 (Bad Request)} if the voteProposal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voteProposal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vote-proposals/{id}")
    public ResponseEntity<VoteProposal> updateVoteProposal(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteProposal voteProposal
    ) throws URISyntaxException {
        log.debug("REST request to update VoteProposal : {}, {}", id, voteProposal);
        if (voteProposal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteProposal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteProposalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VoteProposal result = voteProposalRepository.save(voteProposal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteProposal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vote-proposals/:id} : Partial updates given fields of an existing voteProposal, field will ignore if it is null
     *
     * @param id the id of the voteProposal to save.
     * @param voteProposal the voteProposal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voteProposal,
     * or with status {@code 400 (Bad Request)} if the voteProposal is not valid,
     * or with status {@code 404 (Not Found)} if the voteProposal is not found,
     * or with status {@code 500 (Internal Server Error)} if the voteProposal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vote-proposals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VoteProposal> partialUpdateVoteProposal(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VoteProposal voteProposal
    ) throws URISyntaxException {
        log.debug("REST request to partial update VoteProposal partially : {}, {}", id, voteProposal);
        if (voteProposal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voteProposal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voteProposalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VoteProposal> result = voteProposalRepository
            .findById(voteProposal.getId())
            .map(existingVoteProposal -> {
                if (voteProposal.getTitle() != null) {
                    existingVoteProposal.setTitle(voteProposal.getTitle());
                }
                if (voteProposal.getText() != null) {
                    existingVoteProposal.setText(voteProposal.getText());
                }
                if (voteProposal.getStartDate() != null) {
                    existingVoteProposal.setStartDate(voteProposal.getStartDate());
                }
                if (voteProposal.getEndDate() != null) {
                    existingVoteProposal.setEndDate(voteProposal.getEndDate());
                }
                if (voteProposal.getStatus() != null) {
                    existingVoteProposal.setStatus(voteProposal.getStatus());
                }

                return existingVoteProposal;
            })
            .map(voteProposalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voteProposal.getId().toString())
        );
    }

    /**
     * {@code GET  /vote-proposals} : get all the voteProposals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voteProposals in body.
     */
    @GetMapping("/vote-proposals")
    public List<VoteProposal> getAllVoteProposals() {
        log.debug("REST request to get all VoteProposals");
        return voteProposalRepository.findAll();
    }

    /**
     * {@code GET  /vote-proposals/:id} : get the "id" voteProposal.
     *
     * @param id the id of the voteProposal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voteProposal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vote-proposals/{id}")
    public ResponseEntity<VoteProposal> getVoteProposal(@PathVariable Long id) {
        log.debug("REST request to get VoteProposal : {}", id);
        Optional<VoteProposal> voteProposal = voteProposalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(voteProposal);
    }

    /**
     * {@code DELETE  /vote-proposals/:id} : delete the "id" voteProposal.
     *
     * @param id the id of the voteProposal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vote-proposals/{id}")
    public ResponseEntity<Void> deleteVoteProposal(@PathVariable Long id) {
        log.debug("REST request to delete VoteProposal : {}", id);
        voteProposalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
