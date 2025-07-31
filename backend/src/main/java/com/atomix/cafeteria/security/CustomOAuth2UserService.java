package com.atomix.cafeteria.security;

import com.atomix.cafeteria.entity.User;
import com.atomix.cafeteria.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        return processOAuth2User(userRequest, oauth2User);
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();
        
        String email = (String) attributes.get("email");
        String providerId = (String) attributes.get("sub"); // Google's unique user ID
        
        // Find existing user by email or provider info
        User user = userRepository.findByEmail(email)
                .orElse(userRepository.findByProviderAndProviderId(registrationId, providerId)
                        .orElse(null));

        if (user == null) {
            // Create new user - this will be handled in the success handler
            // For now, just return the OAuth2User with the attributes
            return new UserPrincipal(oauth2User.getAttributes());
        }

        // Update user with OAuth2 info if not already set
        if (user.getProvider() == null) {
            user.setProvider(registrationId);
            user.setProviderId(providerId);
            userRepository.save(user);
        }

        // Return UserPrincipal with combined user data and OAuth2 attributes
        return UserPrincipal.create(user, oauth2User.getAttributes());
    }
}
