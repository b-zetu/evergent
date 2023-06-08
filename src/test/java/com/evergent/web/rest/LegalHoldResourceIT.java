package com.evergent.web.rest;

import static com.evergent.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.LegalHold;
import com.evergent.repository.LegalHoldRepository;
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
 * Integration tests for the {@link LegalHoldResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LegalHoldResourceIT {

    private static final String DEFAULT_BENEFICIARY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_BENEFICIARY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_TOTAL_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_AMOUNT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_AMOUNT_LEFT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT_LEFT = new BigDecimal(2);

    private static final String DEFAULT_POPRIRE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_POPRIRE_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_POPRIRE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_POPRIRE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_POPRIRE_DOCUMENT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_POPRIRE_DOCUMENT_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_POPRIRE_DOCUMENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_POPRIRE_DOCUMENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SISTARE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SISTARE_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SISTARE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SISTARE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SISTARE_INTRARE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SISTARE_INTRARE_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SISTARE_INTRARE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SISTARE_INTRARE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/legal-holds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LegalHoldRepository legalHoldRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLegalHoldMockMvc;

    private LegalHold legalHold;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalHold createEntity(EntityManager em) {
        LegalHold legalHold = new LegalHold()
            .beneficiaryName(DEFAULT_BENEFICIARY_NAME)
            .type(DEFAULT_TYPE)
            .totalAmount(DEFAULT_TOTAL_AMOUNT)
            .amountLeft(DEFAULT_AMOUNT_LEFT)
            .poprireNumber(DEFAULT_POPRIRE_NUMBER)
            .poprireDate(DEFAULT_POPRIRE_DATE)
            .poprireDocumentNumber(DEFAULT_POPRIRE_DOCUMENT_NUMBER)
            .poprireDocumentDate(DEFAULT_POPRIRE_DOCUMENT_DATE)
            .sistareNumber(DEFAULT_SISTARE_NUMBER)
            .sistareDate(DEFAULT_SISTARE_DATE)
            .sistareIntrareNumber(DEFAULT_SISTARE_INTRARE_NUMBER)
            .sistareIntrareDate(DEFAULT_SISTARE_INTRARE_DATE)
            .status(DEFAULT_STATUS);
        return legalHold;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalHold createUpdatedEntity(EntityManager em) {
        LegalHold legalHold = new LegalHold()
            .beneficiaryName(UPDATED_BENEFICIARY_NAME)
            .type(UPDATED_TYPE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .amountLeft(UPDATED_AMOUNT_LEFT)
            .poprireNumber(UPDATED_POPRIRE_NUMBER)
            .poprireDate(UPDATED_POPRIRE_DATE)
            .poprireDocumentNumber(UPDATED_POPRIRE_DOCUMENT_NUMBER)
            .poprireDocumentDate(UPDATED_POPRIRE_DOCUMENT_DATE)
            .sistareNumber(UPDATED_SISTARE_NUMBER)
            .sistareDate(UPDATED_SISTARE_DATE)
            .sistareIntrareNumber(UPDATED_SISTARE_INTRARE_NUMBER)
            .sistareIntrareDate(UPDATED_SISTARE_INTRARE_DATE)
            .status(UPDATED_STATUS);
        return legalHold;
    }

    @BeforeEach
    public void initTest() {
        legalHold = createEntity(em);
    }

    @Test
    @Transactional
    void createLegalHold() throws Exception {
        int databaseSizeBeforeCreate = legalHoldRepository.findAll().size();
        // Create the LegalHold
        restLegalHoldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalHold)))
            .andExpect(status().isCreated());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeCreate + 1);
        LegalHold testLegalHold = legalHoldList.get(legalHoldList.size() - 1);
        assertThat(testLegalHold.getBeneficiaryName()).isEqualTo(DEFAULT_BENEFICIARY_NAME);
        assertThat(testLegalHold.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testLegalHold.getTotalAmount()).isEqualByComparingTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testLegalHold.getAmountLeft()).isEqualByComparingTo(DEFAULT_AMOUNT_LEFT);
        assertThat(testLegalHold.getPoprireNumber()).isEqualTo(DEFAULT_POPRIRE_NUMBER);
        assertThat(testLegalHold.getPoprireDate()).isEqualTo(DEFAULT_POPRIRE_DATE);
        assertThat(testLegalHold.getPoprireDocumentNumber()).isEqualTo(DEFAULT_POPRIRE_DOCUMENT_NUMBER);
        assertThat(testLegalHold.getPoprireDocumentDate()).isEqualTo(DEFAULT_POPRIRE_DOCUMENT_DATE);
        assertThat(testLegalHold.getSistareNumber()).isEqualTo(DEFAULT_SISTARE_NUMBER);
        assertThat(testLegalHold.getSistareDate()).isEqualTo(DEFAULT_SISTARE_DATE);
        assertThat(testLegalHold.getSistareIntrareNumber()).isEqualTo(DEFAULT_SISTARE_INTRARE_NUMBER);
        assertThat(testLegalHold.getSistareIntrareDate()).isEqualTo(DEFAULT_SISTARE_INTRARE_DATE);
        assertThat(testLegalHold.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createLegalHoldWithExistingId() throws Exception {
        // Create the LegalHold with an existing ID
        legalHold.setId(1L);

        int databaseSizeBeforeCreate = legalHoldRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLegalHoldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalHold)))
            .andExpect(status().isBadRequest());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLegalHolds() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        // Get all the legalHoldList
        restLegalHoldMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(legalHold.getId().intValue())))
            .andExpect(jsonPath("$.[*].beneficiaryName").value(hasItem(DEFAULT_BENEFICIARY_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(sameNumber(DEFAULT_TOTAL_AMOUNT))))
            .andExpect(jsonPath("$.[*].amountLeft").value(hasItem(sameNumber(DEFAULT_AMOUNT_LEFT))))
            .andExpect(jsonPath("$.[*].poprireNumber").value(hasItem(DEFAULT_POPRIRE_NUMBER)))
            .andExpect(jsonPath("$.[*].poprireDate").value(hasItem(DEFAULT_POPRIRE_DATE.toString())))
            .andExpect(jsonPath("$.[*].poprireDocumentNumber").value(hasItem(DEFAULT_POPRIRE_DOCUMENT_NUMBER)))
            .andExpect(jsonPath("$.[*].poprireDocumentDate").value(hasItem(DEFAULT_POPRIRE_DOCUMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].sistareNumber").value(hasItem(DEFAULT_SISTARE_NUMBER)))
            .andExpect(jsonPath("$.[*].sistareDate").value(hasItem(DEFAULT_SISTARE_DATE.toString())))
            .andExpect(jsonPath("$.[*].sistareIntrareNumber").value(hasItem(DEFAULT_SISTARE_INTRARE_NUMBER)))
            .andExpect(jsonPath("$.[*].sistareIntrareDate").value(hasItem(DEFAULT_SISTARE_INTRARE_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getLegalHold() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        // Get the legalHold
        restLegalHoldMockMvc
            .perform(get(ENTITY_API_URL_ID, legalHold.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(legalHold.getId().intValue()))
            .andExpect(jsonPath("$.beneficiaryName").value(DEFAULT_BENEFICIARY_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.totalAmount").value(sameNumber(DEFAULT_TOTAL_AMOUNT)))
            .andExpect(jsonPath("$.amountLeft").value(sameNumber(DEFAULT_AMOUNT_LEFT)))
            .andExpect(jsonPath("$.poprireNumber").value(DEFAULT_POPRIRE_NUMBER))
            .andExpect(jsonPath("$.poprireDate").value(DEFAULT_POPRIRE_DATE.toString()))
            .andExpect(jsonPath("$.poprireDocumentNumber").value(DEFAULT_POPRIRE_DOCUMENT_NUMBER))
            .andExpect(jsonPath("$.poprireDocumentDate").value(DEFAULT_POPRIRE_DOCUMENT_DATE.toString()))
            .andExpect(jsonPath("$.sistareNumber").value(DEFAULT_SISTARE_NUMBER))
            .andExpect(jsonPath("$.sistareDate").value(DEFAULT_SISTARE_DATE.toString()))
            .andExpect(jsonPath("$.sistareIntrareNumber").value(DEFAULT_SISTARE_INTRARE_NUMBER))
            .andExpect(jsonPath("$.sistareIntrareDate").value(DEFAULT_SISTARE_INTRARE_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingLegalHold() throws Exception {
        // Get the legalHold
        restLegalHoldMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLegalHold() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();

        // Update the legalHold
        LegalHold updatedLegalHold = legalHoldRepository.findById(legalHold.getId()).get();
        // Disconnect from session so that the updates on updatedLegalHold are not directly saved in db
        em.detach(updatedLegalHold);
        updatedLegalHold
            .beneficiaryName(UPDATED_BENEFICIARY_NAME)
            .type(UPDATED_TYPE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .amountLeft(UPDATED_AMOUNT_LEFT)
            .poprireNumber(UPDATED_POPRIRE_NUMBER)
            .poprireDate(UPDATED_POPRIRE_DATE)
            .poprireDocumentNumber(UPDATED_POPRIRE_DOCUMENT_NUMBER)
            .poprireDocumentDate(UPDATED_POPRIRE_DOCUMENT_DATE)
            .sistareNumber(UPDATED_SISTARE_NUMBER)
            .sistareDate(UPDATED_SISTARE_DATE)
            .sistareIntrareNumber(UPDATED_SISTARE_INTRARE_NUMBER)
            .sistareIntrareDate(UPDATED_SISTARE_INTRARE_DATE)
            .status(UPDATED_STATUS);

        restLegalHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLegalHold.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLegalHold))
            )
            .andExpect(status().isOk());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
        LegalHold testLegalHold = legalHoldList.get(legalHoldList.size() - 1);
        assertThat(testLegalHold.getBeneficiaryName()).isEqualTo(UPDATED_BENEFICIARY_NAME);
        assertThat(testLegalHold.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLegalHold.getTotalAmount()).isEqualByComparingTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testLegalHold.getAmountLeft()).isEqualByComparingTo(UPDATED_AMOUNT_LEFT);
        assertThat(testLegalHold.getPoprireNumber()).isEqualTo(UPDATED_POPRIRE_NUMBER);
        assertThat(testLegalHold.getPoprireDate()).isEqualTo(UPDATED_POPRIRE_DATE);
        assertThat(testLegalHold.getPoprireDocumentNumber()).isEqualTo(UPDATED_POPRIRE_DOCUMENT_NUMBER);
        assertThat(testLegalHold.getPoprireDocumentDate()).isEqualTo(UPDATED_POPRIRE_DOCUMENT_DATE);
        assertThat(testLegalHold.getSistareNumber()).isEqualTo(UPDATED_SISTARE_NUMBER);
        assertThat(testLegalHold.getSistareDate()).isEqualTo(UPDATED_SISTARE_DATE);
        assertThat(testLegalHold.getSistareIntrareNumber()).isEqualTo(UPDATED_SISTARE_INTRARE_NUMBER);
        assertThat(testLegalHold.getSistareIntrareDate()).isEqualTo(UPDATED_SISTARE_INTRARE_DATE);
        assertThat(testLegalHold.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, legalHold.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalHold))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalHold))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalHold)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLegalHoldWithPatch() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();

        // Update the legalHold using partial update
        LegalHold partialUpdatedLegalHold = new LegalHold();
        partialUpdatedLegalHold.setId(legalHold.getId());

        partialUpdatedLegalHold
            .type(UPDATED_TYPE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .amountLeft(UPDATED_AMOUNT_LEFT)
            .poprireDocumentNumber(UPDATED_POPRIRE_DOCUMENT_NUMBER)
            .sistareIntrareDate(UPDATED_SISTARE_INTRARE_DATE)
            .status(UPDATED_STATUS);

        restLegalHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalHold.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalHold))
            )
            .andExpect(status().isOk());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
        LegalHold testLegalHold = legalHoldList.get(legalHoldList.size() - 1);
        assertThat(testLegalHold.getBeneficiaryName()).isEqualTo(DEFAULT_BENEFICIARY_NAME);
        assertThat(testLegalHold.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLegalHold.getTotalAmount()).isEqualByComparingTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testLegalHold.getAmountLeft()).isEqualByComparingTo(UPDATED_AMOUNT_LEFT);
        assertThat(testLegalHold.getPoprireNumber()).isEqualTo(DEFAULT_POPRIRE_NUMBER);
        assertThat(testLegalHold.getPoprireDate()).isEqualTo(DEFAULT_POPRIRE_DATE);
        assertThat(testLegalHold.getPoprireDocumentNumber()).isEqualTo(UPDATED_POPRIRE_DOCUMENT_NUMBER);
        assertThat(testLegalHold.getPoprireDocumentDate()).isEqualTo(DEFAULT_POPRIRE_DOCUMENT_DATE);
        assertThat(testLegalHold.getSistareNumber()).isEqualTo(DEFAULT_SISTARE_NUMBER);
        assertThat(testLegalHold.getSistareDate()).isEqualTo(DEFAULT_SISTARE_DATE);
        assertThat(testLegalHold.getSistareIntrareNumber()).isEqualTo(DEFAULT_SISTARE_INTRARE_NUMBER);
        assertThat(testLegalHold.getSistareIntrareDate()).isEqualTo(UPDATED_SISTARE_INTRARE_DATE);
        assertThat(testLegalHold.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateLegalHoldWithPatch() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();

        // Update the legalHold using partial update
        LegalHold partialUpdatedLegalHold = new LegalHold();
        partialUpdatedLegalHold.setId(legalHold.getId());

        partialUpdatedLegalHold
            .beneficiaryName(UPDATED_BENEFICIARY_NAME)
            .type(UPDATED_TYPE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .amountLeft(UPDATED_AMOUNT_LEFT)
            .poprireNumber(UPDATED_POPRIRE_NUMBER)
            .poprireDate(UPDATED_POPRIRE_DATE)
            .poprireDocumentNumber(UPDATED_POPRIRE_DOCUMENT_NUMBER)
            .poprireDocumentDate(UPDATED_POPRIRE_DOCUMENT_DATE)
            .sistareNumber(UPDATED_SISTARE_NUMBER)
            .sistareDate(UPDATED_SISTARE_DATE)
            .sistareIntrareNumber(UPDATED_SISTARE_INTRARE_NUMBER)
            .sistareIntrareDate(UPDATED_SISTARE_INTRARE_DATE)
            .status(UPDATED_STATUS);

        restLegalHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalHold.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalHold))
            )
            .andExpect(status().isOk());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
        LegalHold testLegalHold = legalHoldList.get(legalHoldList.size() - 1);
        assertThat(testLegalHold.getBeneficiaryName()).isEqualTo(UPDATED_BENEFICIARY_NAME);
        assertThat(testLegalHold.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLegalHold.getTotalAmount()).isEqualByComparingTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testLegalHold.getAmountLeft()).isEqualByComparingTo(UPDATED_AMOUNT_LEFT);
        assertThat(testLegalHold.getPoprireNumber()).isEqualTo(UPDATED_POPRIRE_NUMBER);
        assertThat(testLegalHold.getPoprireDate()).isEqualTo(UPDATED_POPRIRE_DATE);
        assertThat(testLegalHold.getPoprireDocumentNumber()).isEqualTo(UPDATED_POPRIRE_DOCUMENT_NUMBER);
        assertThat(testLegalHold.getPoprireDocumentDate()).isEqualTo(UPDATED_POPRIRE_DOCUMENT_DATE);
        assertThat(testLegalHold.getSistareNumber()).isEqualTo(UPDATED_SISTARE_NUMBER);
        assertThat(testLegalHold.getSistareDate()).isEqualTo(UPDATED_SISTARE_DATE);
        assertThat(testLegalHold.getSistareIntrareNumber()).isEqualTo(UPDATED_SISTARE_INTRARE_NUMBER);
        assertThat(testLegalHold.getSistareIntrareDate()).isEqualTo(UPDATED_SISTARE_INTRARE_DATE);
        assertThat(testLegalHold.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, legalHold.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalHold))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalHold))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLegalHold() throws Exception {
        int databaseSizeBeforeUpdate = legalHoldRepository.findAll().size();
        legalHold.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalHoldMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(legalHold))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalHold in the database
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLegalHold() throws Exception {
        // Initialize the database
        legalHoldRepository.saveAndFlush(legalHold);

        int databaseSizeBeforeDelete = legalHoldRepository.findAll().size();

        // Delete the legalHold
        restLegalHoldMockMvc
            .perform(delete(ENTITY_API_URL_ID, legalHold.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LegalHold> legalHoldList = legalHoldRepository.findAll();
        assertThat(legalHoldList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
