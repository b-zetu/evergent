package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.ShareholderXInheritance;
import com.evergent.repository.ShareholderXInheritanceRepository;
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
 * Integration tests for the {@link ShareholderXInheritanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShareholderXInheritanceResourceIT {

    private static final String ENTITY_API_URL = "/api/shareholder-x-inheritances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShareholderXInheritanceRepository shareholderXInheritanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShareholderXInheritanceMockMvc;

    private ShareholderXInheritance shareholderXInheritance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShareholderXInheritance createEntity(EntityManager em) {
        ShareholderXInheritance shareholderXInheritance = new ShareholderXInheritance();
        return shareholderXInheritance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShareholderXInheritance createUpdatedEntity(EntityManager em) {
        ShareholderXInheritance shareholderXInheritance = new ShareholderXInheritance();
        return shareholderXInheritance;
    }

    @BeforeEach
    public void initTest() {
        shareholderXInheritance = createEntity(em);
    }

    @Test
    @Transactional
    void createShareholderXInheritance() throws Exception {
        int databaseSizeBeforeCreate = shareholderXInheritanceRepository.findAll().size();
        // Create the ShareholderXInheritance
        restShareholderXInheritanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isCreated());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeCreate + 1);
        ShareholderXInheritance testShareholderXInheritance = shareholderXInheritanceList.get(shareholderXInheritanceList.size() - 1);
    }

    @Test
    @Transactional
    void createShareholderXInheritanceWithExistingId() throws Exception {
        // Create the ShareholderXInheritance with an existing ID
        shareholderXInheritance.setId(1L);

        int databaseSizeBeforeCreate = shareholderXInheritanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShareholderXInheritanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShareholderXInheritances() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        // Get all the shareholderXInheritanceList
        restShareholderXInheritanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shareholderXInheritance.getId().intValue())));
    }

    @Test
    @Transactional
    void getShareholderXInheritance() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        // Get the shareholderXInheritance
        restShareholderXInheritanceMockMvc
            .perform(get(ENTITY_API_URL_ID, shareholderXInheritance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shareholderXInheritance.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingShareholderXInheritance() throws Exception {
        // Get the shareholderXInheritance
        restShareholderXInheritanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShareholderXInheritance() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();

        // Update the shareholderXInheritance
        ShareholderXInheritance updatedShareholderXInheritance = shareholderXInheritanceRepository
            .findById(shareholderXInheritance.getId())
            .get();
        // Disconnect from session so that the updates on updatedShareholderXInheritance are not directly saved in db
        em.detach(updatedShareholderXInheritance);

        restShareholderXInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShareholderXInheritance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShareholderXInheritance))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXInheritance testShareholderXInheritance = shareholderXInheritanceList.get(shareholderXInheritanceList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shareholderXInheritance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShareholderXInheritanceWithPatch() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();

        // Update the shareholderXInheritance using partial update
        ShareholderXInheritance partialUpdatedShareholderXInheritance = new ShareholderXInheritance();
        partialUpdatedShareholderXInheritance.setId(shareholderXInheritance.getId());

        restShareholderXInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholderXInheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholderXInheritance))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXInheritance testShareholderXInheritance = shareholderXInheritanceList.get(shareholderXInheritanceList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateShareholderXInheritanceWithPatch() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();

        // Update the shareholderXInheritance using partial update
        ShareholderXInheritance partialUpdatedShareholderXInheritance = new ShareholderXInheritance();
        partialUpdatedShareholderXInheritance.setId(shareholderXInheritance.getId());

        restShareholderXInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholderXInheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholderXInheritance))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXInheritance testShareholderXInheritance = shareholderXInheritanceList.get(shareholderXInheritanceList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shareholderXInheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShareholderXInheritance() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXInheritanceRepository.findAll().size();
        shareholderXInheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXInheritance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShareholderXInheritance in the database
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShareholderXInheritance() throws Exception {
        // Initialize the database
        shareholderXInheritanceRepository.saveAndFlush(shareholderXInheritance);

        int databaseSizeBeforeDelete = shareholderXInheritanceRepository.findAll().size();

        // Delete the shareholderXInheritance
        restShareholderXInheritanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, shareholderXInheritance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShareholderXInheritance> shareholderXInheritanceList = shareholderXInheritanceRepository.findAll();
        assertThat(shareholderXInheritanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
