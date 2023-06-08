package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Inheritance.
 */
@Entity
@Table(name = "inheritance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Inheritance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "operation_date")
    private LocalDate operationDate;

    @Column(name = "document_number")
    private String documentNumber;

    @Column(name = "document_date")
    private LocalDate documentDate;

    @Column(name = "shares_no")
    private Integer sharesNo;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "inheritance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "deceased", "receiver", "inheritance" }, allowSetters = true)
    private Set<ShareholderXInheritance> shareholderXInheritances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Inheritance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getOperationDate() {
        return this.operationDate;
    }

    public Inheritance operationDate(LocalDate operationDate) {
        this.setOperationDate(operationDate);
        return this;
    }

    public void setOperationDate(LocalDate operationDate) {
        this.operationDate = operationDate;
    }

    public String getDocumentNumber() {
        return this.documentNumber;
    }

    public Inheritance documentNumber(String documentNumber) {
        this.setDocumentNumber(documentNumber);
        return this;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public LocalDate getDocumentDate() {
        return this.documentDate;
    }

    public Inheritance documentDate(LocalDate documentDate) {
        this.setDocumentDate(documentDate);
        return this;
    }

    public void setDocumentDate(LocalDate documentDate) {
        this.documentDate = documentDate;
    }

    public Integer getSharesNo() {
        return this.sharesNo;
    }

    public Inheritance sharesNo(Integer sharesNo) {
        this.setSharesNo(sharesNo);
        return this;
    }

    public void setSharesNo(Integer sharesNo) {
        this.sharesNo = sharesNo;
    }

    public String getStatus() {
        return this.status;
    }

    public Inheritance status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<ShareholderXInheritance> getShareholderXInheritances() {
        return this.shareholderXInheritances;
    }

    public void setShareholderXInheritances(Set<ShareholderXInheritance> shareholderXInheritances) {
        if (this.shareholderXInheritances != null) {
            this.shareholderXInheritances.forEach(i -> i.setInheritance(null));
        }
        if (shareholderXInheritances != null) {
            shareholderXInheritances.forEach(i -> i.setInheritance(this));
        }
        this.shareholderXInheritances = shareholderXInheritances;
    }

    public Inheritance shareholderXInheritances(Set<ShareholderXInheritance> shareholderXInheritances) {
        this.setShareholderXInheritances(shareholderXInheritances);
        return this;
    }

    public Inheritance addShareholderXInheritance(ShareholderXInheritance shareholderXInheritance) {
        this.shareholderXInheritances.add(shareholderXInheritance);
        shareholderXInheritance.setInheritance(this);
        return this;
    }

    public Inheritance removeShareholderXInheritance(ShareholderXInheritance shareholderXInheritance) {
        this.shareholderXInheritances.remove(shareholderXInheritance);
        shareholderXInheritance.setInheritance(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Inheritance)) {
            return false;
        }
        return id != null && id.equals(((Inheritance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Inheritance{" +
            "id=" + getId() +
            ", operationDate='" + getOperationDate() + "'" +
            ", documentNumber='" + getDocumentNumber() + "'" +
            ", documentDate='" + getDocumentDate() + "'" +
            ", sharesNo=" + getSharesNo() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
