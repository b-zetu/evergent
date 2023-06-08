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
 * A VoteProposal.
 */
@Entity
@Table(name = "vote_proposal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VoteProposal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "text")
    private String text;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "voteProposal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "voteEntryXVoteOptions", "shareholder", "voteProposal" }, allowSetters = true)
    private Set<VoteEntry> voteEntries = new HashSet<>();

    @OneToMany(mappedBy = "voteProposal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "voteEntryXVoteOptions", "voteProposal" }, allowSetters = true)
    private Set<VoteOption> voteOptions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VoteProposal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public VoteProposal title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return this.text;
    }

    public VoteProposal text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public VoteProposal startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public VoteProposal endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return this.status;
    }

    public VoteProposal status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<VoteEntry> getVoteEntries() {
        return this.voteEntries;
    }

    public void setVoteEntries(Set<VoteEntry> voteEntries) {
        if (this.voteEntries != null) {
            this.voteEntries.forEach(i -> i.setVoteProposal(null));
        }
        if (voteEntries != null) {
            voteEntries.forEach(i -> i.setVoteProposal(this));
        }
        this.voteEntries = voteEntries;
    }

    public VoteProposal voteEntries(Set<VoteEntry> voteEntries) {
        this.setVoteEntries(voteEntries);
        return this;
    }

    public VoteProposal addVoteEntry(VoteEntry voteEntry) {
        this.voteEntries.add(voteEntry);
        voteEntry.setVoteProposal(this);
        return this;
    }

    public VoteProposal removeVoteEntry(VoteEntry voteEntry) {
        this.voteEntries.remove(voteEntry);
        voteEntry.setVoteProposal(null);
        return this;
    }

    public Set<VoteOption> getVoteOptions() {
        return this.voteOptions;
    }

    public void setVoteOptions(Set<VoteOption> voteOptions) {
        if (this.voteOptions != null) {
            this.voteOptions.forEach(i -> i.setVoteProposal(null));
        }
        if (voteOptions != null) {
            voteOptions.forEach(i -> i.setVoteProposal(this));
        }
        this.voteOptions = voteOptions;
    }

    public VoteProposal voteOptions(Set<VoteOption> voteOptions) {
        this.setVoteOptions(voteOptions);
        return this;
    }

    public VoteProposal addVoteOption(VoteOption voteOption) {
        this.voteOptions.add(voteOption);
        voteOption.setVoteProposal(this);
        return this;
    }

    public VoteProposal removeVoteOption(VoteOption voteOption) {
        this.voteOptions.remove(voteOption);
        voteOption.setVoteProposal(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VoteProposal)) {
            return false;
        }
        return id != null && id.equals(((VoteProposal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VoteProposal{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", text='" + getText() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
