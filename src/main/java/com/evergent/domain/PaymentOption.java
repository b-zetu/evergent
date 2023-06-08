package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PaymentOption.
 */
@Entity
@Table(name = "payment_option")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PaymentOption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "detail_1")
    private String detail1;

    @Column(name = "detail_2")
    private String detail2;

    @OneToMany(mappedBy = "paymentOption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "dividendCalculations", "shareholder", "dividendRegister", "paymentOption" }, allowSetters = true)
    private Set<DividendShareholder> dividendShareholders = new HashSet<>();

    @OneToMany(mappedBy = "paymentOption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "paymentOption" }, allowSetters = true)
    private Set<LegalHold> legalHolds = new HashSet<>();

    @OneToMany(mappedBy = "paymentOption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
    private Set<Shareholder> shareholders = new HashSet<>();

    @OneToMany(mappedBy = "paymentOption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "dividendCalculation", "paymentOption" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PaymentOption id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public PaymentOption type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDetail1() {
        return this.detail1;
    }

    public PaymentOption detail1(String detail1) {
        this.setDetail1(detail1);
        return this;
    }

    public void setDetail1(String detail1) {
        this.detail1 = detail1;
    }

    public String getDetail2() {
        return this.detail2;
    }

    public PaymentOption detail2(String detail2) {
        this.setDetail2(detail2);
        return this;
    }

    public void setDetail2(String detail2) {
        this.detail2 = detail2;
    }

    public Set<DividendShareholder> getDividendShareholders() {
        return this.dividendShareholders;
    }

    public void setDividendShareholders(Set<DividendShareholder> dividendShareholders) {
        if (this.dividendShareholders != null) {
            this.dividendShareholders.forEach(i -> i.setPaymentOption(null));
        }
        if (dividendShareholders != null) {
            dividendShareholders.forEach(i -> i.setPaymentOption(this));
        }
        this.dividendShareholders = dividendShareholders;
    }

    public PaymentOption dividendShareholders(Set<DividendShareholder> dividendShareholders) {
        this.setDividendShareholders(dividendShareholders);
        return this;
    }

    public PaymentOption addDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.add(dividendShareholder);
        dividendShareholder.setPaymentOption(this);
        return this;
    }

    public PaymentOption removeDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.remove(dividendShareholder);
        dividendShareholder.setPaymentOption(null);
        return this;
    }

    public Set<LegalHold> getLegalHolds() {
        return this.legalHolds;
    }

    public void setLegalHolds(Set<LegalHold> legalHolds) {
        if (this.legalHolds != null) {
            this.legalHolds.forEach(i -> i.setPaymentOption(null));
        }
        if (legalHolds != null) {
            legalHolds.forEach(i -> i.setPaymentOption(this));
        }
        this.legalHolds = legalHolds;
    }

    public PaymentOption legalHolds(Set<LegalHold> legalHolds) {
        this.setLegalHolds(legalHolds);
        return this;
    }

    public PaymentOption addLegalHold(LegalHold legalHold) {
        this.legalHolds.add(legalHold);
        legalHold.setPaymentOption(this);
        return this;
    }

    public PaymentOption removeLegalHold(LegalHold legalHold) {
        this.legalHolds.remove(legalHold);
        legalHold.setPaymentOption(null);
        return this;
    }

    public Set<Shareholder> getShareholders() {
        return this.shareholders;
    }

    public void setShareholders(Set<Shareholder> shareholders) {
        if (this.shareholders != null) {
            this.shareholders.forEach(i -> i.setPaymentOption(null));
        }
        if (shareholders != null) {
            shareholders.forEach(i -> i.setPaymentOption(this));
        }
        this.shareholders = shareholders;
    }

    public PaymentOption shareholders(Set<Shareholder> shareholders) {
        this.setShareholders(shareholders);
        return this;
    }

    public PaymentOption addShareholder(Shareholder shareholder) {
        this.shareholders.add(shareholder);
        shareholder.setPaymentOption(this);
        return this;
    }

    public PaymentOption removeShareholder(Shareholder shareholder) {
        this.shareholders.remove(shareholder);
        shareholder.setPaymentOption(null);
        return this;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setPaymentOption(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setPaymentOption(this));
        }
        this.payments = payments;
    }

    public PaymentOption payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public PaymentOption addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setPaymentOption(this);
        return this;
    }

    public PaymentOption removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setPaymentOption(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaymentOption)) {
            return false;
        }
        return id != null && id.equals(((PaymentOption) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaymentOption{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", detail1='" + getDetail1() + "'" +
            ", detail2='" + getDetail2() + "'" +
            "}";
    }
}
