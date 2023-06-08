package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.VoteProposal;
import com.evergent.repository.VoteProposalRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link VoteProposalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoteProposalResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vote-proposals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoteProposalRepository voteProposalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoteProposalMockMvc;

    private VoteProposal voteProposal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteProposal createEntity(EntityManager em) {
        VoteProposal voteProposal = new VoteProposal()
            .title(DEFAULT_TITLE)
            .text(DEFAULT_TEXT)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .status(DEFAULT_STATUS);
        return voteProposal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VoteProposal createUpdatedEntity(EntityManager em) {
        VoteProposal voteProposal = new VoteProposal()
            .title(UPDATED_TITLE)
            .text(UPDATED_TEXT)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS);
        return voteProposal;
    }

    @BeforeEach
    public void initTest() {
        voteProposal = createEntity(em);
    }

    @Test
    @Transactional
    void createVoteProposal() throws Exception {
        int databaseSizeBeforeCreate = voteProposalRepository.findAll().size();
        // Create the VoteProposal
        restVoteProposalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteProposal)))
            .andExpect(status().isCreated());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeCreate + 1);
        VoteProposal testVoteProposal = voteProposalList.get(voteProposalList.size() - 1);
        assertThat(testVoteProposal.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testVoteProposal.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testVoteProposal.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testVoteProposal.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testVoteProposal.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createVoteProposalWithExistingId() throws Exception {
        // Create the VoteProposal with an existing ID
        voteProposal.setId(1L);

        int databaseSizeBeforeCreate = voteProposalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoteProposalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteProposal)))
            .andExpect(status().isBadRequest());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoteProposals() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        // Get all the voteProposalList
        restVoteProposalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voteProposal.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getVoteProposal() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        // Get the voteProposal
        restVoteProposalMockMvc
            .perform(get(ENTITY_API_URL_ID, voteProposal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voteProposal.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingVoteProposal() throws Exception {
        // Get the voteProposal
        restVoteProposalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoteProposal() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();

        // Update the voteProposal
        VoteProposal updatedVoteProposal = voteProposalRepository.findById(voteProposal.getId()).get();
        // Disconnect from session so that the updates on updatedVoteProposal are not directly saved in db
        em.detach(updatedVoteProposal);
        updatedVoteProposal
            .title(UPDATED_TITLE)
            .text(UPDATED_TEXT)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS);

        restVoteProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoteProposal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoteProposal))
            )
            .andExpect(status().isOk());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
        VoteProposal testVoteProposal = voteProposalList.get(voteProposalList.size() - 1);
        assertThat(testVoteProposal.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVoteProposal.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testVoteProposal.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testVoteProposal.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testVoteProposal.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voteProposal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteProposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voteProposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voteProposal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoteProposalWithPatch() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();

        // Update the voteProposal using partial update
        VoteProposal partialUpdatedVoteProposal = new VoteProposal();
        partialUpdatedVoteProposal.setId(voteProposal.getId());

        partialUpdatedVoteProposal.title(UPDATED_TITLE).text(UPDATED_TEXT).endDate(UPDATED_END_DATE).status(UPDATED_STATUS);

        restVoteProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteProposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteProposal))
            )
            .andExpect(status().isOk());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
        VoteProposal testVoteProposal = voteProposalList.get(voteProposalList.size() - 1);
        assertThat(testVoteProposal.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVoteProposal.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testVoteProposal.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testVoteProposal.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testVoteProposal.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateVoteProposalWithPatch() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();

        // Update the voteProposal using partial update
        VoteProposal partialUpdatedVoteProposal = new VoteProposal();
        partialUpdatedVoteProposal.setId(voteProposal.getId());

        partialUpdatedVoteProposal
            .title(UPDATED_TITLE)
            .text(UPDATED_TEXT)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS);

        restVoteProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoteProposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoteProposal))
            )
            .andExpect(status().isOk());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
        VoteProposal testVoteProposal = voteProposalList.get(voteProposalList.size() - 1);
        assertThat(testVoteProposal.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVoteProposal.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testVoteProposal.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testVoteProposal.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testVoteProposal.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voteProposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteProposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voteProposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoteProposal() throws Exception {
        int databaseSizeBeforeUpdate = voteProposalRepository.findAll().size();
        voteProposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoteProposalMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voteProposal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VoteProposal in the database
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoteProposal() throws Exception {
        // Initialize the database
        voteProposalRepository.saveAndFlush(voteProposal);

        int databaseSizeBeforeDelete = voteProposalRepository.findAll().size();

        // Delete the voteProposal
        restVoteProposalMockMvc
            .perform(delete(ENTITY_API_URL_ID, voteProposal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VoteProposal> voteProposalList = voteProposalRepository.findAll();
        assertThat(voteProposalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
