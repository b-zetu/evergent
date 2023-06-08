package com.evergent.web.rest;

import static com.evergent.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.DividendRegister;
import com.evergent.repository.DividendRegisterRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link DividendRegisterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DividendRegisterResourceIT {

    private static final LocalDate DEFAULT_REFERENCE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_REFERENCE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_DIVIDEND_GROSS_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_DIVIDEND_GROSS_VALUE = new BigDecimal(2);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/dividend-registers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DividendRegisterRepository dividendRegisterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDividendRegisterMockMvc;

    private DividendRegister dividendRegister;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendRegister createEntity(EntityManager em) {
        DividendRegister dividendRegister = new DividendRegister()
            .referenceDate(DEFAULT_REFERENCE_DATE)
            .dividendGrossValue(DEFAULT_DIVIDEND_GROSS_VALUE)
            .status(DEFAULT_STATUS);
        return dividendRegister;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DividendRegister createUpdatedEntity(EntityManager em) {
        DividendRegister dividendRegister = new DividendRegister()
            .referenceDate(UPDATED_REFERENCE_DATE)
            .dividendGrossValue(UPDATED_DIVIDEND_GROSS_VALUE)
            .status(UPDATED_STATUS);
        return dividendRegister;
    }

    @BeforeEach
    public void initTest() {
        dividendRegister = createEntity(em);
    }

    @Test
    @Transactional
    void createDividendRegister() throws Exception {
        int databaseSizeBeforeCreate = dividendRegisterRepository.findAll().size();
        // Create the DividendRegister
        restDividendRegisterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isCreated());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeCreate + 1);
        DividendRegister testDividendRegister = dividendRegisterList.get(dividendRegisterList.size() - 1);
        assertThat(testDividendRegister.getReferenceDate()).isEqualTo(DEFAULT_REFERENCE_DATE);
        assertThat(testDividendRegister.getDividendGrossValue()).isEqualByComparingTo(DEFAULT_DIVIDEND_GROSS_VALUE);
        assertThat(testDividendRegister.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createDividendRegisterWithExistingId() throws Exception {
        // Create the DividendRegister with an existing ID
        dividendRegister.setId(1L);

        int databaseSizeBeforeCreate = dividendRegisterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDividendRegisterMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDividendRegisters() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        // Get all the dividendRegisterList
        restDividendRegisterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dividendRegister.getId().intValue())))
            .andExpect(jsonPath("$.[*].referenceDate").value(hasItem(DEFAULT_REFERENCE_DATE.toString())))
            .andExpect(jsonPath("$.[*].dividendGrossValue").value(hasItem(sameNumber(DEFAULT_DIVIDEND_GROSS_VALUE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getDividendRegister() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        // Get the dividendRegister
        restDividendRegisterMockMvc
            .perform(get(ENTITY_API_URL_ID, dividendRegister.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dividendRegister.getId().intValue()))
            .andExpect(jsonPath("$.referenceDate").value(DEFAULT_REFERENCE_DATE.toString()))
            .andExpect(jsonPath("$.dividendGrossValue").value(sameNumber(DEFAULT_DIVIDEND_GROSS_VALUE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingDividendRegister() throws Exception {
        // Get the dividendRegister
        restDividendRegisterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDividendRegister() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();

        // Update the dividendRegister
        DividendRegister updatedDividendRegister = dividendRegisterRepository.findById(dividendRegister.getId()).get();
        // Disconnect from session so that the updates on updatedDividendRegister are not directly saved in db
        em.detach(updatedDividendRegister);
        updatedDividendRegister
            .referenceDate(UPDATED_REFERENCE_DATE)
            .dividendGrossValue(UPDATED_DIVIDEND_GROSS_VALUE)
            .status(UPDATED_STATUS);

        restDividendRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDividendRegister.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDividendRegister))
            )
            .andExpect(status().isOk());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
        DividendRegister testDividendRegister = dividendRegisterList.get(dividendRegisterList.size() - 1);
        assertThat(testDividendRegister.getReferenceDate()).isEqualTo(UPDATED_REFERENCE_DATE);
        assertThat(testDividendRegister.getDividendGrossValue()).isEqualByComparingTo(UPDATED_DIVIDEND_GROSS_VALUE);
        assertThat(testDividendRegister.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dividendRegister.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDividendRegisterWithPatch() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();

        // Update the dividendRegister using partial update
        DividendRegister partialUpdatedDividendRegister = new DividendRegister();
        partialUpdatedDividendRegister.setId(dividendRegister.getId());

        partialUpdatedDividendRegister.referenceDate(UPDATED_REFERENCE_DATE).status(UPDATED_STATUS);

        restDividendRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendRegister))
            )
            .andExpect(status().isOk());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
        DividendRegister testDividendRegister = dividendRegisterList.get(dividendRegisterList.size() - 1);
        assertThat(testDividendRegister.getReferenceDate()).isEqualTo(UPDATED_REFERENCE_DATE);
        assertThat(testDividendRegister.getDividendGrossValue()).isEqualByComparingTo(DEFAULT_DIVIDEND_GROSS_VALUE);
        assertThat(testDividendRegister.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateDividendRegisterWithPatch() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();

        // Update the dividendRegister using partial update
        DividendRegister partialUpdatedDividendRegister = new DividendRegister();
        partialUpdatedDividendRegister.setId(dividendRegister.getId());

        partialUpdatedDividendRegister
            .referenceDate(UPDATED_REFERENCE_DATE)
            .dividendGrossValue(UPDATED_DIVIDEND_GROSS_VALUE)
            .status(UPDATED_STATUS);

        restDividendRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDividendRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDividendRegister))
            )
            .andExpect(status().isOk());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
        DividendRegister testDividendRegister = dividendRegisterList.get(dividendRegisterList.size() - 1);
        assertThat(testDividendRegister.getReferenceDate()).isEqualTo(UPDATED_REFERENCE_DATE);
        assertThat(testDividendRegister.getDividendGrossValue()).isEqualByComparingTo(UPDATED_DIVIDEND_GROSS_VALUE);
        assertThat(testDividendRegister.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dividendRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDividendRegister() throws Exception {
        int databaseSizeBeforeUpdate = dividendRegisterRepository.findAll().size();
        dividendRegister.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDividendRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dividendRegister))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DividendRegister in the database
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDividendRegister() throws Exception {
        // Initialize the database
        dividendRegisterRepository.saveAndFlush(dividendRegister);

        int databaseSizeBeforeDelete = dividendRegisterRepository.findAll().size();

        // Delete the dividendRegister
        restDividendRegisterMockMvc
            .perform(delete(ENTITY_API_URL_ID, dividendRegister.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DividendRegister> dividendRegisterList = dividendRegisterRepository.findAll();
        assertThat(dividendRegisterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
