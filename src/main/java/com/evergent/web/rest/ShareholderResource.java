package com.evergent.web.rest;

import com.evergent.domain.Shareholder;
import com.evergent.repository.ShareholderRepository;
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
 * REST controller for managing {@link com.evergent.domain.Shareholder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShareholderResource {

    private final Logger log = LoggerFactory.getLogger(ShareholderResource.class);

    private static final String ENTITY_NAME = "shareholder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShareholderRepository shareholderRepository;

    public ShareholderResource(ShareholderRepository shareholderRepository) {
        this.shareholderRepository = shareholderRepository;
    }

    /**
     * {@code POST  /shareholders} : Create a new shareholder.
     *
     * @param shareholder the shareholder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shareholder, or with status {@code 400 (Bad Request)} if the shareholder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shareholders")
    public ResponseEntity<Shareholder> createShareholder(@RequestBody Shareholder shareholder) throws URISyntaxException {
        log.debug("REST request to save Shareholder : {}", shareholder);
        if (shareholder.getId() != null) {
            throw new BadRequestAlertException("A new shareholder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shareholder result = shareholderRepository.save(shareholder);
        return ResponseEntity
            .created(new URI("/api/shareholders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shareholders/:id} : Updates an existing shareholder.
     *
     * @param id the id of the shareholder to save.
     * @param shareholder the shareholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholder,
     * or with status {@code 400 (Bad Request)} if the shareholder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shareholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shareholders/{id}")
    public ResponseEntity<Shareholder> updateShareholder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Shareholder shareholder
    ) throws URISyntaxException {
        log.debug("REST request to update Shareholder : {}, {}", id, shareholder);
        if (shareholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Shareholder result = shareholderRepository.save(shareholder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shareholders/:id} : Partial updates given fields of an existing shareholder, field will ignore if it is null
     *
     * @param id the id of the shareholder to save.
     * @param shareholder the shareholder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shareholder,
     * or with status {@code 400 (Bad Request)} if the shareholder is not valid,
     * or with status {@code 404 (Not Found)} if the shareholder is not found,
     * or with status {@code 500 (Internal Server Error)} if the shareholder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shareholders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Shareholder> partialUpdateShareholder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Shareholder shareholder
    ) throws URISyntaxException {
        log.debug("REST request to partial update Shareholder partially : {}, {}", id, shareholder);
        if (shareholder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shareholder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareholderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Shareholder> result = shareholderRepository
            .findById(shareholder.getId())
            .map(existingShareholder -> {
                if (shareholder.getShareholderIdDC() != null) {
                    existingShareholder.setShareholderIdDC(shareholder.getShareholderIdDC());
                }
                if (shareholder.getCnp() != null) {
                    existingShareholder.setCnp(shareholder.getCnp());
                }
                if (shareholder.getFirstName() != null) {
                    existingShareholder.setFirstName(shareholder.getFirstName());
                }
                if (shareholder.getLastName() != null) {
                    existingShareholder.setLastName(shareholder.getLastName());
                }
                if (shareholder.getSharesNo() != null) {
                    existingShareholder.setSharesNo(shareholder.getSharesNo());
                }
                if (shareholder.getIsPf() != null) {
                    existingShareholder.setIsPf(shareholder.getIsPf());
                }
                if (shareholder.getIsResident() != null) {
                    existingShareholder.setIsResident(shareholder.getIsResident());
                }
                if (shareholder.getTaxValue() != null) {
                    existingShareholder.setTaxValue(shareholder.getTaxValue());
                }
                if (shareholder.getStatus() != null) {
                    existingShareholder.setStatus(shareholder.getStatus());
                }
                if (shareholder.getCountryResidence() != null) {
                    existingShareholder.setCountryResidence(shareholder.getCountryResidence());
                }
                if (shareholder.getCountyResidence() != null) {
                    existingShareholder.setCountyResidence(shareholder.getCountyResidence());
                }
                if (shareholder.getCityResidence() != null) {
                    existingShareholder.setCityResidence(shareholder.getCityResidence());
                }
                if (shareholder.getVillageResidence() != null) {
                    existingShareholder.setVillageResidence(shareholder.getVillageResidence());
                }
                if (shareholder.getForeignLocalityResidence() != null) {
                    existingShareholder.setForeignLocalityResidence(shareholder.getForeignLocalityResidence());
                }
                if (shareholder.getStreetResidence() != null) {
                    existingShareholder.setStreetResidence(shareholder.getStreetResidence());
                }
                if (shareholder.getStreetNo() != null) {
                    existingShareholder.setStreetNo(shareholder.getStreetNo());
                }

                return existingShareholder;
            })
            .map(shareholderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shareholder.getId().toString())
        );
    }

    /**
     * {@code GET  /shareholders} : get all the shareholders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shareholders in body.
     */
    @GetMapping("/shareholders")
    public List<Shareholder> getAllShareholders() {
        log.debug("REST request to get all Shareholders");
        return shareholderRepository.findAll();
    }

    /**
     * {@code GET  /shareholders/:id} : get the "id" shareholder.
     *
     * @param id the id of the shareholder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shareholder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shareholders/{id}")
    public ResponseEntity<Shareholder> getShareholder(@PathVariable Long id) {
        log.debug("REST request to get Shareholder : {}", id);
        Optional<Shareholder> shareholder = shareholderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shareholder);
    }

    /**
     * {@code DELETE  /shareholders/:id} : delete the "id" shareholder.
     *
     * @param id the id of the shareholder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shareholders/{id}")
    public ResponseEntity<Void> deleteShareholder(@PathVariable Long id) {
        log.debug("REST request to delete Shareholder : {}", id);
        shareholderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
