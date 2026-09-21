package com.finwise.backend.financialplan;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/financial-plans")
public class FinancialPlanController {

    private final FinancialPlanRepository financialPlanRepository;
    private final CurrentUserService currentUserService;

    public FinancialPlanController(FinancialPlanRepository financialPlanRepository, CurrentUserService currentUserService) {
        this.financialPlanRepository = financialPlanRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<FinancialPlan> getAllFinancialPlans() {
        return financialPlanRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/my-plans")
    public List<FinancialPlan> getMyFinancialPlans(Authentication auth) {
        User user = currentUserService.require(auth);
        return financialPlanRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/{id}")
    public FinancialPlan getFinancialPlanById(@PathVariable Long id, Authentication auth) {
        FinancialPlan plan = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), plan.getUser());
        return plan;
    }

    @PostMapping
    public ResponseEntity<FinancialPlan> createFinancialPlan(@Valid @RequestBody FinancialPlan plan, Authentication auth) {
        User user = currentUserService.require(auth);
        plan.setId(null);
        plan.setUser(user);
        applyDefaults(plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(financialPlanRepository.save(plan));
    }

    @PutMapping("/{id}")
    public FinancialPlan updateFinancialPlan(@PathVariable Long id, @Valid @RequestBody FinancialPlan details, Authentication auth) {
        FinancialPlan plan = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), plan.getUser());
        plan.setTitle(details.getTitle());
        plan.setDescription(details.getDescription());
        plan.setPlanType(details.getPlanType());
        plan.setTargetAmount(details.getTargetAmount());
        plan.setCurrentAmount(details.getCurrentAmount());
        plan.setMonthlyContribution(details.getMonthlyContribution());
        plan.setTargetDate(details.getTargetDate());
        plan.setExpectedReturnRate(details.getExpectedReturnRate());
        plan.setStatus(details.getStatus());
        applyDefaults(plan);
        return financialPlanRepository.save(plan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinancialPlan(@PathVariable Long id, Authentication auth) {
        FinancialPlan plan = find(id);
        CurrentUserService.requireOwnerOrAdmin(currentUserService.require(auth), plan.getUser());
        financialPlanRepository.delete(plan);
        return ResponseEntity.noContent().build();
    }

    private FinancialPlan find(Long id) {
        return financialPlanRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Financial plan"));
    }

    private static void applyDefaults(FinancialPlan plan) {
        if (plan.getPlanType() == null) plan.setPlanType(FinancialPlan.PlanType.OTHER);
        if (plan.getStatus() == null) plan.setStatus(FinancialPlan.PlanStatus.ACTIVE);
        if (plan.getCurrentAmount() == null) plan.setCurrentAmount(BigDecimal.ZERO);
        if (plan.getCurrentAmount().compareTo(plan.getTargetAmount()) >= 0
                && plan.getStatus() == FinancialPlan.PlanStatus.ACTIVE) {
            plan.setStatus(FinancialPlan.PlanStatus.COMPLETED);
        }
    }
}
