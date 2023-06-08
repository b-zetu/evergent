package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.PaymentOption;
import com.evergent.repository.PaymentOptionRepository;
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
 * Integration tests for the {@link PaymentOptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PaymentOptionResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_DETAIL_1 = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL_1 = "BBBBBBBBBB";

    private static final String DEFAULT_DETAIL_2 = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL_2 = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/payment-options";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PaymentOptionRepository paymentOptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentOptionMockMvc;

    private PaymentOption paymentOption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentOption createEntity(EntityManager em) {
        PaymentOption paymentOption = new PaymentOption().type(DEFAULT_TYPE).detail1(DEFAULT_DETAIL_1).detail2(DEFAULT_DETAIL_2);
        return paymentOption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentOption createUpdatedEntity(EntityManager em) {
        PaymentOption paymentOption = new PaymentOption().type(UPDATED_TYPE).detail1(UPDATED_DETAIL_1).detail2(UPDATED_DETAIL_2);
        return paymentOption;
    }

    @BeforeEach
    public void initTest() {
        paymentOption = createEntity(em);
    }

    @Test
    @Transactional
    void createPaymentOption() throws Exception {
        int databaseSizeBeforeCreate = paymentOptionRepository.findAll().size();
        // Create the PaymentOption
        restPaymentOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentOption)))
            .andExpect(status().isCreated());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentOption testPaymentOption = paymentOptionList.get(paymentOptionList.size() - 1);
        assertThat(testPaymentOption.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPaymentOption.getDetail1()).isEqualTo(DEFAULT_DETAIL_1);
        assertThat(testPaymentOption.getDetail2()).isEqualTo(DEFAULT_DETAIL_2);
    }

    @Test
    @Transactional
    void createPaymentOptionWithExistingId() throws Exception {
        // Create the PaymentOption with an existing ID
        paymentOption.setId(1L);

        int databaseSizeBeforeCreate = paymentOptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentOption)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPaymentOptions() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        // Get all the paymentOptionList
        restPaymentOptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].detail1").value(hasItem(DEFAULT_DETAIL_1)))
            .andExpect(jsonPath("$.[*].detail2").value(hasItem(DEFAULT_DETAIL_2)));
    }

    @Test
    @Transactional
    void getPaymentOption() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        // Get the paymentOption
        restPaymentOptionMockMvc
            .perform(get(ENTITY_API_URL_ID, paymentOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(paymentOption.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.detail1").value(DEFAULT_DETAIL_1))
            .andExpect(jsonPath("$.detail2").value(DEFAULT_DETAIL_2));
    }

    @Test
    @Transactional
    void getNonExistingPaymentOption() throws Exception {
        // Get the paymentOption
        restPaymentOptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPaymentOption() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();

        // Update the paymentOption
        PaymentOption updatedPaymentOption = paymentOptionRepository.findById(paymentOption.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentOption are not directly saved in db
        em.detach(updatedPaymentOption);
        updatedPaymentOption.type(UPDATED_TYPE).detail1(UPDATED_DETAIL_1).detail2(UPDATED_DETAIL_2);

        restPaymentOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPaymentOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPaymentOption))
            )
            .andExpect(status().isOk());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
        PaymentOption testPaymentOption = paymentOptionList.get(paymentOptionList.size() - 1);
        assertThat(testPaymentOption.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPaymentOption.getDetail1()).isEqualTo(UPDATED_DETAIL_1);
        assertThat(testPaymentOption.getDetail2()).isEqualTo(UPDATED_DETAIL_2);
    }

    @Test
    @Transactional
    void putNonExistingPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paymentOption)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePaymentOptionWithPatch() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();

        // Update the paymentOption using partial update
        PaymentOption partialUpdatedPaymentOption = new PaymentOption();
        partialUpdatedPaymentOption.setId(paymentOption.getId());

        partialUpdatedPaymentOption.type(UPDATED_TYPE).detail1(UPDATED_DETAIL_1).detail2(UPDATED_DETAIL_2);

        restPaymentOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentOption))
            )
            .andExpect(status().isOk());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
        PaymentOption testPaymentOption = paymentOptionList.get(paymentOptionList.size() - 1);
        assertThat(testPaymentOption.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPaymentOption.getDetail1()).isEqualTo(UPDATED_DETAIL_1);
        assertThat(testPaymentOption.getDetail2()).isEqualTo(UPDATED_DETAIL_2);
    }

    @Test
    @Transactional
    void fullUpdatePaymentOptionWithPatch() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();

        // Update the paymentOption using partial update
        PaymentOption partialUpdatedPaymentOption = new PaymentOption();
        partialUpdatedPaymentOption.setId(paymentOption.getId());

        partialUpdatedPaymentOption.type(UPDATED_TYPE).detail1(UPDATED_DETAIL_1).detail2(UPDATED_DETAIL_2);

        restPaymentOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentOption))
            )
            .andExpect(status().isOk());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
        PaymentOption testPaymentOption = paymentOptionList.get(paymentOptionList.size() - 1);
        assertThat(testPaymentOption.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPaymentOption.getDetail1()).isEqualTo(UPDATED_DETAIL_1);
        assertThat(testPaymentOption.getDetail2()).isEqualTo(UPDATED_DETAIL_2);
    }

    @Test
    @Transactional
    void patchNonExistingPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paymentOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPaymentOption() throws Exception {
        int databaseSizeBeforeUpdate = paymentOptionRepository.findAll().size();
        paymentOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentOptionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(paymentOption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentOption in the database
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePaymentOption() throws Exception {
        // Initialize the database
        paymentOptionRepository.saveAndFlush(paymentOption);

        int databaseSizeBeforeDelete = paymentOptionRepository.findAll().size();

        // Delete the paymentOption
        restPaymentOptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, paymentOption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentOption> paymentOptionList = paymentOptionRepository.findAll();
        assertThat(paymentOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
