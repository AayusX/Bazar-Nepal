package com.bazaarnepal.service;

import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.ProductInput;
import com.bazaarnepal.dto.ProductConnection;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product addProduct(ProductInput input, String sellerId);
    Product updateProduct(String id, ProductInput input, String userId);
    boolean deleteProduct(String id, String userId);
    ProductConnection findAll(String search, String categoryId, String sellerId,
                              Double minPrice, Double maxPrice, String condition,
                              String brand, String district, String province,
                              Boolean negotiable, String sortBy, int page, int limit);
    List<Product> findBySellerId(String sellerId);
    List<User> findActiveSellers();
    Optional<Product> findById(String id);
    void recordView(String productId);
    List<String> searchSuggestions(String query);
}
