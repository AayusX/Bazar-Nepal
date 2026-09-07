package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.UpdateProfileInput;
import com.bazaarnepal.service.ProductService;
import com.bazaarnepal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class UserResolver {

    private final UserService userService;
    private final ProductService productService;

    public UserResolver(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

    @QueryMapping
    public User me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userService.findById(auth.getName()).orElse(null);
    }

    @QueryMapping
    public List<User> sellers() {
        return productService.findActiveSellers();
    }

    @MutationMapping
    public User updateProfile(@Argument @Valid UpdateProfileInput input, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return userService.updateProfile(auth.getName(), input);
    }
}
