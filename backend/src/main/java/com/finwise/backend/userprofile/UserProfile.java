package com.finwise.backend.userprofile;

import com.finwise.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    private String occupation;

    @Column(name = "annual_income")
    private BigDecimal annualIncome;

    @Column(name = "investment_experience")
    @Enumerated(EnumType.STRING)
    private InvestmentExperience investmentExperience;

    @Column(name = "risk_tolerance")
    @Enumerated(EnumType.STRING)
    private RiskTolerance riskTolerance;

    @Column(name = "financial_goals", columnDefinition = "TEXT")
    private String financialGoals;

    private String address;

    private String city;

    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;

    @Column(name = "pan_number")
    private String panNumber;

    @JsonIgnore
    @Column(name = "aadhar_number")
    private String aadharNumber;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "is_profile_complete")
    private Boolean isProfileComplete = false;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum InvestmentExperience {
        BEGINNER, INTERMEDIATE, EXPERIENCED, EXPERT
    }

    public enum RiskTolerance {
        CONSERVATIVE, MODERATE, AGGRESSIVE, VERY_AGGRESSIVE
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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }

    public InvestmentExperience getInvestmentExperience() { return investmentExperience; }
    public void setInvestmentExperience(InvestmentExperience investmentExperience) { this.investmentExperience = investmentExperience; }

    public RiskTolerance getRiskTolerance() { return riskTolerance; }
    public void setRiskTolerance(RiskTolerance riskTolerance) { this.riskTolerance = riskTolerance; }

    public String getFinancialGoals() { return financialGoals; }
    public void setFinancialGoals(String financialGoals) { this.financialGoals = financialGoals; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public Boolean getIsProfileComplete() { return isProfileComplete; }
    public void setIsProfileComplete(Boolean isProfileComplete) { this.isProfileComplete = isProfileComplete; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
