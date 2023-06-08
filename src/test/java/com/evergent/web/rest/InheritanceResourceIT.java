package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.Inheritance;
import com.evergent.repository.InheritanceRepository;
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
 * Integration tests for the {@link InheritanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InheritanceResourceIT {

    private static final LocalDate DEFAULT_OPERATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_OPERATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DOCUMENT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_DOCUMENT_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DOCUMENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DOCUMENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_SHARES_NO = 1;
    private static final Integer UPDATED_SHARES_NO = 2;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/inheritances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InheritanceRepository inheritanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInheritanceMockMvc;

    private Inheritance inheritance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inheritance createEntity(EntityManager em) {
        Inheritance inheritance = new Inheritance()
            .operationDate(DEFAULT_OPERATION_DATE)
            .documentNumber(DEFAULT_DOCUMENT_NUMBER)
            .documentDate(DEFAULT_DOCUMENT_DATE)
            .sharesNo(DEFAULT_SHARES_NO)
            .status(DEFAULT_STATUS);
        return inheritance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inheritance createUpdatedEntity(EntityManager em) {
        Inheritance inheritance = new Inheritance()
            .operationDate(UPDATED_OPERATION_DATE)
            .documentNumber(UPDATED_DOCUMENT_NUMBER)
            .documentDate(UPDATED_DOCUMENT_DATE)
            .sharesNo(UPDATED_SHARES_NO)
            .status(UPDATED_STATUS);
        return inheritance;
    }

    @BeforeEach
    public void initTest() {
        inheritance = createEntity(em);
    }

    @Test
    @Transactional
    void createInheritance() throws Exception {
        int databaseSizeBeforeCreate = inheritanceRepository.findAll().size();
        // Create the Inheritance
        restInheritanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inheritance)))
            .andExpect(status().isCreated());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeCreate + 1);
        Inheritance testInheritance = inheritanceList.get(inheritanceList.size() - 1);
        assertThat(testInheritance.getOperationDate()).isEqualTo(DEFAULT_OPERATION_DATE);
        assertThat(testInheritance.getDocumentNumber()).isEqualTo(DEFAULT_DOCUMENT_NUMBER);
        assertThat(testInheritance.getDocumentDate()).isEqualTo(DEFAULT_DOCUMENT_DATE);
        assertThat(testInheritance.getSharesNo()).isEqualTo(DEFAULT_SHARES_NO);
        assertThat(testInheritance.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createInheritanceWithExistingId() throws Exception {
        // Create the Inheritance with an existing ID
        inheritance.setId(1L);

        int databaseSizeBeforeCreate = inheritanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInheritanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inheritance)))
            .andExpect(status().isBadRequest());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInheritances() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        // Get all the inheritanceList
        restInheritanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inheritance.getId().intValue())))
            .andExpect(jsonPath("$.[*].operationDate").value(hasItem(DEFAULT_OPERATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].documentNumber").value(hasItem(DEFAULT_DOCUMENT_NUMBER)))
            .andExpect(jsonPath("$.[*].documentDate").value(hasItem(DEFAULT_DOCUMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].sharesNo").value(hasItem(DEFAULT_SHARES_NO)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getInheritance() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        // Get the inheritance
        restInheritanceMockMvc
            .perform(get(ENTITY_API_URL_ID, inheritance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inheritance.getId().intValue()))
            .andExpect(jsonPath("$.operationDate").value(DEFAULT_OPERATION_DATE.toString()))
            .andExpect(jsonPath("$.documentNumber").value(DEFAULT_DOCUMENT_NUMBER))
            .andExpect(jsonPath("$.documentDate").value(DEFAULT_DOCUMENT_DATE.toString()))
            .andExpect(jsonPath("$.sharesNo").value(DEFAULT_SHARES_NO))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingInheritance() throws Exception {
        // Get the inheritance
        restInheritanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInheritance() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();

        // Update the inheritance
        Inheritance updatedInheritance = inheritanceRepository.findById(inheritance.getId()).get();
        // Disconnect from session so that the updates on updatedInheritance are not directly saved in db
        em.detach(updatedInheritance);
        updatedInheritance
            .operationDate(UPDATED_OPERATION_DATE)
            .documentNumber(UPDATED_DOCUMENT_NUMBER)
            .documentDate(UPDATED_DOCUMENT_DATE)
            .sharesNo(UPDATED_SHARES_NO)
            .status(UPDATED_STATUS);

        restInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInheritance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInheritance))
            )
            .andExpect(status().isOk());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
        Inheritance testInheritance = inheritanceList.get(inheritanceList.size() - 1);
        assertThat(testInheritance.getOperationDate()).isEqualTo(UPDATED_OPERATION_DATE);
        assertThat(testInheritance.getDocumentNumber()).isEqualTo(UPDATED_DOCUMENT_NUMBER);
        assertThat(testInheritance.getDocumentDate()).isEqualTo(UPDATED_DOCUMENT_DATE);
        assertThat(testInheritance.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testInheritance.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, inheritance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inheritance)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInheritanceWithPatch() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();

        // Update the inheritance using partial update
        Inheritance partialUpdatedInheritance = new Inheritance();
        partialUpdatedInheritance.setId(inheritance.getId());

        partialUpdatedInheritance.documentDate(UPDATED_DOCUMENT_DATE);

        restInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInheritance))
            )
            .andExpect(status().isOk());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
        Inheritance testInheritance = inheritanceList.get(inheritanceList.size() - 1);
        assertThat(testInheritance.getOperationDate()).isEqualTo(DEFAULT_OPERATION_DATE);
        assertThat(testInheritance.getDocumentNumber()).isEqualTo(DEFAULT_DOCUMENT_NUMBER);
        assertThat(testInheritance.getDocumentDate()).isEqualTo(UPDATED_DOCUMENT_DATE);
        assertThat(testInheritance.getSharesNo()).isEqualTo(DEFAULT_SHARES_NO);
        assertThat(testInheritance.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateInheritanceWithPatch() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();

        // Update the inheritance using partial update
        Inheritance partialUpdatedInheritance = new Inheritance();
        partialUpdatedInheritance.setId(inheritance.getId());

        partialUpdatedInheritance
            .operationDate(UPDATED_OPERATION_DATE)
            .documentNumber(UPDATED_DOCUMENT_NUMBER)
            .documentDate(UPDATED_DOCUMENT_DATE)
            .sharesNo(UPDATED_SHARES_NO)
            .status(UPDATED_STATUS);

        restInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInheritance))
            )
            .andExpect(status().isOk());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
        Inheritance testInheritance = inheritanceList.get(inheritanceList.size() - 1);
        assertThat(testInheritance.getOperationDate()).isEqualTo(UPDATED_OPERATION_DATE);
        assertThat(testInheritance.getDocumentNumber()).isEqualTo(UPDATED_DOCUMENT_NUMBER);
        assertThat(testInheritance.getDocumentDate()).isEqualTo(UPDATED_DOCUMENT_DATE);
        assertThat(testInheritance.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testInheritance.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, inheritance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inheritance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInheritance() throws Exception {
        int databaseSizeBeforeUpdate = inheritanceRepository.findAll().size();
        inheritance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInheritanceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(inheritance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inheritance in the database
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInheritance() throws Exception {
        // Initialize the database
        inheritanceRepository.saveAndFlush(inheritance);

        int databaseSizeBeforeDelete = inheritanceRepository.findAll().size();

        // Delete the inheritance
        restInheritanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, inheritance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inheritance> inheritanceList = inheritanceRepository.findAll();
        assertThat(inheritanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
