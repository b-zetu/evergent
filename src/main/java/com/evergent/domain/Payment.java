package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "value", precision = 21, scale = 2)
    private BigDecimal value;

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
    @JsonIgnoreProperties(value = { "payments", "dividendShareholder" }, allowSetters = true)
    private DividendCalculation dividendCalculation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dividendShareholders", "legalHolds", "shareholders", "payments" }, allowSetters = true)
    private PaymentOption paymentOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Payment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValue() {
        return this.value;
    }

    public Payment value(BigDecimal value) {
        this.setValue(value);
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Shareholder getShareholder() {
        return this.shareholder;
    }

    public void setShareholder(Shareholder shareholder) {
        this.shareholder = shareholder;
    }

    public Payment shareholder(Shareholder shareholder) {
        this.setShareholder(shareholder);
        return this;
    }

    public DividendCalculation getDividendCalculation() {
        return this.dividendCalculation;
    }

    public void setDividendCalculation(DividendCalculation dividendCalculation) {
        this.dividendCalculation = dividendCalculation;
    }

    public Payment dividendCalculation(DividendCalculation dividendCalculation) {
        this.setDividendCalculation(dividendCalculation);
        return this;
    }

    public PaymentOption getPaymentOption() {
        return this.paymentOption;
    }

    public void setPaymentOption(PaymentOption paymentOption) {
        this.paymentOption = paymentOption;
    }

    public Payment paymentOption(PaymentOption paymentOption) {
        this.setPaymentOption(paymentOption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", value=" + getValue() +
            "}";
    }
}
