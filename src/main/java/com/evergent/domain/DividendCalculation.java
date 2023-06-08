package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DividendCalculation.
 */
@Entity
@Table(name = "dividend_calculation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DividendCalculation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "total_net_amount", precision = 21, scale = 2)
    private BigDecimal totalNetAmount;

    @Column(name = "tax_amount_calculated", precision = 21, scale = 2)
    private BigDecimal taxAmountCalculated;

    @Column(name = "total_gross_amount", precision = 21, scale = 2)
    private BigDecimal totalGrossAmount;

    @OneToMany(mappedBy = "dividendCalculation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "dividendCalculation", "paymentOption" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "dividendCalculations", "shareholder", "dividendRegister", "paymentOption" }, allowSetters = true)
    private DividendShareholder dividendShareholder;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DividendCalculation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTotalNetAmount() {
        return this.totalNetAmount;
    }

    public DividendCalculation totalNetAmount(BigDecimal totalNetAmount) {
        this.setTotalNetAmount(totalNetAmount);
        return this;
    }

    public void setTotalNetAmount(BigDecimal totalNetAmount) {
        this.totalNetAmount = totalNetAmount;
    }

    public BigDecimal getTaxAmountCalculated() {
        return this.taxAmountCalculated;
    }

    public DividendCalculation taxAmountCalculated(BigDecimal taxAmountCalculated) {
        this.setTaxAmountCalculated(taxAmountCalculated);
        return this;
    }

    public void setTaxAmountCalculated(BigDecimal taxAmountCalculated) {
        this.taxAmountCalculated = taxAmountCalculated;
    }

    public BigDecimal getTotalGrossAmount() {
        return this.totalGrossAmount;
    }

    public DividendCalculation totalGrossAmount(BigDecimal totalGrossAmount) {
        this.setTotalGrossAmount(totalGrossAmount);
        return this;
    }

    public void setTotalGrossAmount(BigDecimal totalGrossAmount) {
        this.totalGrossAmount = totalGrossAmount;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setDividendCalculation(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setDividendCalculation(this));
        }
        this.payments = payments;
    }

    public DividendCalculation payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public DividendCalculation addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setDividendCalculation(this);
        return this;
    }

    public DividendCalculation removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setDividendCalculation(null);
        return this;
    }

    public DividendShareholder getDividendShareholder() {
        return this.dividendShareholder;
    }

    public void setDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholder = dividendShareholder;
    }

    public DividendCalculation dividendShareholder(DividendShareholder dividendShareholder) {
        this.setDividendShareholder(dividendShareholder);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DividendCalculation)) {
            return false;
        }
        return id != null && id.equals(((DividendCalculation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DividendCalculation{" +
            "id=" + getId() +
            ", totalNetAmount=" + getTotalNetAmount() +
            ", taxAmountCalculated=" + getTaxAmountCalculated() +
            ", totalGrossAmount=" + getTotalGrossAmount() +
            "}";
    }
}
