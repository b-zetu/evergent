package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Shareholder.
 */
@Entity
@Table(name = "shareholder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Shareholder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "shareholder_id_dc")
    private Long shareholderIdDC;

    @Column(name = "cnp")
    private String cnp;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "shares_no")
    private Integer sharesNo;

    @Column(name = "is_pf")
    private Boolean isPf;

    @Column(name = "is_resident")
    private Boolean isResident;

    @Column(name = "tax_value")
    private Integer taxValue;

    @Column(name = "status")
    private String status;

    @Column(name = "country_residence")
    private String countryResidence;

    @Column(name = "county_residence")
    private Integer countyResidence;

    @Column(name = "city_residence")
    private Integer cityResidence;

    @Column(name = "village_residence")
    private Integer villageResidence;

    @Column(name = "foreign_locality_residence")
    private String foreignLocalityResidence;

    @Column(name = "street_residence")
    private String streetResidence;

    @Column(name = "street_no")
    private String streetNo;

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder" }, allowSetters = true)
    private Set<Communication> communications = new HashSet<>();

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "dividendCalculations", "shareholder", "dividendRegister", "paymentOption" }, allowSetters = true)
    private Set<DividendShareholder> dividendShareholders = new HashSet<>();

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "paymentOption" }, allowSetters = true)
    private Set<LegalHold> legalHolds = new HashSet<>();

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "dividendCalculation", "paymentOption" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "voteEntryXVoteOptions", "shareholder", "voteProposal" }, allowSetters = true)
    private Set<VoteEntry> voteEntries = new HashSet<>();

    @OneToMany(mappedBy = "deceased")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "deceased", "receiver", "inheritance" }, allowSetters = true)
    private Set<ShareholderXInheritance> deceaseds = new HashSet<>();

    @OneToMany(mappedBy = "receiver")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "deceased", "receiver", "inheritance" }, allowSetters = true)
    private Set<ShareholderXInheritance> receivers = new HashSet<>();

    @OneToMany(mappedBy = "shareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "group" }, allowSetters = true)
    private Set<ShareholderXGroup> shareholderXGroups = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "dividendShareholders", "legalHolds", "shareholders", "payments" }, allowSetters = true)
    private PaymentOption paymentOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Shareholder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getShareholderIdDC() {
        return this.shareholderIdDC;
    }

    public Shareholder shareholderIdDC(Long shareholderIdDC) {
        this.setShareholderIdDC(shareholderIdDC);
        return this;
    }

    public void setShareholderIdDC(Long shareholderIdDC) {
        this.shareholderIdDC = shareholderIdDC;
    }

    public String getCnp() {
        return this.cnp;
    }

    public Shareholder cnp(String cnp) {
        this.setCnp(cnp);
        return this;
    }

    public void setCnp(String cnp) {
        this.cnp = cnp;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Shareholder firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Shareholder lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getSharesNo() {
        return this.sharesNo;
    }

    public Shareholder sharesNo(Integer sharesNo) {
        this.setSharesNo(sharesNo);
        return this;
    }

    public void setSharesNo(Integer sharesNo) {
        this.sharesNo = sharesNo;
    }

    public Boolean getIsPf() {
        return this.isPf;
    }

    public Shareholder isPf(Boolean isPf) {
        this.setIsPf(isPf);
        return this;
    }

    public void setIsPf(Boolean isPf) {
        this.isPf = isPf;
    }

    public Boolean getIsResident() {
        return this.isResident;
    }

    public Shareholder isResident(Boolean isResident) {
        this.setIsResident(isResident);
        return this;
    }

    public void setIsResident(Boolean isResident) {
        this.isResident = isResident;
    }

    public Integer getTaxValue() {
        return this.taxValue;
    }

    public Shareholder taxValue(Integer taxValue) {
        this.setTaxValue(taxValue);
        return this;
    }

    public void setTaxValue(Integer taxValue) {
        this.taxValue = taxValue;
    }

    public String getStatus() {
        return this.status;
    }

    public Shareholder status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCountryResidence() {
        return this.countryResidence;
    }

    public Shareholder countryResidence(String countryResidence) {
        this.setCountryResidence(countryResidence);
        return this;
    }

    public void setCountryResidence(String countryResidence) {
        this.countryResidence = countryResidence;
    }

    public Integer getCountyResidence() {
        return this.countyResidence;
    }

    public Shareholder countyResidence(Integer countyResidence) {
        this.setCountyResidence(countyResidence);
        return this;
    }

    public void setCountyResidence(Integer countyResidence) {
        this.countyResidence = countyResidence;
    }

    public Integer getCityResidence() {
        return this.cityResidence;
    }

    public Shareholder cityResidence(Integer cityResidence) {
        this.setCityResidence(cityResidence);
        return this;
    }

    public void setCityResidence(Integer cityResidence) {
        this.cityResidence = cityResidence;
    }

    public Integer getVillageResidence() {
        return this.villageResidence;
    }

    public Shareholder villageResidence(Integer villageResidence) {
        this.setVillageResidence(villageResidence);
        return this;
    }

    public void setVillageResidence(Integer villageResidence) {
        this.villageResidence = villageResidence;
    }

    public String getForeignLocalityResidence() {
        return this.foreignLocalityResidence;
    }

    public Shareholder foreignLocalityResidence(String foreignLocalityResidence) {
        this.setForeignLocalityResidence(foreignLocalityResidence);
        return this;
    }

    public void setForeignLocalityResidence(String foreignLocalityResidence) {
        this.foreignLocalityResidence = foreignLocalityResidence;
    }

    public String getStreetResidence() {
        return this.streetResidence;
    }

    public Shareholder streetResidence(String streetResidence) {
        this.setStreetResidence(streetResidence);
        return this;
    }

    public void setStreetResidence(String streetResidence) {
        this.streetResidence = streetResidence;
    }

    public String getStreetNo() {
        return this.streetNo;
    }

    public Shareholder streetNo(String streetNo) {
        this.setStreetNo(streetNo);
        return this;
    }

    public void setStreetNo(String streetNo) {
        this.streetNo = streetNo;
    }

    public Set<Communication> getCommunications() {
        return this.communications;
    }

    public void setCommunications(Set<Communication> communications) {
        if (this.communications != null) {
            this.communications.forEach(i -> i.setShareholder(null));
        }
        if (communications != null) {
            communications.forEach(i -> i.setShareholder(this));
        }
        this.communications = communications;
    }

    public Shareholder communications(Set<Communication> communications) {
        this.setCommunications(communications);
        return this;
    }

    public Shareholder addCommunication(Communication communication) {
        this.communications.add(communication);
        communication.setShareholder(this);
        return this;
    }

    public Shareholder removeCommunication(Communication communication) {
        this.communications.remove(communication);
        communication.setShareholder(null);
        return this;
    }

    public Set<DividendShareholder> getDividendShareholders() {
        return this.dividendShareholders;
    }

    public void setDividendShareholders(Set<DividendShareholder> dividendShareholders) {
        if (this.dividendShareholders != null) {
            this.dividendShareholders.forEach(i -> i.setShareholder(null));
        }
        if (dividendShareholders != null) {
            dividendShareholders.forEach(i -> i.setShareholder(this));
        }
        this.dividendShareholders = dividendShareholders;
    }

    public Shareholder dividendShareholders(Set<DividendShareholder> dividendShareholders) {
        this.setDividendShareholders(dividendShareholders);
        return this;
    }

    public Shareholder addDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.add(dividendShareholder);
        dividendShareholder.setShareholder(this);
        return this;
    }

    public Shareholder removeDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.remove(dividendShareholder);
        dividendShareholder.setShareholder(null);
        return this;
    }

    public Set<LegalHold> getLegalHolds() {
        return this.legalHolds;
    }

    public void setLegalHolds(Set<LegalHold> legalHolds) {
        if (this.legalHolds != null) {
            this.legalHolds.forEach(i -> i.setShareholder(null));
        }
        if (legalHolds != null) {
            legalHolds.forEach(i -> i.setShareholder(this));
        }
        this.legalHolds = legalHolds;
    }

    public Shareholder legalHolds(Set<LegalHold> legalHolds) {
        this.setLegalHolds(legalHolds);
        return this;
    }

    public Shareholder addLegalHold(LegalHold legalHold) {
        this.legalHolds.add(legalHold);
        legalHold.setShareholder(this);
        return this;
    }

    public Shareholder removeLegalHold(LegalHold legalHold) {
        this.legalHolds.remove(legalHold);
        legalHold.setShareholder(null);
        return this;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setShareholder(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setShareholder(this));
        }
        this.payments = payments;
    }

    public Shareholder payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public Shareholder addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setShareholder(this);
        return this;
    }

    public Shareholder removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setShareholder(null);
        return this;
    }

    public Set<VoteEntry> getVoteEntries() {
        return this.voteEntries;
    }

    public void setVoteEntries(Set<VoteEntry> voteEntries) {
        if (this.voteEntries != null) {
            this.voteEntries.forEach(i -> i.setShareholder(null));
        }
        if (voteEntries != null) {
            voteEntries.forEach(i -> i.setShareholder(this));
        }
        this.voteEntries = voteEntries;
    }

    public Shareholder voteEntries(Set<VoteEntry> voteEntries) {
        this.setVoteEntries(voteEntries);
        return this;
    }

    public Shareholder addVoteEntry(VoteEntry voteEntry) {
        this.voteEntries.add(voteEntry);
        voteEntry.setShareholder(this);
        return this;
    }

    public Shareholder removeVoteEntry(VoteEntry voteEntry) {
        this.voteEntries.remove(voteEntry);
        voteEntry.setShareholder(null);
        return this;
    }

    public Set<ShareholderXInheritance> getDeceaseds() {
        return this.deceaseds;
    }

    public void setDeceaseds(Set<ShareholderXInheritance> shareholderXInheritances) {
        if (this.deceaseds != null) {
            this.deceaseds.forEach(i -> i.setDeceased(null));
        }
        if (shareholderXInheritances != null) {
            shareholderXInheritances.forEach(i -> i.setDeceased(this));
        }
        this.deceaseds = shareholderXInheritances;
    }

    public Shareholder deceaseds(Set<ShareholderXInheritance> shareholderXInheritances) {
        this.setDeceaseds(shareholderXInheritances);
        return this;
    }

    public Shareholder addDeceased(ShareholderXInheritance shareholderXInheritance) {
        this.deceaseds.add(shareholderXInheritance);
        shareholderXInheritance.setDeceased(this);
        return this;
    }

    public Shareholder removeDeceased(ShareholderXInheritance shareholderXInheritance) {
        this.deceaseds.remove(shareholderXInheritance);
        shareholderXInheritance.setDeceased(null);
        return this;
    }

    public Set<ShareholderXInheritance> getReceivers() {
        return this.receivers;
    }

    public void setReceivers(Set<ShareholderXInheritance> shareholderXInheritances) {
        if (this.receivers != null) {
            this.receivers.forEach(i -> i.setReceiver(null));
        }
        if (shareholderXInheritances != null) {
            shareholderXInheritances.forEach(i -> i.setReceiver(this));
        }
        this.receivers = shareholderXInheritances;
    }

    public Shareholder receivers(Set<ShareholderXInheritance> shareholderXInheritances) {
        this.setReceivers(shareholderXInheritances);
        return this;
    }

    public Shareholder addReceiver(ShareholderXInheritance shareholderXInheritance) {
        this.receivers.add(shareholderXInheritance);
        shareholderXInheritance.setReceiver(this);
        return this;
    }

    public Shareholder removeReceiver(ShareholderXInheritance shareholderXInheritance) {
        this.receivers.remove(shareholderXInheritance);
        shareholderXInheritance.setReceiver(null);
        return this;
    }

    public Set<ShareholderXGroup> getShareholderXGroups() {
        return this.shareholderXGroups;
    }

    public void setShareholderXGroups(Set<ShareholderXGroup> shareholderXGroups) {
        if (this.shareholderXGroups != null) {
            this.shareholderXGroups.forEach(i -> i.setShareholder(null));
        }
        if (shareholderXGroups != null) {
            shareholderXGroups.forEach(i -> i.setShareholder(this));
        }
        this.shareholderXGroups = shareholderXGroups;
    }

    public Shareholder shareholderXGroups(Set<ShareholderXGroup> shareholderXGroups) {
        this.setShareholderXGroups(shareholderXGroups);
        return this;
    }

    public Shareholder addShareholderXGroup(ShareholderXGroup shareholderXGroup) {
        this.shareholderXGroups.add(shareholderXGroup);
        shareholderXGroup.setShareholder(this);
        return this;
    }

    public Shareholder removeShareholderXGroup(ShareholderXGroup shareholderXGroup) {
        this.shareholderXGroups.remove(shareholderXGroup);
        shareholderXGroup.setShareholder(null);
        return this;
    }

    public PaymentOption getPaymentOption() {
        return this.paymentOption;
    }

    public void setPaymentOption(PaymentOption paymentOption) {
        this.paymentOption = paymentOption;
    }

    public Shareholder paymentOption(PaymentOption paymentOption) {
        this.setPaymentOption(paymentOption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Shareholder)) {
            return false;
        }
        return id != null && id.equals(((Shareholder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Shareholder{" +
            "id=" + getId() +
            ", shareholderIdDC=" + getShareholderIdDC() +
            ", cnp='" + getCnp() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", sharesNo=" + getSharesNo() +
            ", isPf='" + getIsPf() + "'" +
            ", isResident='" + getIsResident() + "'" +
            ", taxValue=" + getTaxValue() +
            ", status='" + getStatus() + "'" +
            ", countryResidence='" + getCountryResidence() + "'" +
            ", countyResidence=" + getCountyResidence() +
            ", cityResidence=" + getCityResidence() +
            ", villageResidence=" + getVillageResidence() +
            ", foreignLocalityResidence='" + getForeignLocalityResidence() + "'" +
            ", streetResidence='" + getStreetResidence() + "'" +
            ", streetNo='" + getStreetNo() + "'" +
            "}";
    }
}
