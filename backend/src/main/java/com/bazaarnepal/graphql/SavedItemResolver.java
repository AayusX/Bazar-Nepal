package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Product;
import com.bazaarnepal.service.SavedItemService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class SavedItemResolver {

    private final SavedItemService savedItemService;

    public SavedItemResolver(SavedItemService savedItemService) {
        this.savedItemService = savedItemService;
    }

    @QueryMapping
    public List<Product> savedItems(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return savedItemService.getSavedProducts(auth.getName());
    }

    @MutationMapping
    public Boolean toggleSavedItem(@Argument String productId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return savedItemService.toggleSavedItem(auth.getName(), productId);
    }
}
