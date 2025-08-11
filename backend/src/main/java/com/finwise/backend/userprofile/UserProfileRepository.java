package com.finwise.backend.userprofile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    Optional<UserProfile> findByUserId(Long userId);
    
    List<UserProfile> findByIsProfileCompleteTrue();
    
    List<UserProfile> findByRiskTolerance(UserProfile.RiskTolerance riskTolerance);
    
    List<UserProfile> findByInvestmentExperience(UserProfile.InvestmentExperience investmentExperience);
    
    @Query("SELECT up FROM UserProfile up WHERE up.panNumber = :panNumber")
    Optional<UserProfile> findByPanNumber(@Param("panNumber") String panNumber);
    
    @Query("SELECT up FROM UserProfile up WHERE up.aadharNumber = :aadharNumber")
    Optional<UserProfile> findByAadharNumber(@Param("aadharNumber") String aadharNumber);
    
    @Query("SELECT COUNT(up) FROM UserProfile up WHERE up.isProfileComplete = true")
    Long countCompleteProfiles();
}
