package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.VoteOption;
import com.evergent.repository.VoteOptionRepository;
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
 * Integration tests for the {@link VoteOptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoteOptionResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vote-options";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoteOptionRepository voteOptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoteOptionMockMvc;

    private VoteOption voteOption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteOption createEntity(EntityManager em) {
        VoteOption voteOption = new VoteOption().code(DEFAULT_CODE).text(DEFAULT_TEXT);
        return voteOption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteOption createUpdatedEntity(EntityManager em) {
        VoteOption voteOption = new VoteOption().code(UPDATED_CODE).text(UPDATED_TEXT);
        return voteOption;
    }

    @BeforeEach
    public void initTest() {
        voteOption = createEntity(em);
    }

    @Test
    @Transactional
    void createVoteOption() throws Exception {
        int databaseSizeBeforeCreate = voteOptionRepository.findAll().size();
        // Create the VoteOption
        restVoteOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteOption)))
            .andExpect(status().isCreated());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeCreate + 1);
        VoteOption testVoteOption = voteOptionList.get(voteOptionList.size() - 1);
        assertThat(testVoteOption.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testVoteOption.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    void createVoteOptionWithExistingId() throws Exception {
        // Create the VoteOption with an existing ID
        voteOption.setId(1L);

        int databaseSizeBeforeCreate = voteOptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoteOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteOption)))
            .andExpect(status().isBadRequest());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoteOptions() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        // Get all the voteOptionList
        restVoteOptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voteOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)));
    }

    @Test
    @Transactional
    void getVoteOption() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        // Get the voteOption
        restVoteOptionMockMvc
            .perform(get(ENTITY_API_URL_ID, voteOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voteOption.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingVoteOption() throws Exception {
        // Get the voteOption
        restVoteOptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoteOption() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();

        // Update the voteOption
        VoteOption updatedVoteOption = voteOptionRepository.findById(voteOption.getId()).get();
        // Disconnect from session so that the updates on updatedVoteOption are not directly saved in db
        em.detach(updatedVoteOption);
        updatedVoteOption.code(UPDATED_CODE).text(UPDATED_TEXT);

        restVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoteOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteOption testVoteOption = voteOptionList.get(voteOptionList.size() - 1);
        assertThat(testVoteOption.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testVoteOption.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void putNonExistingVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voteOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteOption)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoteOptionWithPatch() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();

        // Update the voteOption using partial update
        VoteOption partialUpdatedVoteOption = new VoteOption();
        partialUpdatedVoteOption.setId(voteOption.getId());

        partialUpdatedVoteOption.text(UPDATED_TEXT);

        restVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteOption testVoteOption = voteOptionList.get(voteOptionList.size() - 1);
        assertThat(testVoteOption.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testVoteOption.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void fullUpdateVoteOptionWithPatch() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();

        // Update the voteOption using partial update
        VoteOption partialUpdatedVoteOption = new VoteOption();
        partialUpdatedVoteOption.setId(voteOption.getId());

        partialUpdatedVoteOption.code(UPDATED_CODE).text(UPDATED_TEXT);

        restVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteOption))
            )
            .andExpect(status().isOk());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
        VoteOption testVoteOption = voteOptionList.get(voteOptionList.size() - 1);
        assertThat(testVoteOption.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testVoteOption.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void patchNonExistingVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voteOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoteOption() throws Exception {
        int databaseSizeBeforeUpdate = voteOptionRepository.findAll().size();
        voteOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteOptionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voteOption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteOption in the database
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoteOption() throws Exception {
        // Initialize the database
        voteOptionRepository.saveAndFlush(voteOption);

        int databaseSizeBeforeDelete = voteOptionRepository.findAll().size();

        // Delete the voteOption
        restVoteOptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, voteOption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VoteOption> voteOptionList = voteOptionRepository.findAll();
        assertThat(voteOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
