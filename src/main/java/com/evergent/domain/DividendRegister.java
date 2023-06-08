package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DividendRegister.
 */
@Entity
@Table(name = "dividend_register")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DividendRegister implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "reference_date")
    private LocalDate referenceDate;

    @Column(name = "dividend_gross_value", precision = 21, scale = 2)
    private BigDecimal dividendGrossValue;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "dividendRegister")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "dividendCalculations", "shareholder", "dividendRegister", "paymentOption" }, allowSetters = true)
    private Set<DividendShareholder> dividendShareholders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DividendRegister id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getReferenceDate() {
        return this.referenceDate;
    }

    public DividendRegister referenceDate(LocalDate referenceDate) {
        this.setReferenceDate(referenceDate);
        return this;
    }

    public void setReferenceDate(LocalDate referenceDate) {
        this.referenceDate = referenceDate;
    }

    public BigDecimal getDividendGrossValue() {
        return this.dividendGrossValue;
    }

    public DividendRegister dividendGrossValue(BigDecimal dividendGrossValue) {
        this.setDividendGrossValue(dividendGrossValue);
        return this;
    }

    public void setDividendGrossValue(BigDecimal dividendGrossValue) {
        this.dividendGrossValue = dividendGrossValue;
    }

    public String getStatus() {
        return this.status;
    }

    public DividendRegister status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<DividendShareholder> getDividendShareholders() {
        return this.dividendShareholders;
    }

    public void setDividendShareholders(Set<DividendShareholder> dividendShareholders) {
        if (this.dividendShareholders != null) {
            this.dividendShareholders.forEach(i -> i.setDividendRegister(null));
        }
        if (dividendShareholders != null) {
            dividendShareholders.forEach(i -> i.setDividendRegister(this));
        }
        this.dividendShareholders = dividendShareholders;
    }

    public DividendRegister dividendShareholders(Set<DividendShareholder> dividendShareholders) {
        this.setDividendShareholders(dividendShareholders);
        return this;
    }

    public DividendRegister addDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.add(dividendShareholder);
        dividendShareholder.setDividendRegister(this);
        return this;
    }

    public DividendRegister removeDividendShareholder(DividendShareholder dividendShareholder) {
        this.dividendShareholders.remove(dividendShareholder);
        dividendShareholder.setDividendRegister(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DividendRegister)) {
            return false;
        }
        return id != null && id.equals(((DividendRegister) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DividendRegister{" +
            "id=" + getId() +
            ", referenceDate='" + getReferenceDate() + "'" +
            ", dividendGrossValue=" + getDividendGrossValue() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
