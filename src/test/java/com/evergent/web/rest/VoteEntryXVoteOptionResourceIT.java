package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.VoteEntryXVoteOption;
import com.evergent.repository.VoteEntryXVoteOptionRepository;
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
 * Integration tests for the {@link VoteEntryXVoteOptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoteEntryXVoteOptionResourceIT {

    private static final String ENTITY_API_URL = "/api/vote-entry-x-vote-options";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoteEntryXVoteOptionRepository voteEntryXVoteOptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoteEntryXVoteOptionMockMvc;

    private VoteEntryXVoteOption voteEntryXVoteOption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteEntryXVoteOption createEntity(EntityManager em) {
        VoteEntryXVoteOption voteEntryXVoteOption = new VoteEntryXVoteOption();
        return voteEntryXVoteOption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteEntryXVoteOption createUpdatedEntity(EntityManager em) {
        VoteEntryXVoteOption voteEntryXVoteOption = new VoteEntryXVoteOption();
        return voteEntryXVoteOption;
    }

    @BeforeEach
    public void initTest() {
        voteEntryXVoteOption = createEntity(em);
    }

    @Test
    @Transactional
    void createVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeCreate = voteEntryXVoteOptionRepository.findAll().size();
        // Create the VoteEntryXVoteOption
        restVoteEntryXVoteOptionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isCreated());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeCreate + 1);
        VoteEntryXVoteOption testVoteEntryXVoteOption = voteEntryXVoteOptionList.get(voteEntryXVoteOptionList.size() - 1);
    }

    @Test
    @Transactional
    void createVoteEntryXVoteOptionWithExistingId() throws Exception {
        // Create the VoteEntryXVoteOption with an existing ID
        voteEntryXVoteOption.setId(1L);

        int databaseSizeBeforeCreate = voteEntryXVoteOptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoteEntryXVoteOptionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoteEntryXVoteOptions() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        // Get all the voteEntryXVoteOptionList
        restVoteEntryXVoteOptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voteEntryXVoteOption.getId().intValue())));
    }

    @Test
    @Transactional
    void getVoteEntryXVoteOption() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        // Get the voteEntryXVoteOption
        restVoteEntryXVoteOptionMockMvc
            .perform(get(ENTITY_API_URL_ID, voteEntryXVoteOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voteEntryXVoteOption.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingVoteEntryXVoteOption() throws Exception {
        // Get the voteEntryXVoteOption
        restVoteEntryXVoteOptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoteEntryXVoteOption() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();

        // Update the voteEntryXVoteOption
        VoteEntryXVoteOption updatedVoteEntryXVoteOption = voteEntryXVoteOptionRepository.findById(voteEntryXVoteOption.getId()).get();
        // Disconnect from session so that the updates on updatedVoteEntryXVoteOption are not directly saved in db
        em.detach(updatedVoteEntryXVoteOption);

        restVoteEntryXVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoteEntryXVoteOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoteEntryXVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteEntryXVoteOption testVoteEntryXVoteOption = voteEntryXVoteOptionList.get(voteEntryXVoteOptionList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voteEntryXVoteOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoteEntryXVoteOptionWithPatch() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();

        // Update the voteEntryXVoteOption using partial update
        VoteEntryXVoteOption partialUpdatedVoteEntryXVoteOption = new VoteEntryXVoteOption();
        partialUpdatedVoteEntryXVoteOption.setId(voteEntryXVoteOption.getId());

        restVoteEntryXVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteEntryXVoteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteEntryXVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteEntryXVoteOption testVoteEntryXVoteOption = voteEntryXVoteOptionList.get(voteEntryXVoteOptionList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateVoteEntryXVoteOptionWithPatch() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();

        // Update the voteEntryXVoteOption using partial update
        VoteEntryXVoteOption partialUpdatedVoteEntryXVoteOption = new VoteEntryXVoteOption();
        partialUpdatedVoteEntryXVoteOption.setId(voteEntryXVoteOption.getId());

        restVoteEntryXVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteEntryXVoteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteEntryXVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteEntryXVoteOption testVoteEntryXVoteOption = voteEntryXVoteOptionList.get(voteEntryXVoteOptionList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voteEntryXVoteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoteEntryXVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteEntryXVoteOptionRepository.findAll().size();
        voteEntryXVoteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteEntryXVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteEntryXVoteOption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteEntryXVoteOption in the database
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoteEntryXVoteOption() throws Exception {
        // Initialize the database
        voteEntryXVoteOptionRepository.saveAndFlush(voteEntryXVoteOption);

        int databaseSizeBeforeDelete = voteEntryXVoteOptionRepository.findAll().size();

        // Delete the voteEntryXVoteOption
        restVoteEntryXVoteOptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, voteEntryXVoteOption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VoteEntryXVoteOption> voteEntryXVoteOptionList = voteEntryXVoteOptionRepository.findAll();
        assertThat(voteEntryXVoteOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
