package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LegalHold.
 */
@Entity
@Table(name = "legal_hold")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LegalHold implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "beneficiary_name")
    private String beneficiaryName;

    @Column(name = "type")
    private String type;

    @Column(name = "total_amount", precision = 21, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "amount_left", precision = 21, scale = 2)
    private BigDecimal amountLeft;

    @Column(name = "poprire_number")
    private String poprireNumber;

    @Column(name = "poprire_date")
    private LocalDate poprireDate;

    @Column(name = "poprire_document_number")
    private String poprireDocumentNumber;

    @Column(name = "poprire_document_date")
    private LocalDate poprireDocumentDate;

    @Column(name = "sistare_number")
    private String sistareNumber;

    @Column(name = "sistare_date")
    private LocalDate sistareDate;

    @Column(name = "sistare_intrare_number")
    private String sistareIntrareNumber;

    @Column(name = "sistare_intrare_date")
    private LocalDate sistareIntrareDate;

    @Column(name = "status")
    private String status;

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
    @JsonIgnoreProperties(value = { "dividendShareholders", "legalHolds", "shareholders", "payments" }, allowSetters = true)
    private PaymentOption paymentOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LegalHold id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBeneficiaryName() {
        return this.beneficiaryName;
    }

    public LegalHold beneficiaryName(String beneficiaryName) {
        this.setBeneficiaryName(beneficiaryName);
        return this;
    }

    public void setBeneficiaryName(String beneficiaryName) {
        this.beneficiaryName = beneficiaryName;
    }

    public String getType() {
        return this.type;
    }

    public LegalHold type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public LegalHold totalAmount(BigDecimal totalAmount) {
        this.setTotalAmount(totalAmount);
        return this;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAmountLeft() {
        return this.amountLeft;
    }

    public LegalHold amountLeft(BigDecimal amountLeft) {
        this.setAmountLeft(amountLeft);
        return this;
    }

    public void setAmountLeft(BigDecimal amountLeft) {
        this.amountLeft = amountLeft;
    }

    public String getPoprireNumber() {
        return this.poprireNumber;
    }

    public LegalHold poprireNumber(String poprireNumber) {
        this.setPoprireNumber(poprireNumber);
        return this;
    }

    public void setPoprireNumber(String poprireNumber) {
        this.poprireNumber = poprireNumber;
    }

    public LocalDate getPoprireDate() {
        return this.poprireDate;
    }

    public LegalHold poprireDate(LocalDate poprireDate) {
        this.setPoprireDate(poprireDate);
        return this;
    }

    public void setPoprireDate(LocalDate poprireDate) {
        this.poprireDate = poprireDate;
    }

    public String getPoprireDocumentNumber() {
        return this.poprireDocumentNumber;
    }

    public LegalHold poprireDocumentNumber(String poprireDocumentNumber) {
        this.setPoprireDocumentNumber(poprireDocumentNumber);
        return this;
    }

    public void setPoprireDocumentNumber(String poprireDocumentNumber) {
        this.poprireDocumentNumber = poprireDocumentNumber;
    }

    public LocalDate getPoprireDocumentDate() {
        return this.poprireDocumentDate;
    }

    public LegalHold poprireDocumentDate(LocalDate poprireDocumentDate) {
        this.setPoprireDocumentDate(poprireDocumentDate);
        return this;
    }

    public void setPoprireDocumentDate(LocalDate poprireDocumentDate) {
        this.poprireDocumentDate = poprireDocumentDate;
    }

    public String getSistareNumber() {
        return this.sistareNumber;
    }

    public LegalHold sistareNumber(String sistareNumber) {
        this.setSistareNumber(sistareNumber);
        return this;
    }

    public void setSistareNumber(String sistareNumber) {
        this.sistareNumber = sistareNumber;
    }

    public LocalDate getSistareDate() {
        return this.sistareDate;
    }

    public LegalHold sistareDate(LocalDate sistareDate) {
        this.setSistareDate(sistareDate);
        return this;
    }

    public void setSistareDate(LocalDate sistareDate) {
        this.sistareDate = sistareDate;
    }

    public String getSistareIntrareNumber() {
        return this.sistareIntrareNumber;
    }

    public LegalHold sistareIntrareNumber(String sistareIntrareNumber) {
        this.setSistareIntrareNumber(sistareIntrareNumber);
        return this;
    }

    public void setSistareIntrareNumber(String sistareIntrareNumber) {
        this.sistareIntrareNumber = sistareIntrareNumber;
    }

    public LocalDate getSistareIntrareDate() {
        return this.sistareIntrareDate;
    }

    public LegalHold sistareIntrareDate(LocalDate sistareIntrareDate) {
        this.setSistareIntrareDate(sistareIntrareDate);
        return this;
    }

    public void setSistareIntrareDate(LocalDate sistareIntrareDate) {
        this.sistareIntrareDate = sistareIntrareDate;
    }

    public String getStatus() {
        return this.status;
    }

    public LegalHold status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Shareholder getShareholder() {
        return this.shareholder;
    }

    public void setShareholder(Shareholder shareholder) {
        this.shareholder = shareholder;
    }

    public LegalHold shareholder(Shareholder shareholder) {
        this.setShareholder(shareholder);
        return this;
    }

    public PaymentOption getPaymentOption() {
        return this.paymentOption;
    }

    public void setPaymentOption(PaymentOption paymentOption) {
        this.paymentOption = paymentOption;
    }

    public LegalHold paymentOption(PaymentOption paymentOption) {
        this.setPaymentOption(paymentOption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LegalHold)) {
            return false;
        }
        return id != null && id.equals(((LegalHold) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LegalHold{" +
            "id=" + getId() +
            ", beneficiaryName='" + getBeneficiaryName() + "'" +
            ", type='" + getType() + "'" +
            ", totalAmount=" + getTotalAmount() +
            ", amountLeft=" + getAmountLeft() +
            ", poprireNumber='" + getPoprireNumber() + "'" +
            ", poprireDate='" + getPoprireDate() + "'" +
            ", poprireDocumentNumber='" + getPoprireDocumentNumber() + "'" +
            ", poprireDocumentDate='" + getPoprireDocumentDate() + "'" +
            ", sistareNumber='" + getSistareNumber() + "'" +
            ", sistareDate='" + getSistareDate() + "'" +
            ", sistareIntrareNumber='" + getSistareIntrareNumber() + "'" +
            ", sistareIntrareDate='" + getSistareIntrareDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
