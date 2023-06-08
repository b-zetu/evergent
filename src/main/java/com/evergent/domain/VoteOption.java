package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VoteOption.
 */
@Entity
@Table(name = "vote_option")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VoteOption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "text")
    private String text;

    @OneToMany(mappedBy = "voteOption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "voteEntry", "voteOption" }, allowSetters = true)
    private Set<VoteEntryXVoteOption> voteEntryXVoteOptions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "voteEntries", "voteOptions" }, allowSetters = true)
    private VoteProposal voteProposal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VoteOption id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public VoteOption code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getText() {
        return this.text;
    }

    public VoteOption text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Set<VoteEntryXVoteOption> getVoteEntryXVoteOptions() {
        return this.voteEntryXVoteOptions;
    }

    public void setVoteEntryXVoteOptions(Set<VoteEntryXVoteOption> voteEntryXVoteOptions) {
        if (this.voteEntryXVoteOptions != null) {
            this.voteEntryXVoteOptions.forEach(i -> i.setVoteOption(null));
        }
        if (voteEntryXVoteOptions != null) {
            voteEntryXVoteOptions.forEach(i -> i.setVoteOption(this));
        }
        this.voteEntryXVoteOptions = voteEntryXVoteOptions;
    }

    public VoteOption voteEntryXVoteOptions(Set<VoteEntryXVoteOption> voteEntryXVoteOptions) {
        this.setVoteEntryXVoteOptions(voteEntryXVoteOptions);
        return this;
    }

    public VoteOption addVoteEntryXVoteOption(VoteEntryXVoteOption voteEntryXVoteOption) {
        this.voteEntryXVoteOptions.add(voteEntryXVoteOption);
        voteEntryXVoteOption.setVoteOption(this);
        return this;
    }

    public VoteOption removeVoteEntryXVoteOption(VoteEntryXVoteOption voteEntryXVoteOption) {
        this.voteEntryXVoteOptions.remove(voteEntryXVoteOption);
        voteEntryXVoteOption.setVoteOption(null);
        return this;
    }

    public VoteProposal getVoteProposal() {
        return this.voteProposal;
    }

    public void setVoteProposal(VoteProposal voteProposal) {
        this.voteProposal = voteProposal;
    }

    public VoteOption voteProposal(VoteProposal voteProposal) {
        this.setVoteProposal(voteProposal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VoteOption)) {
            return false;
        }
        return id != null && id.equals(((VoteOption) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VoteOption{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", text='" + getText() + "'" +
            "}";
    }
}
