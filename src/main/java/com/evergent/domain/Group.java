package com.evergent.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Group.
 */
@Entity
@Table(name = "jhi_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Group implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @OneToMany(mappedBy = "group")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shareholder", "group" }, allowSetters = true)
    private Set<ShareholderXGroup> shareholderXGroups = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Group id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Group name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public Group code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<ShareholderXGroup> getShareholderXGroups() {
        return this.shareholderXGroups;
    }

    public void setShareholderXGroups(Set<ShareholderXGroup> shareholderXGroups) {
        if (this.shareholderXGroups != null) {
            this.shareholderXGroups.forEach(i -> i.setGroup(null));
        }
        if (shareholderXGroups != null) {
            shareholderXGroups.forEach(i -> i.setGroup(this));
        }
        this.shareholderXGroups = shareholderXGroups;
    }

    public Group shareholderXGroups(Set<ShareholderXGroup> shareholderXGroups) {
        this.setShareholderXGroups(shareholderXGroups);
        return this;
    }

    public Group addShareholderXGroup(ShareholderXGroup shareholderXGroup) {
        this.shareholderXGroups.add(shareholderXGroup);
        shareholderXGroup.setGroup(this);
        return this;
    }

    public Group removeShareholderXGroup(ShareholderXGroup shareholderXGroup) {
        this.shareholderXGroups.remove(shareholderXGroup);
        shareholderXGroup.setGroup(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Group)) {
            return false;
        }
        return id != null && id.equals(((Group) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Group{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
