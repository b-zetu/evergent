package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.DividendShareholder;
import com.evergent.repository.DividendShareholderRepository;
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
 * Integration tests for the {@link DividendShareholderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DividendShareholderResourceIT {

    private static final Integer DEFAULT_SHARES_NO = 1;
    private static final Integer UPDATED_SHARES_NO = 2;

    private static final Boolean DEFAULT_IS_RESIDENT = false;
    private static final Boolean UPDATED_IS_RESIDENT = true;

    private static final Integer DEFAULT_TAX_VALUE = 1;
    private static final Integer UPDATED_TAX_VALUE = 2;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/dividend-shareholders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DividendShareholderRepository dividendShareholderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDividendShareholderMockMvc;

    private DividendShareholder dividendShareholder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendShareholder createEntity(EntityManager em) {
        DividendShareholder dividendShareholder = new DividendShareholder()
            .sharesNo(DEFAULT_SHARES_NO)
            .isResident(DEFAULT_IS_RESIDENT)
            .taxValue(DEFAULT_TAX_VALUE)
            .status(DEFAULT_STATUS);
        return dividendShareholder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendShareholder createUpdatedEntity(EntityManager em) {
        DividendShareholder dividendShareholder = new DividendShareholder()
            .sharesNo(UPDATED_SHARES_NO)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS);
        return dividendShareholder;
    }

    @BeforeEach
    public void initTest() {
        dividendShareholder = createEntity(em);
    }

    @Test
    @Transactional
    void createDividendShareholder() throws Exception {
        int databaseSizeBeforeCreate = dividendShareholderRepository.findAll().size();
        // Create the DividendShareholder
        restDividendShareholderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isCreated());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeCreate + 1);
        DividendShareholder testDividendShareholder = dividendShareholderList.get(dividendShareholderList.size() - 1);
        assertThat(testDividendShareholder.getSharesNo()).isEqualTo(DEFAULT_SHARES_NO);
        assertThat(testDividendShareholder.getIsResident()).isEqualTo(DEFAULT_IS_RESIDENT);
        assertThat(testDividendShareholder.getTaxValue()).isEqualTo(DEFAULT_TAX_VALUE);
        assertThat(testDividendShareholder.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createDividendShareholderWithExistingId() throws Exception {
        // Create the DividendShareholder with an existing ID
        dividendShareholder.setId(1L);

        int databaseSizeBeforeCreate = dividendShareholderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDividendShareholderMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDividendShareholders() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        // Get all the dividendShareholderList
        restDividendShareholderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dividendShareholder.getId().intValue())))
            .andExpect(jsonPath("$.[*].sharesNo").value(hasItem(DEFAULT_SHARES_NO)))
            .andExpect(jsonPath("$.[*].isResident").value(hasItem(DEFAULT_IS_RESIDENT.booleanValue())))
            .andExpect(jsonPath("$.[*].taxValue").value(hasItem(DEFAULT_TAX_VALUE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getDividendShareholder() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        // Get the dividendShareholder
        restDividendShareholderMockMvc
            .perform(get(ENTITY_API_URL_ID, dividendShareholder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dividendShareholder.getId().intValue()))
            .andExpect(jsonPath("$.sharesNo").value(DEFAULT_SHARES_NO))
            .andExpect(jsonPath("$.isResident").value(DEFAULT_IS_RESIDENT.booleanValue()))
            .andExpect(jsonPath("$.taxValue").value(DEFAULT_TAX_VALUE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingDividendShareholder() throws Exception {
        // Get the dividendShareholder
        restDividendShareholderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDividendShareholder() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();

        // Update the dividendShareholder
        DividendShareholder updatedDividendShareholder = dividendShareholderRepository.findById(dividendShareholder.getId()).get();
        // Disconnect from session so that the updates on updatedDividendShareholder are not directly saved in db
        em.detach(updatedDividendShareholder);
        updatedDividendShareholder
            .sharesNo(UPDATED_SHARES_NO)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS);

        restDividendShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDividendShareholder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDividendShareholder))
            )
            .andExpect(status().isOk());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
        DividendShareholder testDividendShareholder = dividendShareholderList.get(dividendShareholderList.size() - 1);
        assertThat(testDividendShareholder.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testDividendShareholder.getIsResident()).isEqualTo(UPDATED_IS_RESIDENT);
        assertThat(testDividendShareholder.getTaxValue()).isEqualTo(UPDATED_TAX_VALUE);
        assertThat(testDividendShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dividendShareholder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDividendShareholderWithPatch() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();

        // Update the dividendShareholder using partial update
        DividendShareholder partialUpdatedDividendShareholder = new DividendShareholder();
        partialUpdatedDividendShareholder.setId(dividendShareholder.getId());

        partialUpdatedDividendShareholder.taxValue(UPDATED_TAX_VALUE).status(UPDATED_STATUS);

        restDividendShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendShareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendShareholder))
            )
            .andExpect(status().isOk());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
        DividendShareholder testDividendShareholder = dividendShareholderList.get(dividendShareholderList.size() - 1);
        assertThat(testDividendShareholder.getSharesNo()).isEqualTo(DEFAULT_SHARES_NO);
        assertThat(testDividendShareholder.getIsResident()).isEqualTo(DEFAULT_IS_RESIDENT);
        assertThat(testDividendShareholder.getTaxValue()).isEqualTo(UPDATED_TAX_VALUE);
        assertThat(testDividendShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateDividendShareholderWithPatch() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();

        // Update the dividendShareholder using partial update
        DividendShareholder partialUpdatedDividendShareholder = new DividendShareholder();
        partialUpdatedDividendShareholder.setId(dividendShareholder.getId());

        partialUpdatedDividendShareholder
            .sharesNo(UPDATED_SHARES_NO)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS);

        restDividendShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendShareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendShareholder))
            )
            .andExpect(status().isOk());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
        DividendShareholder testDividendShareholder = dividendShareholderList.get(dividendShareholderList.size() - 1);
        assertThat(testDividendShareholder.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testDividendShareholder.getIsResident()).isEqualTo(UPDATED_IS_RESIDENT);
        assertThat(testDividendShareholder.getTaxValue()).isEqualTo(UPDATED_TAX_VALUE);
        assertThat(testDividendShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dividendShareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDividendShareholder() throws Exception {
        int databaseSizeBeforeUpdate = dividendShareholderRepository.findAll().size();
        dividendShareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendShareholder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendShareholder in the database
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDividendShareholder() throws Exception {
        // Initialize the database
        dividendShareholderRepository.saveAndFlush(dividendShareholder);

        int databaseSizeBeforeDelete = dividendShareholderRepository.findAll().size();

        // Delete the dividendShareholder
        restDividendShareholderMockMvc
            .perform(delete(ENTITY_API_URL_ID, dividendShareholder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DividendShareholder> dividendShareholderList = dividendShareholderRepository.findAll();
        assertThat(dividendShareholderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
