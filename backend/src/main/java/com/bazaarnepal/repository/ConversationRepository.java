package com.bazaarnepal.repository;

import com.bazaarnepal.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("SELECT c FROM Conversation c WHERE (c.buyer.id = :userId AND c.buyerArchived = false) OR (c.seller.id = :userId AND c.sellerArchived = false) ORDER BY c.lastMessageAt DESC")
    List<Conversation> findActiveByUserId(@Param("userId") String userId);

    Optional<Conversation> findByBuyerIdAndSellerIdAndProductId(String buyerId, String sellerId, String productId);

    long countByBuyerIdAndUnreadBuyerGreaterThan(String buyerId, int value);
    long countBySellerIdAndUnreadSellerGreaterThan(String sellerId, int value);
}
