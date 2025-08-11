package com.finwise.backend.userprofile;

import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfile> getMyProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            return ResponseEntity.ok(profileOpt.get());
        } else {
            // Create a default profile if none exists
            UserProfile defaultProfile = new UserProfile();
            defaultProfile.setUser(user);
            defaultProfile.setIsProfileComplete(false);
            UserProfile savedProfile = userProfileRepository.save(defaultProfile);
            return ResponseEntity.ok(savedProfile);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfile> createProfile(@Valid @RequestBody UserProfile profile, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check if profile already exists
        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(user.getId());
        if (existingProfile.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        profile.setUser(user);
        profile.setIsProfileComplete(true);
        UserProfile savedProfile = userProfileRepository.save(profile);
        return ResponseEntity.ok(savedProfile);
    }

    @PutMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfile> updateProfile(@Valid @RequestBody UserProfile profileDetails, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            UserProfile existingProfile = profileOpt.get();
            existingProfile.setDateOfBirth(profileDetails.getDateOfBirth());
            existingProfile.setGender(profileDetails.getGender());
            existingProfile.setOccupation(profileDetails.getOccupation());
            existingProfile.setAnnualIncome(profileDetails.getAnnualIncome());
            existingProfile.setInvestmentExperience(profileDetails.getInvestmentExperience());
            existingProfile.setRiskTolerance(profileDetails.getRiskTolerance());
            existingProfile.setFinancialGoals(profileDetails.getFinancialGoals());
            existingProfile.setAddress(profileDetails.getAddress());
            existingProfile.setCity(profileDetails.getCity());
            existingProfile.setState(profileDetails.getState());
            existingProfile.setPostalCode(profileDetails.getPostalCode());
            existingProfile.setCountry(profileDetails.getCountry());
            existingProfile.setPanNumber(profileDetails.getPanNumber());
            existingProfile.setAadharNumber(profileDetails.getAadharNumber());
            existingProfile.setProfileImageUrl(profileDetails.getProfileImageUrl());
            existingProfile.setIsProfileComplete(true);
            
            UserProfile updatedProfile = userProfileRepository.save(existingProfile);
            return ResponseEntity.ok(updatedProfile);
        } else {
            // Create new profile if none exists
            profileDetails.setUser(user);
            profileDetails.setIsProfileComplete(true);
            UserProfile savedProfile = userProfileRepository.save(profileDetails);
            return ResponseEntity.ok(savedProfile);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userProfileRepository.findById(#id).orElse(null)?.user?.email == principal.name")
    public ResponseEntity<UserProfile> getProfileById(@PathVariable Long id) {
        return userProfileRepository.findById(id)
                .map(profile -> ResponseEntity.ok().body(profile))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Iterable<UserProfile>> getAllProfiles() {
        Iterable<UserProfile> profiles = userProfileRepository.findAll();
        return ResponseEntity.ok(profiles);
    }
}
