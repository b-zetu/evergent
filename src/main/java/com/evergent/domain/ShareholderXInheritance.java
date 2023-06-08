package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ShareholderXInheritance.
 */
@Entity
@Table(name = "shareholder_x_inheritance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ShareholderXInheritance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

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
    private Shareholder deceased;

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
    private Shareholder receiver;

    @ManyToOne
    @JsonIgnoreProperties(value = { "shareholderXInheritances" }, allowSetters = true)
    private Inheritance inheritance;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ShareholderXInheritance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Shareholder getDeceased() {
        return this.deceased;
    }

    public void setDeceased(Shareholder shareholder) {
        this.deceased = shareholder;
    }

    public ShareholderXInheritance deceased(Shareholder shareholder) {
        this.setDeceased(shareholder);
        return this;
    }

    public Shareholder getReceiver() {
        return this.receiver;
    }

    public void setReceiver(Shareholder shareholder) {
        this.receiver = shareholder;
    }

    public ShareholderXInheritance receiver(Shareholder shareholder) {
        this.setReceiver(shareholder);
        return this;
    }

    public Inheritance getInheritance() {
        return this.inheritance;
    }

    public void setInheritance(Inheritance inheritance) {
        this.inheritance = inheritance;
    }

    public ShareholderXInheritance inheritance(Inheritance inheritance) {
        this.setInheritance(inheritance);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShareholderXInheritance)) {
            return false;
        }
        return id != null && id.equals(((ShareholderXInheritance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShareholderXInheritance{" +
            "id=" + getId() +
            "}";
    }
}
