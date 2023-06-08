package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Communication.
 */
@Entity
@Table(name = "communication")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Communication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "message")
    private String message;

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Communication id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public Communication type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return this.message;
    }

    public Communication message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return this.status;
    }

    public Communication status(String status) {
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

    public Communication shareholder(Shareholder shareholder) {
        this.setShareholder(shareholder);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Communication)) {
            return false;
        }
        return id != null && id.equals(((Communication) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Communication{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", message='" + getMessage() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
