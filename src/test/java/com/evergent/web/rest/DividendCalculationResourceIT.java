package com.evergent.web.rest;

import static com.evergent.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.DividendCalculation;
import com.evergent.repository.DividendCalculationRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link DividendCalculationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DividendCalculationResourceIT {

    private static final BigDecimal DEFAULT_TOTAL_NET_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_NET_AMOUNT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_TAX_AMOUNT_CALCULATED = new BigDecimal(1);
    private static final BigDecimal UPDATED_TAX_AMOUNT_CALCULATED = new BigDecimal(2);

    private static final BigDecimal DEFAULT_TOTAL_GROSS_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_GROSS_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/dividend-calculations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DividendCalculationRepository dividendCalculationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDividendCalculationMockMvc;

    private DividendCalculation dividendCalculation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendCalculation createEntity(EntityManager em) {
        DividendCalculation dividendCalculation = new DividendCalculation()
            .totalNetAmount(DEFAULT_TOTAL_NET_AMOUNT)
            .taxAmountCalculated(DEFAULT_TAX_AMOUNT_CALCULATED)
            .totalGrossAmount(DEFAULT_TOTAL_GROSS_AMOUNT);
        return dividendCalculation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendCalculation createUpdatedEntity(EntityManager em) {
        DividendCalculation dividendCalculation = new DividendCalculation()
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT)
            .taxAmountCalculated(UPDATED_TAX_AMOUNT_CALCULATED)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT);
        return dividendCalculation;
    }

    @BeforeEach
    public void initTest() {
        dividendCalculation = createEntity(em);
    }

    @Test
    @Transactional
    void createDividendCalculation() throws Exception {
        int databaseSizeBeforeCreate = dividendCalculationRepository.findAll().size();
        // Create the DividendCalculation
        restDividendCalculationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isCreated());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeCreate + 1);
        DividendCalculation testDividendCalculation = dividendCalculationList.get(dividendCalculationList.size() - 1);
        assertThat(testDividendCalculation.getTotalNetAmount()).isEqualByComparingTo(DEFAULT_TOTAL_NET_AMOUNT);
        assertThat(testDividendCalculation.getTaxAmountCalculated()).isEqualByComparingTo(DEFAULT_TAX_AMOUNT_CALCULATED);
        assertThat(testDividendCalculation.getTotalGrossAmount()).isEqualByComparingTo(DEFAULT_TOTAL_GROSS_AMOUNT);
    }

    @Test
    @Transactional
    void createDividendCalculationWithExistingId() throws Exception {
        // Create the DividendCalculation with an existing ID
        dividendCalculation.setId(1L);

        int databaseSizeBeforeCreate = dividendCalculationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDividendCalculationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDividendCalculations() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        // Get all the dividendCalculationList
        restDividendCalculationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dividendCalculation.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalNetAmount").value(hasItem(sameNumber(DEFAULT_TOTAL_NET_AMOUNT))))
            .andExpect(jsonPath("$.[*].taxAmountCalculated").value(hasItem(sameNumber(DEFAULT_TAX_AMOUNT_CALCULATED))))
            .andExpect(jsonPath("$.[*].totalGrossAmount").value(hasItem(sameNumber(DEFAULT_TOTAL_GROSS_AMOUNT))));
    }

    @Test
    @Transactional
    void getDividendCalculation() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        // Get the dividendCalculation
        restDividendCalculationMockMvc
            .perform(get(ENTITY_API_URL_ID, dividendCalculation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dividendCalculation.getId().intValue()))
            .andExpect(jsonPath("$.totalNetAmount").value(sameNumber(DEFAULT_TOTAL_NET_AMOUNT)))
            .andExpect(jsonPath("$.taxAmountCalculated").value(sameNumber(DEFAULT_TAX_AMOUNT_CALCULATED)))
            .andExpect(jsonPath("$.totalGrossAmount").value(sameNumber(DEFAULT_TOTAL_GROSS_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingDividendCalculation() throws Exception {
        // Get the dividendCalculation
        restDividendCalculationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDividendCalculation() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();

        // Update the dividendCalculation
        DividendCalculation updatedDividendCalculation = dividendCalculationRepository.findById(dividendCalculation.getId()).get();
        // Disconnect from session so that the updates on updatedDividendCalculation are not directly saved in db
        em.detach(updatedDividendCalculation);
        updatedDividendCalculation
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT)
            .taxAmountCalculated(UPDATED_TAX_AMOUNT_CALCULATED)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT);

        restDividendCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDividendCalculation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDividendCalculation))
            )
            .andExpect(status().isOk());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
        DividendCalculation testDividendCalculation = dividendCalculationList.get(dividendCalculationList.size() - 1);
        assertThat(testDividendCalculation.getTotalNetAmount()).isEqualByComparingTo(UPDATED_TOTAL_NET_AMOUNT);
        assertThat(testDividendCalculation.getTaxAmountCalculated()).isEqualByComparingTo(UPDATED_TAX_AMOUNT_CALCULATED);
        assertThat(testDividendCalculation.getTotalGrossAmount()).isEqualByComparingTo(UPDATED_TOTAL_GROSS_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dividendCalculation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDividendCalculationWithPatch() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();

        // Update the dividendCalculation using partial update
        DividendCalculation partialUpdatedDividendCalculation = new DividendCalculation();
        partialUpdatedDividendCalculation.setId(dividendCalculation.getId());

        partialUpdatedDividendCalculation.totalNetAmount(UPDATED_TOTAL_NET_AMOUNT).totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT);

        restDividendCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendCalculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendCalculation))
            )
            .andExpect(status().isOk());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
        DividendCalculation testDividendCalculation = dividendCalculationList.get(dividendCalculationList.size() - 1);
        assertThat(testDividendCalculation.getTotalNetAmount()).isEqualByComparingTo(UPDATED_TOTAL_NET_AMOUNT);
        assertThat(testDividendCalculation.getTaxAmountCalculated()).isEqualByComparingTo(DEFAULT_TAX_AMOUNT_CALCULATED);
        assertThat(testDividendCalculation.getTotalGrossAmount()).isEqualByComparingTo(UPDATED_TOTAL_GROSS_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateDividendCalculationWithPatch() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();

        // Update the dividendCalculation using partial update
        DividendCalculation partialUpdatedDividendCalculation = new DividendCalculation();
        partialUpdatedDividendCalculation.setId(dividendCalculation.getId());

        partialUpdatedDividendCalculation
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT)
            .taxAmountCalculated(UPDATED_TAX_AMOUNT_CALCULATED)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT);

        restDividendCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendCalculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendCalculation))
            )
            .andExpect(status().isOk());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
        DividendCalculation testDividendCalculation = dividendCalculationList.get(dividendCalculationList.size() - 1);
        assertThat(testDividendCalculation.getTotalNetAmount()).isEqualByComparingTo(UPDATED_TOTAL_NET_AMOUNT);
        assertThat(testDividendCalculation.getTaxAmountCalculated()).isEqualByComparingTo(UPDATED_TAX_AMOUNT_CALCULATED);
        assertThat(testDividendCalculation.getTotalGrossAmount()).isEqualByComparingTo(UPDATED_TOTAL_GROSS_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dividendCalculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDividendCalculation() throws Exception {
        int databaseSizeBeforeUpdate = dividendCalculationRepository.findAll().size();
        dividendCalculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendCalculation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendCalculation in the database
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDividendCalculation() throws Exception {
        // Initialize the database
        dividendCalculationRepository.saveAndFlush(dividendCalculation);

        int databaseSizeBeforeDelete = dividendCalculationRepository.findAll().size();

        // Delete the dividendCalculation
        restDividendCalculationMockMvc
            .perform(delete(ENTITY_API_URL_ID, dividendCalculation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DividendCalculation> dividendCalculationList = dividendCalculationRepository.findAll();
        assertThat(dividendCalculationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
