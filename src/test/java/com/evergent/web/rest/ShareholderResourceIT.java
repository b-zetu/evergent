package com.evergent.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.evergent.IntegrationTest;
import com.evergent.domain.Shareholder;
import com.evergent.repository.ShareholderRepository;
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
 * Integration tests for the {@link ShareholderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShareholderResourceIT {

    private static final Long DEFAULT_SHAREHOLDER_ID_DC = 1L;
    private static final Long UPDATED_SHAREHOLDER_ID_DC = 2L;

    private static final String DEFAULT_CNP = "AAAAAAAAAA";
    private static final String UPDATED_CNP = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_SHARES_NO = 1;
    private static final Integer UPDATED_SHARES_NO = 2;

    private static final Boolean DEFAULT_IS_PF = false;
    private static final Boolean UPDATED_IS_PF = true;

    private static final Boolean DEFAULT_IS_RESIDENT = false;
    private static final Boolean UPDATED_IS_RESIDENT = true;

    private static final Integer DEFAULT_TAX_VALUE = 1;
    private static final Integer UPDATED_TAX_VALUE = 2;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY_RESIDENCE = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY_RESIDENCE = "BBBBBBBBBB";

    private static final Integer DEFAULT_COUNTY_RESIDENCE = 1;
    private static final Integer UPDATED_COUNTY_RESIDENCE = 2;

    private static final Integer DEFAULT_CITY_RESIDENCE = 1;
    private static final Integer UPDATED_CITY_RESIDENCE = 2;

    private static final Integer DEFAULT_VILLAGE_RESIDENCE = 1;
    private static final Integer UPDATED_VILLAGE_RESIDENCE = 2;

    private static final String DEFAULT_FOREIGN_LOCALITY_RESIDENCE = "AAAAAAAAAA";
    private static final String UPDATED_FOREIGN_LOCALITY_RESIDENCE = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_RESIDENCE = "AAAAAAAAAA";
    private static final String UPDATED_STREET_RESIDENCE = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_NO = "AAAAAAAAAA";
    private static final String UPDATED_STREET_NO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shareholders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShareholderRepository shareholderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShareholderMockMvc;

    private Shareholder shareholder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shareholder createEntity(EntityManager em) {
        Shareholder shareholder = new Shareholder()
            .shareholderIdDC(DEFAULT_SHAREHOLDER_ID_DC)
            .cnp(DEFAULT_CNP)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .sharesNo(DEFAULT_SHARES_NO)
            .isPf(DEFAULT_IS_PF)
            .isResident(DEFAULT_IS_RESIDENT)
            .taxValue(DEFAULT_TAX_VALUE)
            .status(DEFAULT_STATUS)
            .countryResidence(DEFAULT_COUNTRY_RESIDENCE)
            .countyResidence(DEFAULT_COUNTY_RESIDENCE)
            .cityResidence(DEFAULT_CITY_RESIDENCE)
            .villageResidence(DEFAULT_VILLAGE_RESIDENCE)
            .foreignLocalityResidence(DEFAULT_FOREIGN_LOCALITY_RESIDENCE)
            .streetResidence(DEFAULT_STREET_RESIDENCE)
            .streetNo(DEFAULT_STREET_NO);
        return shareholder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shareholder createUpdatedEntity(EntityManager em) {
        Shareholder shareholder = new Shareholder()
            .shareholderIdDC(UPDATED_SHAREHOLDER_ID_DC)
            .cnp(UPDATED_CNP)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .sharesNo(UPDATED_SHARES_NO)
            .isPf(UPDATED_IS_PF)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS)
            .countryResidence(UPDATED_COUNTRY_RESIDENCE)
            .countyResidence(UPDATED_COUNTY_RESIDENCE)
            .cityResidence(UPDATED_CITY_RESIDENCE)
            .villageResidence(UPDATED_VILLAGE_RESIDENCE)
            .foreignLocalityResidence(UPDATED_FOREIGN_LOCALITY_RESIDENCE)
            .streetResidence(UPDATED_STREET_RESIDENCE)
            .streetNo(UPDATED_STREET_NO);
        return shareholder;
    }

    @BeforeEach
    public void initTest() {
        shareholder = createEntity(em);
    }

    @Test
    @Transactional
    void createShareholder() throws Exception {
        int databaseSizeBeforeCreate = shareholderRepository.findAll().size();
        // Create the Shareholder
        restShareholderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholder)))
            .andExpect(status().isCreated());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeCreate + 1);
        Shareholder testShareholder = shareholderList.get(shareholderList.size() - 1);
        assertThat(testShareholder.getShareholderIdDC()).isEqualTo(DEFAULT_SHAREHOLDER_ID_DC);
        assertThat(testShareholder.getCnp()).isEqualTo(DEFAULT_CNP);
        assertThat(testShareholder.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testShareholder.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testShareholder.getSharesNo()).isEqualTo(DEFAULT_SHARES_NO);
        assertThat(testShareholder.getIsPf()).isEqualTo(DEFAULT_IS_PF);
        assertThat(testShareholder.getIsResident()).isEqualTo(DEFAULT_IS_RESIDENT);
        assertThat(testShareholder.getTaxValue()).isEqualTo(DEFAULT_TAX_VALUE);
        assertThat(testShareholder.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testShareholder.getCountryResidence()).isEqualTo(DEFAULT_COUNTRY_RESIDENCE);
        assertThat(testShareholder.getCountyResidence()).isEqualTo(DEFAULT_COUNTY_RESIDENCE);
        assertThat(testShareholder.getCityResidence()).isEqualTo(DEFAULT_CITY_RESIDENCE);
        assertThat(testShareholder.getVillageResidence()).isEqualTo(DEFAULT_VILLAGE_RESIDENCE);
        assertThat(testShareholder.getForeignLocalityResidence()).isEqualTo(DEFAULT_FOREIGN_LOCALITY_RESIDENCE);
        assertThat(testShareholder.getStreetResidence()).isEqualTo(DEFAULT_STREET_RESIDENCE);
        assertThat(testShareholder.getStreetNo()).isEqualTo(DEFAULT_STREET_NO);
    }

    @Test
    @Transactional
    void createShareholderWithExistingId() throws Exception {
        // Create the Shareholder with an existing ID
        shareholder.setId(1L);

        int databaseSizeBeforeCreate = shareholderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShareholderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholder)))
            .andExpect(status().isBadRequest());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShareholders() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        // Get all the shareholderList
        restShareholderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shareholder.getId().intValue())))
            .andExpect(jsonPath("$.[*].shareholderIdDC").value(hasItem(DEFAULT_SHAREHOLDER_ID_DC.intValue())))
            .andExpect(jsonPath("$.[*].cnp").value(hasItem(DEFAULT_CNP)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].sharesNo").value(hasItem(DEFAULT_SHARES_NO)))
            .andExpect(jsonPath("$.[*].isPf").value(hasItem(DEFAULT_IS_PF.booleanValue())))
            .andExpect(jsonPath("$.[*].isResident").value(hasItem(DEFAULT_IS_RESIDENT.booleanValue())))
            .andExpect(jsonPath("$.[*].taxValue").value(hasItem(DEFAULT_TAX_VALUE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].countryResidence").value(hasItem(DEFAULT_COUNTRY_RESIDENCE)))
            .andExpect(jsonPath("$.[*].countyResidence").value(hasItem(DEFAULT_COUNTY_RESIDENCE)))
            .andExpect(jsonPath("$.[*].cityResidence").value(hasItem(DEFAULT_CITY_RESIDENCE)))
            .andExpect(jsonPath("$.[*].villageResidence").value(hasItem(DEFAULT_VILLAGE_RESIDENCE)))
            .andExpect(jsonPath("$.[*].foreignLocalityResidence").value(hasItem(DEFAULT_FOREIGN_LOCALITY_RESIDENCE)))
            .andExpect(jsonPath("$.[*].streetResidence").value(hasItem(DEFAULT_STREET_RESIDENCE)))
            .andExpect(jsonPath("$.[*].streetNo").value(hasItem(DEFAULT_STREET_NO)));
    }

    @Test
    @Transactional
    void getShareholder() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        // Get the shareholder
        restShareholderMockMvc
            .perform(get(ENTITY_API_URL_ID, shareholder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shareholder.getId().intValue()))
            .andExpect(jsonPath("$.shareholderIdDC").value(DEFAULT_SHAREHOLDER_ID_DC.intValue()))
            .andExpect(jsonPath("$.cnp").value(DEFAULT_CNP))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.sharesNo").value(DEFAULT_SHARES_NO))
            .andExpect(jsonPath("$.isPf").value(DEFAULT_IS_PF.booleanValue()))
            .andExpect(jsonPath("$.isResident").value(DEFAULT_IS_RESIDENT.booleanValue()))
            .andExpect(jsonPath("$.taxValue").value(DEFAULT_TAX_VALUE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.countryResidence").value(DEFAULT_COUNTRY_RESIDENCE))
            .andExpect(jsonPath("$.countyResidence").value(DEFAULT_COUNTY_RESIDENCE))
            .andExpect(jsonPath("$.cityResidence").value(DEFAULT_CITY_RESIDENCE))
            .andExpect(jsonPath("$.villageResidence").value(DEFAULT_VILLAGE_RESIDENCE))
            .andExpect(jsonPath("$.foreignLocalityResidence").value(DEFAULT_FOREIGN_LOCALITY_RESIDENCE))
            .andExpect(jsonPath("$.streetResidence").value(DEFAULT_STREET_RESIDENCE))
            .andExpect(jsonPath("$.streetNo").value(DEFAULT_STREET_NO));
    }

    @Test
    @Transactional
    void getNonExistingShareholder() throws Exception {
        // Get the shareholder
        restShareholderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShareholder() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();

        // Update the shareholder
        Shareholder updatedShareholder = shareholderRepository.findById(shareholder.getId()).get();
        // Disconnect from session so that the updates on updatedShareholder are not directly saved in db
        em.detach(updatedShareholder);
        updatedShareholder
            .shareholderIdDC(UPDATED_SHAREHOLDER_ID_DC)
            .cnp(UPDATED_CNP)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .sharesNo(UPDATED_SHARES_NO)
            .isPf(UPDATED_IS_PF)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS)
            .countryResidence(UPDATED_COUNTRY_RESIDENCE)
            .countyResidence(UPDATED_COUNTY_RESIDENCE)
            .cityResidence(UPDATED_CITY_RESIDENCE)
            .villageResidence(UPDATED_VILLAGE_RESIDENCE)
            .foreignLocalityResidence(UPDATED_FOREIGN_LOCALITY_RESIDENCE)
            .streetResidence(UPDATED_STREET_RESIDENCE)
            .streetNo(UPDATED_STREET_NO);

        restShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShareholder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShareholder))
            )
            .andExpect(status().isOk());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
        Shareholder testShareholder = shareholderList.get(shareholderList.size() - 1);
        assertThat(testShareholder.getShareholderIdDC()).isEqualTo(UPDATED_SHAREHOLDER_ID_DC);
        assertThat(testShareholder.getCnp()).isEqualTo(UPDATED_CNP);
        assertThat(testShareholder.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testShareholder.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testShareholder.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testShareholder.getIsPf()).isEqualTo(UPDATED_IS_PF);
        assertThat(testShareholder.getIsResident()).isEqualTo(UPDATED_IS_RESIDENT);
        assertThat(testShareholder.getTaxValue()).isEqualTo(UPDATED_TAX_VALUE);
        assertThat(testShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testShareholder.getCountryResidence()).isEqualTo(UPDATED_COUNTRY_RESIDENCE);
        assertThat(testShareholder.getCountyResidence()).isEqualTo(UPDATED_COUNTY_RESIDENCE);
        assertThat(testShareholder.getCityResidence()).isEqualTo(UPDATED_CITY_RESIDENCE);
        assertThat(testShareholder.getVillageResidence()).isEqualTo(UPDATED_VILLAGE_RESIDENCE);
        assertThat(testShareholder.getForeignLocalityResidence()).isEqualTo(UPDATED_FOREIGN_LOCALITY_RESIDENCE);
        assertThat(testShareholder.getStreetResidence()).isEqualTo(UPDATED_STREET_RESIDENCE);
        assertThat(testShareholder.getStreetNo()).isEqualTo(UPDATED_STREET_NO);
    }

    @Test
    @Transactional
    void putNonExistingShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shareholder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shareholder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShareholderWithPatch() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();

        // Update the shareholder using partial update
        Shareholder partialUpdatedShareholder = new Shareholder();
        partialUpdatedShareholder.setId(shareholder.getId());

        partialUpdatedShareholder
            .shareholderIdDC(UPDATED_SHAREHOLDER_ID_DC)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .sharesNo(UPDATED_SHARES_NO)
            .status(UPDATED_STATUS)
            .countyResidence(UPDATED_COUNTY_RESIDENCE)
            .villageResidence(UPDATED_VILLAGE_RESIDENCE);

        restShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholder))
            )
            .andExpect(status().isOk());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
        Shareholder testShareholder = shareholderList.get(shareholderList.size() - 1);
        assertThat(testShareholder.getShareholderIdDC()).isEqualTo(UPDATED_SHAREHOLDER_ID_DC);
        assertThat(testShareholder.getCnp()).isEqualTo(DEFAULT_CNP);
        assertThat(testShareholder.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testShareholder.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testShareholder.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testShareholder.getIsPf()).isEqualTo(DEFAULT_IS_PF);
        assertThat(testShareholder.getIsResident()).isEqualTo(DEFAULT_IS_RESIDENT);
        assertThat(testShareholder.getTaxValue()).isEqualTo(DEFAULT_TAX_VALUE);
        assertThat(testShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testShareholder.getCountryResidence()).isEqualTo(DEFAULT_COUNTRY_RESIDENCE);
        assertThat(testShareholder.getCountyResidence()).isEqualTo(UPDATED_COUNTY_RESIDENCE);
        assertThat(testShareholder.getCityResidence()).isEqualTo(DEFAULT_CITY_RESIDENCE);
        assertThat(testShareholder.getVillageResidence()).isEqualTo(UPDATED_VILLAGE_RESIDENCE);
        assertThat(testShareholder.getForeignLocalityResidence()).isEqualTo(DEFAULT_FOREIGN_LOCALITY_RESIDENCE);
        assertThat(testShareholder.getStreetResidence()).isEqualTo(DEFAULT_STREET_RESIDENCE);
        assertThat(testShareholder.getStreetNo()).isEqualTo(DEFAULT_STREET_NO);
    }

    @Test
    @Transactional
    void fullUpdateShareholderWithPatch() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();

        // Update the shareholder using partial update
        Shareholder partialUpdatedShareholder = new Shareholder();
        partialUpdatedShareholder.setId(shareholder.getId());

        partialUpdatedShareholder
            .shareholderIdDC(UPDATED_SHAREHOLDER_ID_DC)
            .cnp(UPDATED_CNP)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .sharesNo(UPDATED_SHARES_NO)
            .isPf(UPDATED_IS_PF)
            .isResident(UPDATED_IS_RESIDENT)
            .taxValue(UPDATED_TAX_VALUE)
            .status(UPDATED_STATUS)
            .countryResidence(UPDATED_COUNTRY_RESIDENCE)
            .countyResidence(UPDATED_COUNTY_RESIDENCE)
            .cityResidence(UPDATED_CITY_RESIDENCE)
            .villageResidence(UPDATED_VILLAGE_RESIDENCE)
            .foreignLocalityResidence(UPDATED_FOREIGN_LOCALITY_RESIDENCE)
            .streetResidence(UPDATED_STREET_RESIDENCE)
            .streetNo(UPDATED_STREET_NO);

        restShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShareholder))
            )
            .andExpect(status().isOk());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
        Shareholder testShareholder = shareholderList.get(shareholderList.size() - 1);
        assertThat(testShareholder.getShareholderIdDC()).isEqualTo(UPDATED_SHAREHOLDER_ID_DC);
        assertThat(testShareholder.getCnp()).isEqualTo(UPDATED_CNP);
        assertThat(testShareholder.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testShareholder.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testShareholder.getSharesNo()).isEqualTo(UPDATED_SHARES_NO);
        assertThat(testShareholder.getIsPf()).isEqualTo(UPDATED_IS_PF);
        assertThat(testShareholder.getIsResident()).isEqualTo(UPDATED_IS_RESIDENT);
        assertThat(testShareholder.getTaxValue()).isEqualTo(UPDATED_TAX_VALUE);
        assertThat(testShareholder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testShareholder.getCountryResidence()).isEqualTo(UPDATED_COUNTRY_RESIDENCE);
        assertThat(testShareholder.getCountyResidence()).isEqualTo(UPDATED_COUNTY_RESIDENCE);
        assertThat(testShareholder.getCityResidence()).isEqualTo(UPDATED_CITY_RESIDENCE);
        assertThat(testShareholder.getVillageResidence()).isEqualTo(UPDATED_VILLAGE_RESIDENCE);
        assertThat(testShareholder.getForeignLocalityResidence()).isEqualTo(UPDATED_FOREIGN_LOCALITY_RESIDENCE);
        assertThat(testShareholder.getStreetResidence()).isEqualTo(UPDATED_STREET_RESIDENCE);
        assertThat(testShareholder.getStreetNo()).isEqualTo(UPDATED_STREET_NO);
    }

    @Test
    @Transactional
    void patchNonExistingShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shareholder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shareholder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShareholder() throws Exception {
        int databaseSizeBeforeUpdate = shareholderRepository.findAll().size();
        shareholder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShareholderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shareholder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shareholder in the database
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShareholder() throws Exception {
        // Initialize the database
        shareholderRepository.saveAndFlush(shareholder);

        int databaseSizeBeforeDelete = shareholderRepository.findAll().size();

        // Delete the shareholder
        restShareholderMockMvc
            .perform(delete(ENTITY_API_URL_ID, shareholder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Shareholder> shareholderList = shareholderRepository.findAll();
        assertThat(shareholderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
