package com.bazaarnepal.service;

import com.bazaarnepal.domain.Conversation;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.domain.Product;
import com.bazaarnepal.repository.ConversationRepository;
import com.bazaarnepal.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ProductRepository productRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               ProductRepository productRepository) {
        this.conversationRepository = conversationRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Conversation getOrCreate(User buyer, User seller, Product product) {
        Optional<Conversation> existing = conversationRepository
                .findByBuyerIdAndSellerIdAndProductId(buyer.getId(), seller.getId(), product.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        Conversation conversation = conversationRepository.save(new Conversation(buyer, seller, product));
        product.setChatCount(product.getChatCount() + 1);
        productRepository.save(product);
        return conversation;
    }

    public List<Conversation> getConversations(String userId) {
        return conversationRepository.findActiveByUserId(userId);
    }

    public Optional<Conversation> findById(String id) {
        return conversationRepository.findById(id);
    }

    public Conversation getParticipantConversation(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        if (!conv.getBuyer().getId().equals(userId) && !conv.getSeller().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized");
        }
        return conv;
    }

    @Transactional
    public void updateLastMessage(Conversation conversation, String message, String senderId) {
        conversation.setLastMessage(message);
        conversation.setLastMessageAt(java.time.LocalDateTime.now());
        if (conversation.getBuyer().getId().equals(senderId)) {
            conversation.setUnreadSeller(conversation.getUnreadSeller() + 1);
        } else {
            conversation.setUnreadBuyer(conversation.getUnreadBuyer() + 1);
        }
        conversationRepository.save(conversation);
    }

    @Transactional
    public void markRead(String conversationId, String userId) {
        Conversation conv = conversationRepository.findById(conversationId).orElse(null);
        if (conv == null) return;
        if (conv.getBuyer().getId().equals(userId)) {
            conv.setUnreadBuyer(0);
        } else {
            conv.setUnreadSeller(0);
        }
        conversationRepository.save(conv);
    }

    public long getUnreadCount(String userId) {
        return conversationRepository.countByBuyerIdAndUnreadBuyerGreaterThan(userId, 0)
             + conversationRepository.countBySellerIdAndUnreadSellerGreaterThan(userId, 0);
    }
}
