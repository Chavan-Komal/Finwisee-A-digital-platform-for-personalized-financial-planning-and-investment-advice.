package com.finwise.backend.investment;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "investment_products")
public class InvestmentProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false)
    private ProductType productType;

    @Column(name = "risk_level")
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    @Column(name = "expected_return_rate")
    private BigDecimal expectedReturnRate;

    @Column(name = "minimum_investment")
    private BigDecimal minimumInvestment;

    @Column(name = "maximum_investment")
    private BigDecimal maximumInvestment;

    @Column(name = "lock_in_period_months")
    private Integer lockInPeriodMonths;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum ProductType {
        MUTUAL_FUND, STOCK, BOND, FD, SIP, ULIP, ETF, GOLD, REAL_ESTATE
    }

    public enum RiskLevel {
        LOW, MODERATE, HIGH, VERY_HIGH
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProductType getProductType() { return productType; }
    public void setProductType(ProductType productType) { this.productType = productType; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public BigDecimal getExpectedReturnRate() { return expectedReturnRate; }
    public void setExpectedReturnRate(BigDecimal expectedReturnRate) { this.expectedReturnRate = expectedReturnRate; }

    public BigDecimal getMinimumInvestment() { return minimumInvestment; }
    public void setMinimumInvestment(BigDecimal minimumInvestment) { this.minimumInvestment = minimumInvestment; }

    public BigDecimal getMaximumInvestment() { return maximumInvestment; }
    public void setMaximumInvestment(BigDecimal maximumInvestment) { this.maximumInvestment = maximumInvestment; }

    public Integer getLockInPeriodMonths() { return lockInPeriodMonths; }
    public void setLockInPeriodMonths(Integer lockInPeriodMonths) { this.lockInPeriodMonths = lockInPeriodMonths; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
