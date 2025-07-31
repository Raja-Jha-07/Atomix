package com.atomix.cafeteria.security;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.entity.UserRole;
import com.atomix.cafeteria.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Value("${app.oauth2.authorizedRedirectUri:http://localhost:3000/auth/oauth2/redirect}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                       Authentication authentication) throws IOException, ServletException {
        
        if (response.isCommitted()) {
            return;
        }

        String targetUrl = determineTargetUrl(request, response, authentication);
        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                       Authentication authentication) {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = extractEmail(oAuth2User);
            String firstName = extractFirstName(oAuth2User);
            String lastName = extractLastName(oAuth2User);
            String provider = extractProvider(oAuth2User);
            String providerId = extractProviderId(oAuth2User);

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> createNewUser(email, firstName, lastName, provider, providerId));

            // Update OAuth2 info if user exists but doesn't have OAuth2 data
            if (user.getProvider() == null) {
                user.setProvider(provider);
                user.setProviderId(providerId);
                userRepository.save(user);
            }

            // Generate JWT token
            String token = jwtUtils.generateTokenFromEmail(user.getEmail());
            String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

            return UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("token", token)
                    .queryParam("refreshToken", refreshToken)
                    .queryParam("error", "")
                    .build().toUriString();

        } catch (Exception e) {
            return UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("error", "authentication_failed")
                    .build().toUriString();
        }
    }

    private User createNewUser(String email, String firstName, String lastName, String provider, String providerId) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setRole(UserRole.EMPLOYEE); // Default role for OAuth2 users
        user.setIsActive(true);
        user.setEmailVerified(true); // OAuth2 users are pre-verified
        return userRepository.save(user);
    }

    private String extractEmail(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return (String) attributes.get("email");
    }

    private String extractFirstName(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String name = (String) attributes.get("name");
        if (name != null) {
            String[] nameParts = name.split(" ");
            return nameParts[0];
        }
        return (String) attributes.get("given_name");
    }

    private String extractLastName(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String name = (String) attributes.get("name");
        if (name != null) {
            String[] nameParts = name.split(" ");
            return nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
        }
        return (String) attributes.get("family_name");
    }

    private String extractProvider(OAuth2User oAuth2User) {
        // This will be set by the OAuth2 configuration based on the registration ID
        return "google"; // Default for now, can be made dynamic
    }

    private String extractProviderId(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return (String) attributes.get("sub"); // Google's unique user ID
    }
}
