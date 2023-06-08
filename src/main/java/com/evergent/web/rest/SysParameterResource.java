package com.evergent.web.rest;

import com.evergent.domain.SysParameter;
import com.evergent.repository.SysParameterRepository;
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
 * REST controller for managing {@link com.evergent.domain.SysParameter}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SysParameterResource {

    private final Logger log = LoggerFactory.getLogger(SysParameterResource.class);

    private static final String ENTITY_NAME = "sysParameter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SysParameterRepository sysParameterRepository;

    public SysParameterResource(SysParameterRepository sysParameterRepository) {
        this.sysParameterRepository = sysParameterRepository;
    }

    /**
     * {@code POST  /sys-parameters} : Create a new sysParameter.
     *
     * @param sysParameter the sysParameter to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sysParameter, or with status {@code 400 (Bad Request)} if the sysParameter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sys-parameters")
    public ResponseEntity<SysParameter> createSysParameter(@RequestBody SysParameter sysParameter) throws URISyntaxException {
        log.debug("REST request to save SysParameter : {}", sysParameter);
        if (sysParameter.getId() != null) {
            throw new BadRequestAlertException("A new sysParameter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SysParameter result = sysParameterRepository.save(sysParameter);
        return ResponseEntity
            .created(new URI("/api/sys-parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sys-parameters/:id} : Updates an existing sysParameter.
     *
     * @param id the id of the sysParameter to save.
     * @param sysParameter the sysParameter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sysParameter,
     * or with status {@code 400 (Bad Request)} if the sysParameter is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sysParameter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sys-parameters/{id}")
    public ResponseEntity<SysParameter> updateSysParameter(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SysParameter sysParameter
    ) throws URISyntaxException {
        log.debug("REST request to update SysParameter : {}, {}", id, sysParameter);
        if (sysParameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sysParameter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sysParameterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SysParameter result = sysParameterRepository.save(sysParameter);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sysParameter.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sys-parameters/:id} : Partial updates given fields of an existing sysParameter, field will ignore if it is null
     *
     * @param id the id of the sysParameter to save.
     * @param sysParameter the sysParameter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sysParameter,
     * or with status {@code 400 (Bad Request)} if the sysParameter is not valid,
     * or with status {@code 404 (Not Found)} if the sysParameter is not found,
     * or with status {@code 500 (Internal Server Error)} if the sysParameter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sys-parameters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SysParameter> partialUpdateSysParameter(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SysParameter sysParameter
    ) throws URISyntaxException {
        log.debug("REST request to partial update SysParameter partially : {}, {}", id, sysParameter);
        if (sysParameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sysParameter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sysParameterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SysParameter> result = sysParameterRepository
            .findById(sysParameter.getId())
            .map(existingSysParameter -> {
                if (sysParameter.getKey() != null) {
                    existingSysParameter.setKey(sysParameter.getKey());
                }
                if (sysParameter.getValue() != null) {
                    existingSysParameter.setValue(sysParameter.getValue());
                }

                return existingSysParameter;
            })
            .map(sysParameterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sysParameter.getId().toString())
        );
    }

    /**
     * {@code GET  /sys-parameters} : get all the sysParameters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sysParameters in body.
     */
    @GetMapping("/sys-parameters")
    public List<SysParameter> getAllSysParameters() {
        log.debug("REST request to get all SysParameters");
        return sysParameterRepository.findAll();
    }

    /**
     * {@code GET  /sys-parameters/:id} : get the "id" sysParameter.
     *
     * @param id the id of the sysParameter to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sysParameter, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sys-parameters/{id}")
    public ResponseEntity<SysParameter> getSysParameter(@PathVariable Long id) {
        log.debug("REST request to get SysParameter : {}", id);
        Optional<SysParameter> sysParameter = sysParameterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sysParameter);
    }

    /**
     * {@code DELETE  /sys-parameters/:id} : delete the "id" sysParameter.
     *
     * @param id the id of the sysParameter to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sys-parameters/{id}")
    public ResponseEntity<Void> deleteSysParameter(@PathVariable Long id) {
        log.debug("REST request to delete SysParameter : {}", id);
        sysParameterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
