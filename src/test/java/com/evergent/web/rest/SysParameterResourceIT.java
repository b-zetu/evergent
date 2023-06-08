package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.SysParameter;
import com.evergent.repository.SysParameterRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SysParameterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SysParameterResourceIT {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sys-parameters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SysParameterRepository sysParameterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSysParameterMockMvc;

    private SysParameter sysParameter;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SysParameter createEntity(EntityManager em) {
        SysParameter sysParameter = new SysParameter().key(DEFAULT_KEY).value(DEFAULT_VALUE);
        return sysParameter;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SysParameter createUpdatedEntity(EntityManager em) {
        SysParameter sysParameter = new SysParameter().key(UPDATED_KEY).value(UPDATED_VALUE);
        return sysParameter;
    }

    @BeforeEach
    public void initTest() {
        sysParameter = createEntity(em);
    }

    @Test
    @Transactional
    void createSysParameter() throws Exception {
        int databaseSizeBeforeCreate = sysParameterRepository.findAll().size();
        // Create the SysParameter
        restSysParameterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysParameter)))
            .andExpect(status().isCreated());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeCreate + 1);
        SysParameter testSysParameter = sysParameterList.get(sysParameterList.size() - 1);
        assertThat(testSysParameter.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testSysParameter.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createSysParameterWithExistingId() throws Exception {
        // Create the SysParameter with an existing ID
        sysParameter.setId(1L);

        int databaseSizeBeforeCreate = sysParameterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSysParameterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysParameter)))
            .andExpect(status().isBadRequest());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSysParameters() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        // Get all the sysParameterList
        restSysParameterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sysParameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getSysParameter() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        // Get the sysParameter
        restSysParameterMockMvc
            .perform(get(ENTITY_API_URL_ID, sysParameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sysParameter.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingSysParameter() throws Exception {
        // Get the sysParameter
        restSysParameterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSysParameter() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();

        // Update the sysParameter
        SysParameter updatedSysParameter = sysParameterRepository.findById(sysParameter.getId()).get();
        // Disconnect from session so that the updates on updatedSysParameter are not directly saved in db
        em.detach(updatedSysParameter);
        updatedSysParameter.key(UPDATED_KEY).value(UPDATED_VALUE);

        restSysParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSysParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSysParameter))
            )
            .andExpect(status().isOk());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
        SysParameter testSysParameter = sysParameterList.get(sysParameterList.size() - 1);
        assertThat(testSysParameter.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testSysParameter.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sysParameter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sysParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sysParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysParameter)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSysParameterWithPatch() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();

        // Update the sysParameter using partial update
        SysParameter partialUpdatedSysParameter = new SysParameter();
        partialUpdatedSysParameter.setId(sysParameter.getId());

        restSysParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSysParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSysParameter))
            )
            .andExpect(status().isOk());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
        SysParameter testSysParameter = sysParameterList.get(sysParameterList.size() - 1);
        assertThat(testSysParameter.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testSysParameter.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateSysParameterWithPatch() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();

        // Update the sysParameter using partial update
        SysParameter partialUpdatedSysParameter = new SysParameter();
        partialUpdatedSysParameter.setId(sysParameter.getId());

        partialUpdatedSysParameter.key(UPDATED_KEY).value(UPDATED_VALUE);

        restSysParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSysParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSysParameter))
            )
            .andExpect(status().isOk());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
        SysParameter testSysParameter = sysParameterList.get(sysParameterList.size() - 1);
        assertThat(testSysParameter.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testSysParameter.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sysParameter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sysParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sysParameter))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSysParameter() throws Exception {
        int databaseSizeBeforeUpdate = sysParameterRepository.findAll().size();
        sysParameter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysParameterMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sysParameter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SysParameter in the database
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSysParameter() throws Exception {
        // Initialize the database
        sysParameterRepository.saveAndFlush(sysParameter);

        int databaseSizeBeforeDelete = sysParameterRepository.findAll().size();

        // Delete the sysParameter
        restSysParameterMockMvc
            .perform(delete(ENTITY_API_URL_ID, sysParameter.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SysParameter> sysParameterList = sysParameterRepository.findAll();
        assertThat(sysParameterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
