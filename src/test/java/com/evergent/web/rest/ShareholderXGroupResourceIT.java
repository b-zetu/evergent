package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.ShareholderXGroup;
import com.evergent.repository.ShareholderXGroupRepository;
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
 * Integration tests for the {@link ShareholderXGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShareholderXGroupResourceIT {

    private static final String ENTITY_API_URL = "/api/shareholder-x-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShareholderXGroupRepository shareholderXGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShareholderXGroupMockMvc;

    private ShareholderXGroup shareholderXGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShareholderXGroup createEntity(EntityManager em) {
        ShareholderXGroup shareholderXGroup = new ShareholderXGroup();
        return shareholderXGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShareholderXGroup createUpdatedEntity(EntityManager em) {
        ShareholderXGroup shareholderXGroup = new ShareholderXGroup();
        return shareholderXGroup;
    }

    @BeforeEach
    public void initTest() {
        shareholderXGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createShareholderXGroup() throws Exception {
        int databaseSizeBeforeCreate = shareholderXGroupRepository.findAll().size();
        // Create the ShareholderXGroup
        restShareholderXGroupMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isCreated());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeCreate + 1);
        ShareholderXGroup testShareholderXGroup = shareholderXGroupList.get(shareholderXGroupList.size() - 1);
    }

    @Test
    @Transactional
    void createShareholderXGroupWithExistingId() throws Exception {
        // Create the ShareholderXGroup with an existing ID
        shareholderXGroup.setId(1L);

        int databaseSizeBeforeCreate = shareholderXGroupRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShareholderXGroupMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShareholderXGroups() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        // Get all the shareholderXGroupList
        restShareholderXGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shareholderXGroup.getId().intValue())));
    }

    @Test
    @Transactional
    void getShareholderXGroup() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        // Get the shareholderXGroup
        restShareholderXGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, shareholderXGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shareholderXGroup.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingShareholderXGroup() throws Exception {
        // Get the shareholderXGroup
        restShareholderXGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShareholderXGroup() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();

        // Update the shareholderXGroup
        ShareholderXGroup updatedShareholderXGroup = shareholderXGroupRepository.findById(shareholderXGroup.getId()).get();
        // Disconnect from session so that the updates on updatedShareholderXGroup are not directly saved in db
        em.detach(updatedShareholderXGroup);

        restShareholderXGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShareholderXGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShareholderXGroup))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXGroup testShareholderXGroup = shareholderXGroupList.get(shareholderXGroupList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shareholderXGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShareholderXGroupWithPatch() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();

        // Update the shareholderXGroup using partial update
        ShareholderXGroup partialUpdatedShareholderXGroup = new ShareholderXGroup();
        partialUpdatedShareholderXGroup.setId(shareholderXGroup.getId());

        restShareholderXGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholderXGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholderXGroup))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXGroup testShareholderXGroup = shareholderXGroupList.get(shareholderXGroupList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateShareholderXGroupWithPatch() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();

        // Update the shareholderXGroup using partial update
        ShareholderXGroup partialUpdatedShareholderXGroup = new ShareholderXGroup();
        partialUpdatedShareholderXGroup.setId(shareholderXGroup.getId());

        restShareholderXGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholderXGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholderXGroup))
            )
            .andExpect(status().isOk());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
        ShareholderXGroup testShareholderXGroup = shareholderXGroupList.get(shareholderXGroupList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shareholderXGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShareholderXGroup() throws Exception {
        int databaseSizeBeforeUpdate = shareholderXGroupRepository.findAll().size();
        shareholderXGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderXGroupMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholderXGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShareholderXGroup in the database
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShareholderXGroup() throws Exception {
        // Initialize the database
        shareholderXGroupRepository.saveAndFlush(shareholderXGroup);

        int databaseSizeBeforeDelete = shareholderXGroupRepository.findAll().size();

        // Delete the shareholderXGroup
        restShareholderXGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, shareholderXGroup.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShareholderXGroup> shareholderXGroupList = shareholderXGroupRepository.findAll();
        assertThat(shareholderXGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
