package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Category;
import com.bazaarnepal.domain.PriceEntry;
import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.ProductConnection;
import com.bazaarnepal.dto.ProductInput;
import com.bazaarnepal.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ProductResolver {

    private final ProductService productService;

    public ProductResolver(ProductService productService) {
        this.productService = productService;
    }

    @QueryMapping
    public ProductConnection products(@Argument String search,
                                       @Argument String categoryId,
                                       @Argument String sellerId,
                                       @Argument Double minPrice,
                                       @Argument Double maxPrice,
                                       @Argument String condition,
                                       @Argument String brand,
                                       @Argument String district,
                                       @Argument String province,
                                       @Argument Boolean negotiable,
                                       @Argument String sortBy,
                                       @Argument Integer page,
                                       @Argument Integer limit) {
        int safePage = page != null ? page : 1;
        int safeLimit = limit != null ? limit : 20;
        return productService.findAll(search, categoryId, sellerId, minPrice, maxPrice,
                condition, brand, district, province, negotiable, sortBy, safePage, safeLimit);
    }

    @QueryMapping
    public Product product(@Argument String id) {
        return productService.findById(id)
                .filter(p -> p.isActive() && !p.isSold() && "approved".equals(p.getModerationStatus()))
                .orElse(null);
    }

    @QueryMapping
    public List<String> searchSuggestions(@Argument String query) {
        return productService.searchSuggestions(query);
    }

    @MutationMapping
    public boolean recordView(@Argument String productId, Authentication auth) {
        if (auth == null || auth instanceof AnonymousAuthenticationToken || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        productService.recordView(productId);
        return true;
    }

    @MutationMapping
    public Product addProduct(@Argument @Valid ProductInput input, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return productService.addProduct(input, auth.getName());
    }

    @MutationMapping
    public Product updateProduct(@Argument String id, @Argument @Valid ProductInput input, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return productService.updateProduct(id, input, auth.getName());
    }

    @MutationMapping
    public boolean deleteProduct(@Argument String id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return productService.deleteProduct(id, auth.getName());
    }

    @SchemaMapping(typeName = "Product", field = "category")
    public Category category(Product product) {
        return product.getCategory();
    }

    @SchemaMapping(typeName = "Product", field = "seller")
    public User seller(Product product) {
        return product.getSeller();
    }

    @SchemaMapping(typeName = "Product", field = "priceHistory")
    public List<PriceEntry> priceHistory(Product product) {
        return product.getPriceHistory();
    }
}
