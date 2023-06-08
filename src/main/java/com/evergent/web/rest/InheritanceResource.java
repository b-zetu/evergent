package com.evergent.web.rest;

import com.evergent.domain.Inheritance;
import com.evergent.repository.InheritanceRepository;
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
 * REST controller for managing {@link com.evergent.domain.Inheritance}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InheritanceResource {

    private final Logger log = LoggerFactory.getLogger(InheritanceResource.class);

    private static final String ENTITY_NAME = "inheritance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InheritanceRepository inheritanceRepository;

    public InheritanceResource(InheritanceRepository inheritanceRepository) {
        this.inheritanceRepository = inheritanceRepository;
    }

    /**
     * {@code POST  /inheritances} : Create a new inheritance.
     *
     * @param inheritance the inheritance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inheritance, or with status {@code 400 (Bad Request)} if the inheritance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inheritances")
    public ResponseEntity<Inheritance> createInheritance(@RequestBody Inheritance inheritance) throws URISyntaxException {
        log.debug("REST request to save Inheritance : {}", inheritance);
        if (inheritance.getId() != null) {
            throw new BadRequestAlertException("A new inheritance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inheritance result = inheritanceRepository.save(inheritance);
        return ResponseEntity
            .created(new URI("/api/inheritances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inheritances/:id} : Updates an existing inheritance.
     *
     * @param id the id of the inheritance to save.
     * @param inheritance the inheritance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inheritance,
     * or with status {@code 400 (Bad Request)} if the inheritance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inheritance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inheritances/{id}")
    public ResponseEntity<Inheritance> updateInheritance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inheritance inheritance
    ) throws URISyntaxException {
        log.debug("REST request to update Inheritance : {}, {}", id, inheritance);
        if (inheritance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inheritance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inheritanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Inheritance result = inheritanceRepository.save(inheritance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inheritance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /inheritances/:id} : Partial updates given fields of an existing inheritance, field will ignore if it is null
     *
     * @param id the id of the inheritance to save.
     * @param inheritance the inheritance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inheritance,
     * or with status {@code 400 (Bad Request)} if the inheritance is not valid,
     * or with status {@code 404 (Not Found)} if the inheritance is not found,
     * or with status {@code 500 (Internal Server Error)} if the inheritance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/inheritances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Inheritance> partialUpdateInheritance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inheritance inheritance
    ) throws URISyntaxException {
        log.debug("REST request to partial update Inheritance partially : {}, {}", id, inheritance);
        if (inheritance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inheritance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inheritanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Inheritance> result = inheritanceRepository
            .findById(inheritance.getId())
            .map(existingInheritance -> {
                if (inheritance.getOperationDate() != null) {
                    existingInheritance.setOperationDate(inheritance.getOperationDate());
                }
                if (inheritance.getDocumentNumber() != null) {
                    existingInheritance.setDocumentNumber(inheritance.getDocumentNumber());
                }
                if (inheritance.getDocumentDate() != null) {
                    existingInheritance.setDocumentDate(inheritance.getDocumentDate());
                }
                if (inheritance.getSharesNo() != null) {
                    existingInheritance.setSharesNo(inheritance.getSharesNo());
                }
                if (inheritance.getStatus() != null) {
                    existingInheritance.setStatus(inheritance.getStatus());
                }

                return existingInheritance;
            })
            .map(inheritanceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inheritance.getId().toString())
        );
    }

    /**
     * {@code GET  /inheritances} : get all the inheritances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inheritances in body.
     */
    @GetMapping("/inheritances")
    public List<Inheritance> getAllInheritances() {
        log.debug("REST request to get all Inheritances");
        return inheritanceRepository.findAll();
    }

    /**
     * {@code GET  /inheritances/:id} : get the "id" inheritance.
     *
     * @param id the id of the inheritance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inheritance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inheritances/{id}")
    public ResponseEntity<Inheritance> getInheritance(@PathVariable Long id) {
        log.debug("REST request to get Inheritance : {}", id);
        Optional<Inheritance> inheritance = inheritanceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inheritance);
    }

    /**
     * {@code DELETE  /inheritances/:id} : delete the "id" inheritance.
     *
     * @param id the id of the inheritance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inheritances/{id}")
    public ResponseEntity<Void> deleteInheritance(@PathVariable Long id) {
        log.debug("REST request to delete Inheritance : {}", id);
        inheritanceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
