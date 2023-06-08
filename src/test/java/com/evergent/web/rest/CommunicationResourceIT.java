package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.Communication;
import com.evergent.repository.CommunicationRepository;
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
 * Integration tests for the {@link CommunicationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommunicationResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/communications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommunicationRepository communicationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommunicationMockMvc;

    private Communication communication;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Communication createEntity(EntityManager em) {
        Communication communication = new Communication().type(DEFAULT_TYPE).message(DEFAULT_MESSAGE).status(DEFAULT_STATUS);
        return communication;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Communication createUpdatedEntity(EntityManager em) {
        Communication communication = new Communication().type(UPDATED_TYPE).message(UPDATED_MESSAGE).status(UPDATED_STATUS);
        return communication;
    }

    @BeforeEach
    public void initTest() {
        communication = createEntity(em);
    }

    @Test
    @Transactional
    void createCommunication() throws Exception {
        int databaseSizeBeforeCreate = communicationRepository.findAll().size();
        // Create the Communication
        restCommunicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(communication)))
            .andExpect(status().isCreated());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeCreate + 1);
        Communication testCommunication = communicationList.get(communicationList.size() - 1);
        assertThat(testCommunication.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCommunication.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testCommunication.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createCommunicationWithExistingId() throws Exception {
        // Create the Communication with an existing ID
        communication.setId(1L);

        int databaseSizeBeforeCreate = communicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommunicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(communication)))
            .andExpect(status().isBadRequest());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCommunications() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        // Get all the communicationList
        restCommunicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(communication.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getCommunication() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        // Get the communication
        restCommunicationMockMvc
            .perform(get(ENTITY_API_URL_ID, communication.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(communication.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingCommunication() throws Exception {
        // Get the communication
        restCommunicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCommunication() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();

        // Update the communication
        Communication updatedCommunication = communicationRepository.findById(communication.getId()).get();
        // Disconnect from session so that the updates on updatedCommunication are not directly saved in db
        em.detach(updatedCommunication);
        updatedCommunication.type(UPDATED_TYPE).message(UPDATED_MESSAGE).status(UPDATED_STATUS);

        restCommunicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommunication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommunication))
            )
            .andExpect(status().isOk());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
        Communication testCommunication = communicationList.get(communicationList.size() - 1);
        assertThat(testCommunication.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCommunication.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testCommunication.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, communication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(communication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(communication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(communication)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommunicationWithPatch() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();

        // Update the communication using partial update
        Communication partialUpdatedCommunication = new Communication();
        partialUpdatedCommunication.setId(communication.getId());

        partialUpdatedCommunication.type(UPDATED_TYPE).message(UPDATED_MESSAGE).status(UPDATED_STATUS);

        restCommunicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommunication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommunication))
            )
            .andExpect(status().isOk());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
        Communication testCommunication = communicationList.get(communicationList.size() - 1);
        assertThat(testCommunication.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCommunication.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testCommunication.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateCommunicationWithPatch() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();

        // Update the communication using partial update
        Communication partialUpdatedCommunication = new Communication();
        partialUpdatedCommunication.setId(communication.getId());

        partialUpdatedCommunication.type(UPDATED_TYPE).message(UPDATED_MESSAGE).status(UPDATED_STATUS);

        restCommunicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommunication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommunication))
            )
            .andExpect(status().isOk());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
        Communication testCommunication = communicationList.get(communicationList.size() - 1);
        assertThat(testCommunication.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCommunication.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testCommunication.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, communication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(communication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(communication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommunication() throws Exception {
        int databaseSizeBeforeUpdate = communicationRepository.findAll().size();
        communication.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommunicationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(communication))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Communication in the database
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommunication() throws Exception {
        // Initialize the database
        communicationRepository.saveAndFlush(communication);

        int databaseSizeBeforeDelete = communicationRepository.findAll().size();

        // Delete the communication
        restCommunicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, communication.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Communication> communicationList = communicationRepository.findAll();
        assertThat(communicationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}