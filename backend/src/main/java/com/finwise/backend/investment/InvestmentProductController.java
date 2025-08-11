package com.finwise.backend.investment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/investment-products")
@CrossOrigin(origins = "*")
public class InvestmentProductController {

    @Autowired
    private InvestmentProductRepository investmentProductRepository;

    @GetMapping
    public ResponseEntity<List<InvestmentProduct>> getAllInvestmentProducts() {
        List<InvestmentProduct> products = investmentProductRepository.findByIsActiveTrue();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentProduct> getInvestmentProductById(@PathVariable Long id) {
        return investmentProductRepository.findById(id)
                .map(product -> ResponseEntity.ok().body(product))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<InvestmentProduct>> getProductsByType(@PathVariable InvestmentProduct.ProductType type) {
        List<InvestmentProduct> products = investmentProductRepository.findActiveByProductType(type);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/risk/{riskLevel}")
    public ResponseEntity<List<InvestmentProduct>> getProductsByRiskLevel(@PathVariable InvestmentProduct.RiskLevel riskLevel) {
        List<InvestmentProduct> products = investmentProductRepository.findActiveByRiskLevel(riskLevel);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<InvestmentProduct>> searchProducts(@RequestParam String name) {
        List<InvestmentProduct> products = investmentProductRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/top-returns")
    public ResponseEntity<List<InvestmentProduct>> getTopReturnProducts() {
        List<InvestmentProduct> products = investmentProductRepository.findAllActiveOrderByReturnRateDesc();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InvestmentProduct> createInvestmentProduct(@Valid @RequestBody InvestmentProduct product) {
        InvestmentProduct savedProduct = investmentProductRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InvestmentProduct> updateInvestmentProduct(@PathVariable Long id, @Valid @RequestBody InvestmentProduct productDetails) {
        return investmentProductRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setProductType(productDetails.getProductType());
                    product.setRiskLevel(productDetails.getRiskLevel());
                    product.setExpectedReturnRate(productDetails.getExpectedReturnRate());
                    product.setMinimumInvestment(productDetails.getMinimumInvestment());
                    product.setMaximumInvestment(productDetails.getMaximumInvestment());
                    product.setLockInPeriodMonths(productDetails.getLockInPeriodMonths());
                    product.setProviderName(productDetails.getProviderName());
                    product.setIsActive(productDetails.getIsActive());
                    return ResponseEntity.ok(investmentProductRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteInvestmentProduct(@PathVariable Long id) {
        return investmentProductRepository.findById(id)
                .map(product -> {
                    product.setIsActive(false); // Soft delete
                    investmentProductRepository.save(product);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
