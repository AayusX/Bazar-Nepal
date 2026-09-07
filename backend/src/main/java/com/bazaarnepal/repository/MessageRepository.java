package com.bazaarnepal.repository;

import com.bazaarnepal.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {

    List<Message> findByConversation_IdOrderBySentAtAsc(String conversationId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    int markAsRead(@Param("conversationId") String conversationId, @Param("userId") String userId);

    long countByConversation_IdAndIsReadFalseAndSender_IdNot(String conversationId, String senderId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.isRead = false AND m.sender.id <> :userId " +
           "AND (m.conversation.buyer.id = :userId OR m.conversation.seller.id = :userId)")
    long countUnreadForUser(@Param("userId") String userId);
}
