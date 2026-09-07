package com.bazaarnepal.repository;

import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByCategoryId(String categoryId);

    List<Product> findBySellerIdOrderByPostedAtDesc(String sellerId);

    @Query("SELECT DISTINCT p.seller FROM Product p WHERE p.isActive = true")
    List<User> findActiveSellers();

    @Modifying
    @Query("UPDATE Product p SET p.views = p.views + 1 WHERE p.id = :id")
    void incrementViews(@Param("id") String id);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isSold = false AND p.moderationStatus = 'approved' AND " +
           "(cast(:search as string) IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) " +
           "AND (cast(:categoryId as string) IS NULL OR p.category.id = :categoryId) " +
           "AND (cast(:sellerId as string) IS NULL OR p.seller.id = :sellerId) " +
           "AND (cast(:minPrice as double) IS NULL OR p.price >= :minPrice) " +
           "AND (cast(:maxPrice as double) IS NULL OR p.price <= :maxPrice) " +
           "AND (cast(:condition as string) IS NULL OR p.condition = :condition) " +
           "AND (cast(:brand as string) IS NULL OR LOWER(p.brand) = LOWER(cast(:brand as string))) " +
           "AND (cast(:district as string) IS NULL OR LOWER(p.district) = LOWER(cast(:district as string))) " +
           "AND (cast(:province as string) IS NULL OR LOWER(p.province) = LOWER(cast(:province as string))) " +
           "AND (cast(:negotiable as boolean) IS NULL OR p.negotiable = :negotiable)")
    Page<Product> findFiltered(@Param("search") String search,
                                @Param("categoryId") String categoryId,
                                @Param("sellerId") String sellerId,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                @Param("condition") String condition,
                                @Param("brand") String brand,
                                @Param("district") String district,
                                @Param("province") String province,
                                @Param("negotiable") Boolean negotiable,
                                Pageable pageable);

    @Query("SELECT DISTINCT p.title FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', cast(:query as string), '%')) AND p.isActive = true ORDER BY p.views DESC")
    List<String> findDistinctTitlesBySearch(@Param("query") String query);
}
