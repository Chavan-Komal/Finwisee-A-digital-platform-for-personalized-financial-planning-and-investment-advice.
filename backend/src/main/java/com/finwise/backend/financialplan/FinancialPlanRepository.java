package com.finwise.backend.financialplan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FinancialPlanRepository extends JpaRepository<FinancialPlan, Long> {
    
    List<FinancialPlan> findByUserId(Long userId);
    
    List<FinancialPlan> findByPlanType(FinancialPlan.PlanType planType);
    
    List<FinancialPlan> findByStatus(FinancialPlan.PlanStatus status);
    
    @Query("SELECT fp FROM FinancialPlan fp WHERE fp.user.id = :userId AND fp.status = :status")
    List<FinancialPlan> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") FinancialPlan.PlanStatus status);
    
    @Query("SELECT fp FROM FinancialPlan fp WHERE fp.user.id = :userId ORDER BY fp.createdAt DESC")
    List<FinancialPlan> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(fp) FROM FinancialPlan fp WHERE fp.user.id = :userId AND fp.status = 'ACTIVE'")
    Long countActiveByUserId(@Param("userId") Long userId);
}
