package com.bazaarnepal.service.impl;

import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.SavedItem;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.repository.ProductRepository;
import com.bazaarnepal.repository.SavedItemRepository;
import com.bazaarnepal.repository.UserRepository;
import com.bazaarnepal.service.SavedItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedItemServiceImpl implements SavedItemService {

    private final SavedItemRepository savedItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public SavedItemServiceImpl(SavedItemRepository savedItemRepository,
                                 UserRepository userRepository,
                                 ProductRepository productRepository) {
        this.savedItemRepository = savedItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public boolean toggleSavedItem(String userId, String productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (savedItemRepository.existsByUserIdAndProductId(userId, productId)) {
            savedItemRepository.deleteByUserIdAndProductId(userId, productId);
            product.setFavoriteCount(Math.max(0, product.getFavoriteCount() - 1));
        } else {
            savedItemRepository.save(new SavedItem(user, product));
            product.setFavoriteCount(product.getFavoriteCount() + 1);
        }
        productRepository.save(product);
        return true;
    }

    @Override
    public List<Product> getSavedProducts(String userId) {
        return savedItemRepository.findByUserId(userId)
                .stream()
                .map(SavedItem::getProduct)
                .toList();
    }
}
