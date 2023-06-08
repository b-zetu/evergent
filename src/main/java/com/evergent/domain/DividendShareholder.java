package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DividendShareholder.
 */
@Entity
@Table(name = "dividend_shareholder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DividendShareholder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "shares_no")
    private Integer sharesNo;

    @Column(name = "is_resident")
    private Boolean isResident;

    @Column(name = "tax_value")
    private Integer taxValue;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "dividendShareholder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "payments", "dividendShareholder" }, allowSetters = true)
    private Set<DividendCalculation> dividendCalculations = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "communications",
            "dividendShareholders",
            "legalHolds",
            "payments",
            "voteEntries",
            "deceaseds",
            "receivers",
            "shareholderXGroups",
            "paymentOption",
        },
        allowSetters = true
    )
    private Shareholder shareholder;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dividendShareholders" }, allowSetters = true)
    private DividendRegister dividendRegister;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dividendShareholders", "legalHolds", "shareholders", "payments" }, allowSetters = true)
    private PaymentOption paymentOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DividendShareholder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSharesNo() {
        return this.sharesNo;
    }

    public DividendShareholder sharesNo(Integer sharesNo) {
        this.setSharesNo(sharesNo);
        return this;
    }

    public void setSharesNo(Integer sharesNo) {
        this.sharesNo = sharesNo;
    }

    public Boolean getIsResident() {
        return this.isResident;
    }

    public DividendShareholder isResident(Boolean isResident) {
        this.setIsResident(isResident);
        return this;
    }

    public void setIsResident(Boolean isResident) {
        this.isResident = isResident;
    }

    public Integer getTaxValue() {
        return this.taxValue;
    }

    public DividendShareholder taxValue(Integer taxValue) {
        this.setTaxValue(taxValue);
        return this;
    }

    public void setTaxValue(Integer taxValue) {
        this.taxValue = taxValue;
    }

    public String getStatus() {
        return this.status;
    }

    public DividendShareholder status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<DividendCalculation> getDividendCalculations() {
        return this.dividendCalculations;
    }

    public void setDividendCalculations(Set<DividendCalculation> dividendCalculations) {
        if (this.dividendCalculations != null) {
            this.dividendCalculations.forEach(i -> i.setDividendShareholder(null));
        }
        if (dividendCalculations != null) {
            dividendCalculations.forEach(i -> i.setDividendShareholder(this));
        }
        this.dividendCalculations = dividendCalculations;
    }

    public DividendShareholder dividendCalculations(Set<DividendCalculation> dividendCalculations) {
        this.setDividendCalculations(dividendCalculations);
        return this;
    }

    public DividendShareholder addDividendCalculation(DividendCalculation dividendCalculation) {
        this.dividendCalculations.add(dividendCalculation);
        dividendCalculation.setDividendShareholder(this);
        return this;
    }

    public DividendShareholder removeDividendCalculation(DividendCalculation dividendCalculation) {
        this.dividendCalculations.remove(dividendCalculation);
        dividendCalculation.setDividendShareholder(null);
        return this;
    }

    public Shareholder getShareholder() {
        return this.shareholder;
    }

    public void setShareholder(Shareholder shareholder) {
        this.shareholder = shareholder;
    }

    public DividendShareholder shareholder(Shareholder shareholder) {
        this.setShareholder(shareholder);
        return this;
    }

    public DividendRegister getDividendRegister() {
        return this.dividendRegister;
    }

    public void setDividendRegister(DividendRegister dividendRegister) {
        this.dividendRegister = dividendRegister;
    }

    public DividendShareholder dividendRegister(DividendRegister dividendRegister) {
        this.setDividendRegister(dividendRegister);
        return this;
    }

    public PaymentOption getPaymentOption() {
        return this.paymentOption;
    }

    public void setPaymentOption(PaymentOption paymentOption) {
        this.paymentOption = paymentOption;
    }

    public DividendShareholder paymentOption(PaymentOption paymentOption) {
        this.setPaymentOption(paymentOption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DividendShareholder)) {
            return false;
        }
        return id != null && id.equals(((DividendShareholder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DividendShareholder{" +
            "id=" + getId() +
            ", sharesNo=" + getSharesNo() +
            ", isResident='" + getIsResident() + "'" +
            ", taxValue=" + getTaxValue() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
