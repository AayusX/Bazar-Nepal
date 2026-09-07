package com.bazaarnepal.config;

import com.bazaarnepal.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.server.support.AuthenticationExtractor;
import org.springframework.graphql.server.webmvc.AuthenticationWebSocketInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;

@Configuration
public class WebSocketAuthConfig {

    @Bean
    public AuthenticationWebSocketInterceptor webSocketAuthenticationInterceptor(JwtTokenProvider jwtTokenProvider) {
        AuthenticationExtractor extractor = (Map<String, Object> connectionParams) -> {
            if (connectionParams == null) {
                return Mono.empty();
            }
            Object header = connectionParams.get("Authorization");
            if (header == null) {
                return Mono.empty();
            }
            String token = header.toString();
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            if (token.isBlank() || !jwtTokenProvider.validateAccessToken(token)) {
                return Mono.empty();
            }
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            return Mono.just(new UsernamePasswordAuthenticationToken(userId, token, Collections.emptyList()));
        };
        return new AuthenticationWebSocketInterceptor(extractor, authentication -> authentication);
    }
}
