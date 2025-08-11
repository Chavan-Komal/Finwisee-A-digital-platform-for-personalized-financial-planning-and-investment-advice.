package com.finwise.backend.investment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvestmentProductRepository extends JpaRepository<InvestmentProduct, Long> {
    
    List<InvestmentProduct> findByIsActiveTrue();
    
    List<InvestmentProduct> findByProductType(InvestmentProduct.ProductType productType);
    
    List<InvestmentProduct> findByRiskLevel(InvestmentProduct.RiskLevel riskLevel);
    
    @Query("SELECT ip FROM InvestmentProduct ip WHERE ip.isActive = true AND ip.productType = :productType")
    List<InvestmentProduct> findActiveByProductType(@Param("productType") InvestmentProduct.ProductType productType);
    
    @Query("SELECT ip FROM InvestmentProduct ip WHERE ip.isActive = true AND ip.riskLevel = :riskLevel")
    List<InvestmentProduct> findActiveByRiskLevel(@Param("riskLevel") InvestmentProduct.RiskLevel riskLevel);
    
    @Query("SELECT ip FROM InvestmentProduct ip WHERE ip.isActive = true ORDER BY ip.expectedReturnRate DESC")
    List<InvestmentProduct> findAllActiveOrderByReturnRateDesc();
    
    @Query("SELECT ip FROM InvestmentProduct ip WHERE ip.name LIKE %:name% AND ip.isActive = true")
    List<InvestmentProduct> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);
}
