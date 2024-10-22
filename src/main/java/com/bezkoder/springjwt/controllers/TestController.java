package com.bezkoder.springjwt.controllers;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.UserRepository;

import io.jsonwebtoken.Claims;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController

@RequestMapping("/api/test")
public class TestController {
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}

	@GetMapping("/user")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public String userAccess() {
		return "User Content.";
	}

	@GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User getCurrentUser(Authentication authentication) {
		System.out.println(authentication.toString());
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return user;
    }

	@GetMapping("/mod")
	@PreAuthorize("hasRole('MODERATOR')")
	public String moderatorAccess() {
		return "Moderator Board.";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin Board.";
	}

	private String extractTokenFromPrincipal(Authentication authentication) {
		// Hier gehen wir davon aus, dass der Token im Principal gespeichert ist
		if (authentication != null && authentication.getCredentials() != null) {
			return authentication.getCredentials().toString();
		}
		return null;
	}

	private Map<String, Object> decodeJWT(String jwt) {
		// Zerlegen des JWT in seine Teile
		String[] splitToken = jwt.split("\\.");
		String base64EncodedBody = splitToken[1];

		// Base64-dekodieren des JWT-Bodies
		byte[] decodedBytes = Base64.getDecoder().decode(base64EncodedBody);
		String body = new String(decodedBytes);

		// JSON-String in eine Map umwandeln
		Map<String, Object> claims = new HashMap<>();
		String[] pairs = body.replace("{", "").replace("}", "").split(",");
		for (String pair : pairs) {
			String[] keyValue = pair.split(":");
			String key = keyValue[0].replace("\"", "").trim();
			String value = keyValue[1].replace("\"", "").trim();
			claims.put(key, value);
		}

		return claims;
	}
}
