package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VoteEntryXVoteOption.
 */
@Entity
@Table(name = "vote_entry_x_vote_option")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VoteEntryXVoteOption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "voteEntryXVoteOptions", "shareholder", "voteProposal" }, allowSetters = true)
    private VoteEntry voteEntry;

    @ManyToOne
    @JsonIgnoreProperties(value = { "voteEntryXVoteOptions", "voteProposal" }, allowSetters = true)
    private VoteOption voteOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VoteEntryXVoteOption id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VoteEntry getVoteEntry() {
        return this.voteEntry;
    }

    public void setVoteEntry(VoteEntry voteEntry) {
        this.voteEntry = voteEntry;
    }

    public VoteEntryXVoteOption voteEntry(VoteEntry voteEntry) {
        this.setVoteEntry(voteEntry);
        return this;
    }

    public VoteOption getVoteOption() {
        return this.voteOption;
    }

    public void setVoteOption(VoteOption voteOption) {
        this.voteOption = voteOption;
    }

    public VoteEntryXVoteOption voteOption(VoteOption voteOption) {
        this.setVoteOption(voteOption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VoteEntryXVoteOption)) {
            return false;
        }
        return id != null && id.equals(((VoteEntryXVoteOption) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VoteEntryXVoteOption{" +
            "id=" + getId() +
            "}";
    }
}
