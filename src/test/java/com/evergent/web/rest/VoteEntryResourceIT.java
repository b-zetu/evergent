package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.VoteEntry;
import com.evergent.repository.VoteEntryRepository;
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
 * Integration tests for the {@link VoteEntryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoteEntryResourceIT {

    private static final String ENTITY_API_URL = "/api/vote-entries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoteEntryRepository voteEntryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoteEntryMockMvc;

    private VoteEntry voteEntry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteEntry createEntity(EntityManager em) {
        VoteEntry voteEntry = new VoteEntry();
        return voteEntry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteEntry createUpdatedEntity(EntityManager em) {
        VoteEntry voteEntry = new VoteEntry();
        return voteEntry;
    }

    @BeforeEach
    public void initTest() {
        voteEntry = createEntity(em);
    }

    @Test
    @Transactional
    void createVoteEntry() throws Exception {
        int databaseSizeBeforeCreate = voteEntryRepository.findAll().size();
        // Create the VoteEntry
        restVoteEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteEntry)))
            .andExpect(status().isCreated());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeCreate + 1);
        VoteEntry testVoteEntry = voteEntryList.get(voteEntryList.size() - 1);
    }

    @Test
    @Transactional
    void createVoteEntryWithExistingId() throws Exception {
        // Create the VoteEntry with an existing ID
        voteEntry.setId(1L);

        int databaseSizeBeforeCreate = voteEntryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoteEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteEntry)))
            .andExpect(status().isBadRequest());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoteEntries() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        // Get all the voteEntryList
        restVoteEntryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voteEntry.getId().intValue())));
    }

    @Test
    @Transactional
    void getVoteEntry() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        // Get the voteEntry
        restVoteEntryMockMvc
            .perform(get(ENTITY_API_URL_ID, voteEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voteEntry.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingVoteEntry() throws Exception {
        // Get the voteEntry
        restVoteEntryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoteEntry() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();

        // Update the voteEntry
        VoteEntry updatedVoteEntry = voteEntryRepository.findById(voteEntry.getId()).get();
        // Disconnect from session so that the updates on updatedVoteEntry are not directly saved in db
        em.detach(updatedVoteEntry);

        restVoteEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoteEntry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoteEntry))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
        VoteEntry testVoteEntry = voteEntryList.get(voteEntryList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voteEntry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteEntry)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoteEntryWithPatch() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();

        // Update the voteEntry using partial update
        VoteEntry partialUpdatedVoteEntry = new VoteEntry();
        partialUpdatedVoteEntry.setId(voteEntry.getId());

        restVoteEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteEntry))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
        VoteEntry testVoteEntry = voteEntryList.get(voteEntryList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateVoteEntryWithPatch() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();

        // Update the voteEntry using partial update
        VoteEntry partialUpdatedVoteEntry = new VoteEntry();
        partialUpdatedVoteEntry.setId(voteEntry.getId());

        restVoteEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteEntry))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
        VoteEntry testVoteEntry = voteEntryList.get(voteEntryList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voteEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoteEntry() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryRepository.findAll().size();
        voteEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voteEntry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteEntry in the database
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoteEntry() throws Exception {
        // Initialize the database
        voteEntryRepository.saveAndFlush(voteEntry);

        int databaseSizeBeforeDelete = voteEntryRepository.findAll().size();

        // Delete the voteEntry
        restVoteEntryMockMvc
            .perform(delete(ENTITY_API_URL_ID, voteEntry.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VoteEntry> voteEntryList = voteEntryRepository.findAll();
        assertThat(voteEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
