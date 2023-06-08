package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VoteEntry.
 */
@Entity
@Table(name = "vote_entry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VoteEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "voteEntry")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "voteEntry", "voteOption" }, allowSetters = true)
    private Set<VoteEntryXVoteOption> voteEntryXVoteOptions = new HashSet<>();

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
    @JsonIgnoreProperties(value = { "voteEntries", "voteOptions" }, allowSetters = true)
    private VoteProposal voteProposal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VoteEntry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<VoteEntryXVoteOption> getVoteEntryXVoteOptions() {
        return this.voteEntryXVoteOptions;
    }

    public void setVoteEntryXVoteOptions(Set<VoteEntryXVoteOption> voteEntryXVoteOptions) {
        if (this.voteEntryXVoteOptions != null) {
            this.voteEntryXVoteOptions.forEach(i -> i.setVoteEntry(null));
        }
        if (voteEntryXVoteOptions != null) {
            voteEntryXVoteOptions.forEach(i -> i.setVoteEntry(this));
        }
        this.voteEntryXVoteOptions = voteEntryXVoteOptions;
    }

    public VoteEntry voteEntryXVoteOptions(Set<VoteEntryXVoteOption> voteEntryXVoteOptions) {
        this.setVoteEntryXVoteOptions(voteEntryXVoteOptions);
        return this;
    }

    public VoteEntry addVoteEntryXVoteOption(VoteEntryXVoteOption voteEntryXVoteOption) {
        this.voteEntryXVoteOptions.add(voteEntryXVoteOption);
        voteEntryXVoteOption.setVoteEntry(this);
        return this;
    }

    public VoteEntry removeVoteEntryXVoteOption(VoteEntryXVoteOption voteEntryXVoteOption) {
        this.voteEntryXVoteOptions.remove(voteEntryXVoteOption);
        voteEntryXVoteOption.setVoteEntry(null);
        return this;
    }

    public Shareholder getShareholder() {
        return this.shareholder;
    }

    public void setShareholder(Shareholder shareholder) {
        this.shareholder = shareholder;
    }

    public VoteEntry shareholder(Shareholder shareholder) {
        this.setShareholder(shareholder);
        return this;
    }

    public VoteProposal getVoteProposal() {
        return this.voteProposal;
    }

    public void setVoteProposal(VoteProposal voteProposal) {
        this.voteProposal = voteProposal;
    }

    public VoteEntry voteProposal(VoteProposal voteProposal) {
        this.setVoteProposal(voteProposal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VoteEntry)) {
            return false;
        }
        return id != null && id.equals(((VoteEntry) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VoteEntry{" +
            "id=" + getId() +
            "}";
    }
}
