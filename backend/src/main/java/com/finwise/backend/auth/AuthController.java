package com.finwise.backend.auth;

import com.finwise.backend.auth.dto.AuthResponse;
import com.finwise.backend.auth.dto.LoginRequest;
import com.finwise.backend.auth.dto.RegisterRequest;
import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.security.JwtService;
import com.finwise.backend.user.Role;
import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record UpdateMeRequest(@NotBlank String firstName, @NotBlank String lastName, String phone) {}

    public record ChangePasswordRequest(@NotBlank String currentPassword, @NotBlank @Size(min = 8) String newPassword) {}

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtService jwtService, CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(user, true));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return toResponse(user, true);
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        return toResponse(currentUserService.require(authentication), false);
    }

    @PutMapping("/me")
    public AuthResponse updateMe(@Valid @RequestBody UpdateMeRequest request, Authentication authentication) {
        User user = currentUserService.require(authentication);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(request.phone());
        return toResponse(userRepository.save(user), false);
    }

    @PutMapping("/me/password")
    public Map<String, String> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        User user = currentUserService.require(authentication);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return Map.of("message", "Password updated");
    }

    private AuthResponse toResponse(User user, boolean withToken) {
        return new AuthResponse(
                withToken ? jwtService.generateToken(user.getId(), user.getRole().name()) : null,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name()
        );
    }
}
