package com.bazaarnepal.service;

import com.bazaarnepal.domain.Product;
import java.util.List;

public interface SavedItemService {
    boolean toggleSavedItem(String userId, String productId);
    List<Product> getSavedProducts(String userId);
}
