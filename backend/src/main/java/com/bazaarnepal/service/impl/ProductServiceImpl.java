package com.bazaarnepal.service.impl;

import com.bazaarnepal.domain.Category;
import com.bazaarnepal.domain.PriceEntry;
import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.dto.ProductInput;
import com.bazaarnepal.dto.ProductConnection;
import com.bazaarnepal.events.RealtimePublisher;
import com.bazaarnepal.repository.CategoryRepository;
import com.bazaarnepal.repository.ProductRepository;
import com.bazaarnepal.repository.UserRepository;
import com.bazaarnepal.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private static final int MAX_IMAGE_DATA_LENGTH = 9_000_000;
    private static final int MAX_TOTAL_IMAGE_LENGTH = 45_000_000;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RealtimePublisher publisher;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository,
                              RealtimePublisher publisher) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.publisher = publisher;
    }

    private void validateImages(List<String> images) {
        if (images == null) {
            return;
        }
        int total = 0;
        for (String image : images) {
            String payload = image;
            int comma = image.indexOf(",");
            if (comma >= 0 && image.substring(0, comma).contains("base64")) {
                payload = image.substring(comma + 1);
            }
            if (payload.length() > MAX_IMAGE_DATA_LENGTH) {
                throw new IllegalArgumentException("Each image must be 6MB or smaller");
            }
            total += payload.length();
        }
        if (total > MAX_TOTAL_IMAGE_LENGTH) {
            throw new IllegalArgumentException("Total image data is too large");
        }
    }

    @Override
    @Transactional
    public Product addProduct(ProductInput input, String sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        Category category = categoryRepository.findById(input.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Product product = new Product();
        product.setTitle(input.getTitle());
        product.setDescription(input.getDescription());
        product.setPrice(input.getPrice());
        product.setCurrency(input.getCurrency() != null ? input.getCurrency() : "NPR");
        product.setNegotiable(input.getNegotiable() != null && input.getNegotiable());
        product.setCondition(input.getCondition());
        product.setBrand(input.getBrand());
        product.setQuantity(input.getQuantity() != null ? input.getQuantity() : 1);
        product.setStockStatus(input.getStockStatus() != null ? input.getStockStatus() : "in_stock");
        product.setCategory(category);
        product.setSubcategory(input.getSubcategory());
        product.setLocation(input.getLocation());
        product.setDistrict(input.getDistrict());
        product.setProvince(input.getProvince());
        product.setCountry(input.getCountry());
        product.setLatitude(input.getLatitude());
        product.setLongitude(input.getLongitude());
        validateImages(input.getImages());
        product.setImages(input.getImages());
        product.setVideos(input.getVideos() != null ? input.getVideos() : List.of());
        product.setTags(input.getTags() != null ? input.getTags() : List.of());
        product.setSeller(seller);
        product.setEscrowEligible(input.isEscrowEligible() != null && input.isEscrowEligible());
        product.setDeliveryAvailable(input.isDeliveryAvailable() != null && input.isDeliveryAvailable());
        product.setPickupAvailable(input.isPickupAvailable() != null && input.isPickupAvailable());

        product = productRepository.save(product);
        forceInit(product);
        publisher.publishProduct(product);
        return product;
    }

    @Override
    @Transactional
    public Product updateProduct(String id, ProductInput input, String userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!product.getSeller().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized");
        }
        Category category = categoryRepository.findById(input.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        double oldPrice = product.getPrice();
        product.setTitle(input.getTitle());
        product.setDescription(input.getDescription());
        product.setPrice(input.getPrice());
        if (input.getPrice() != oldPrice) {
            product.getPriceHistory().add(new PriceEntry(product, input.getPrice()));
        }
        product.setCurrency(input.getCurrency() != null ? input.getCurrency() : "NPR");
        if (input.getNegotiable() != null) product.setNegotiable(input.getNegotiable());
        if (input.getCondition() != null) product.setCondition(input.getCondition());
        if (input.getBrand() != null) product.setBrand(input.getBrand());
        if (input.getQuantity() != null) product.setQuantity(input.getQuantity());
        if (input.getStockStatus() != null) product.setStockStatus(input.getStockStatus());
        product.setCategory(category);
        if (input.getSubcategory() != null) product.setSubcategory(input.getSubcategory());
        if (input.getLocation() != null) product.setLocation(input.getLocation());
        if (input.getDistrict() != null) product.setDistrict(input.getDistrict());
        if (input.getProvince() != null) product.setProvince(input.getProvince());
        if (input.getCountry() != null) product.setCountry(input.getCountry());
        if (input.getLatitude() != null) product.setLatitude(input.getLatitude());
        if (input.getLongitude() != null) product.setLongitude(input.getLongitude());
        if (input.getImages() != null) {
            validateImages(input.getImages());
            product.setImages(input.getImages());
        }
        if (input.getVideos() != null) product.setVideos(input.getVideos());
        if (input.getTags() != null) product.setTags(input.getTags());
        if (input.isEscrowEligible() != null) product.setEscrowEligible(input.isEscrowEligible());
        if (input.isDeliveryAvailable() != null) product.setDeliveryAvailable(input.isDeliveryAvailable());
        if (input.isPickupAvailable() != null) product.setPickupAvailable(input.isPickupAvailable());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public boolean deleteProduct(String id, String userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!product.getSeller().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized");
        }
        product.setActive(false);
        productRepository.save(product);
        return true;
    }

    @Override
    public ProductConnection findAll(String search, String categoryId, String sellerId,
                                     Double minPrice, Double maxPrice, String condition,
                                     String brand, String district, String province,
                                     Boolean negotiable, String sortBy, int page, int limit) {
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        Sort sort;
        if ("price_asc".equals(sortBy)) sort = Sort.by("price").ascending();
        else if ("price_desc".equals(sortBy)) sort = Sort.by("price").descending();
        else if ("oldest".equals(sortBy)) sort = Sort.by("postedAt").ascending();
        else sort = Sort.by("postedAt").descending();

        Pageable pageable = PageRequest.of(page - 1, limit, sort);

        Page<Product> result = productRepository.findFiltered(
                search, categoryId, sellerId, minPrice, maxPrice, condition,
                brand, district, province, negotiable, pageable);

        return new ProductConnection(result.getContent(), result.getTotalElements(),
                result.hasNext(), page);
    }

    @Override
    public List<Product> findBySellerId(String sellerId) {
        return productRepository.findBySellerIdOrderByPostedAtDesc(sellerId);
    }

    @Override
    public List<User> findActiveSellers() {
        return productRepository.findActiveSellers();
    }

    @Override
    public Optional<Product> findById(String id) {
        return productRepository.findById(id);
    }

    @Override
    @Transactional
    public void recordView(String productId) {
        productRepository.incrementViews(productId);
    }

    @Override
    public List<String> searchSuggestions(String query) {
        return productRepository.findDistinctTitlesBySearch(query);
    }

    private void forceInit(Product product) {
        product.getImages().size();
        product.getVideos().size();
        product.getTags().size();
        product.getPriceHistory().size();
        if (product.getCategory() != null) product.getCategory().getName();
        if (product.getSeller() != null) {
            product.getSeller().getName();
            product.getSeller().getAvatar();
        }
    }
}
