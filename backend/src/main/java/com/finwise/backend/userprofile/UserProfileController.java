package com.finwise.backend.userprofile;

import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {

    private final UserProfileRepository userProfileRepository;
    private final CurrentUserService currentUserService;

    public UserProfileController(UserProfileRepository userProfileRepository, CurrentUserService currentUserService) {
        this.userProfileRepository = userProfileRepository;
        this.currentUserService = currentUserService;
    }

    /** Returns the caller's financial profile, creating an empty one on first access. */
    @GetMapping("/my-profile")
    public UserProfile getMyProfile(Authentication auth) {
        User user = currentUserService.require(auth);
        return userProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
            UserProfile profile = new UserProfile();
            profile.setUser(user);
            profile.setIsProfileComplete(false);
            return userProfileRepository.save(profile);
        });
    }

    @PutMapping
    public UserProfile updateProfile(@RequestBody UserProfile details, Authentication auth) {
        User user = currentUserService.require(auth);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
            UserProfile created = new UserProfile();
            created.setUser(user);
            return created;
        });
        profile.setDateOfBirth(details.getDateOfBirth());
        profile.setGender(details.getGender());
        profile.setOccupation(details.getOccupation());
        profile.setAnnualIncome(details.getAnnualIncome());
        profile.setInvestmentExperience(details.getInvestmentExperience());
        profile.setRiskTolerance(details.getRiskTolerance());
        profile.setFinancialGoals(details.getFinancialGoals());
        profile.setAddress(details.getAddress());
        profile.setCity(details.getCity());
        profile.setState(details.getState());
        profile.setPostalCode(details.getPostalCode());
        profile.setCountry(details.getCountry());
        profile.setPanNumber(details.getPanNumber());
        profile.setProfileImageUrl(details.getProfileImageUrl());
        profile.setIsProfileComplete(isComplete(profile));
        return userProfileRepository.save(profile);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    private static boolean isComplete(UserProfile p) {
        return p.getDateOfBirth() != null && p.getOccupation() != null && !p.getOccupation().isBlank()
                && p.getAnnualIncome() != null && p.getRiskTolerance() != null
                && p.getInvestmentExperience() != null && p.getCity() != null && !p.getCity().isBlank();
    }
}
