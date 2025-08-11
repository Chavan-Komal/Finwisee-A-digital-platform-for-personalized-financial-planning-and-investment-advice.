package com.finwise.backend.financialplan;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/financial-plans")
@CrossOrigin(origins = "*")
public class FinancialPlanController {

    @Autowired
    private FinancialPlanRepository financialPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FinancialPlan>> getAllFinancialPlans() {
        List<FinancialPlan> plans = financialPlanRepository.findAll();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/my-plans")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FinancialPlan>> getMyFinancialPlans(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<FinancialPlan> plans = financialPlanRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @financialPlanRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<FinancialPlan> getFinancialPlanById(@PathVariable Long id) {
        return financialPlanRepository.findById(id)
                .map(plan -> ResponseEntity.ok().body(plan))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FinancialPlan>> getPlansByType(@PathVariable FinancialPlan.PlanType type, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<FinancialPlan> plans = financialPlanRepository.findByPlanType(type);
        // Filter by user if not admin
        if (!user.getRole().name().equals("ADMIN")) {
            plans = plans.stream().filter(plan -> plan.getUser().getId().equals(user.getId())).toList();
        }
        return ResponseEntity.ok(plans);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FinancialPlan> createFinancialPlan(@Valid @RequestBody FinancialPlan plan, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        plan.setUser(user);
        FinancialPlan savedPlan = financialPlanRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @financialPlanRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<FinancialPlan> updateFinancialPlan(@PathVariable Long id, @Valid @RequestBody FinancialPlan planDetails) {
        return financialPlanRepository.findById(id)
                .map(plan -> {
                    plan.setTitle(planDetails.getTitle());
                    plan.setDescription(planDetails.getDescription());
                    plan.setPlanType(planDetails.getPlanType());
                    plan.setTargetAmount(planDetails.getTargetAmount());
                    plan.setCurrentAmount(planDetails.getCurrentAmount());
                    plan.setMonthlyContribution(planDetails.getMonthlyContribution());
                    plan.setTargetDate(planDetails.getTargetDate());
                    plan.setExpectedReturnRate(planDetails.getExpectedReturnRate());
                    plan.setStatus(planDetails.getStatus());
                    return ResponseEntity.ok(financialPlanRepository.save(plan));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @financialPlanRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<?> deleteFinancialPlan(@PathVariable Long id) {
        return financialPlanRepository.findById(id)
                .map(plan -> {
                    financialPlanRepository.delete(plan);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-plans/count")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getActiveFinancialPlansCount(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Long count = financialPlanRepository.countActiveByUserId(user.getId());
        return ResponseEntity.ok(count);
    }
}
