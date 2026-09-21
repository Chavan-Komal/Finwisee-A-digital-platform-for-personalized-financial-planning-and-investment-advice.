package com.finwise.backend.financialplan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialPlanRepository extends JpaRepository<FinancialPlan, Long> {

    @Query("SELECT fp FROM FinancialPlan fp WHERE fp.user.id = :userId ORDER BY fp.createdAt DESC")
    List<FinancialPlan> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    List<FinancialPlan> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("DELETE FROM FinancialPlan fp WHERE fp.user.id = :userId")
    void deleteAllForUser(@Param("userId") Long userId);
}
