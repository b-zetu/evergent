package com.evergent.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.evergent.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.evergent.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.evergent.domain.User.class.getName());
            createCache(cm, com.evergent.domain.Authority.class.getName());
            createCache(cm, com.evergent.domain.User.class.getName() + ".authorities");
            createCache(cm, com.evergent.domain.PaymentOption.class.getName());
            createCache(cm, com.evergent.domain.PaymentOption.class.getName() + ".dividendShareholders");
            createCache(cm, com.evergent.domain.PaymentOption.class.getName() + ".legalHolds");
            createCache(cm, com.evergent.domain.PaymentOption.class.getName() + ".shareholders");
            createCache(cm, com.evergent.domain.PaymentOption.class.getName() + ".payments");
            createCache(cm, com.evergent.domain.Shareholder.class.getName());
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".communications");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".dividendShareholders");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".legalHolds");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".payments");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".voteEntries");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".deceaseds");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".receivers");
            createCache(cm, com.evergent.domain.Shareholder.class.getName() + ".shareholderXGroups");
            createCache(cm, com.evergent.domain.DividendShareholder.class.getName());
            createCache(cm, com.evergent.domain.DividendShareholder.class.getName() + ".dividendCalculations");
            createCache(cm, com.evergent.domain.DividendCalculation.class.getName());
            createCache(cm, com.evergent.domain.DividendCalculation.class.getName() + ".payments");
            createCache(cm, com.evergent.domain.DividendRegister.class.getName());
            createCache(cm, com.evergent.domain.DividendRegister.class.getName() + ".dividendShareholders");
            createCache(cm, com.evergent.domain.LegalHold.class.getName());
            createCache(cm, com.evergent.domain.Payment.class.getName());
            createCache(cm, com.evergent.domain.Communication.class.getName());
            createCache(cm, com.evergent.domain.SysParameter.class.getName());
            createCache(cm, com.evergent.domain.VoteEntry.class.getName());
            createCache(cm, com.evergent.domain.VoteEntry.class.getName() + ".voteEntryXVoteOptions");
            createCache(cm, com.evergent.domain.VoteProposal.class.getName());
            createCache(cm, com.evergent.domain.VoteProposal.class.getName() + ".voteEntries");
            createCache(cm, com.evergent.domain.VoteProposal.class.getName() + ".voteOptions");
            createCache(cm, com.evergent.domain.VoteOption.class.getName());
            createCache(cm, com.evergent.domain.VoteOption.class.getName() + ".voteEntryXVoteOptions");
            createCache(cm, com.evergent.domain.Group.class.getName());
            createCache(cm, com.evergent.domain.Group.class.getName() + ".shareholderXGroups");
            createCache(cm, com.evergent.domain.Inheritance.class.getName());
            createCache(cm, com.evergent.domain.Inheritance.class.getName() + ".shareholderXInheritances");
            createCache(cm, com.evergent.domain.ShareholderXInheritance.class.getName());
            createCache(cm, com.evergent.domain.ShareholderXGroup.class.getName());
            createCache(cm, com.evergent.domain.VoteEntryXVoteOption.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
