package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.*;
import com.bazaarnepal.service.*;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;

import java.util.List;

@Controller
public class ChatResolver {

    private final ConversationService conversationService;
    private final MessageService messageService;
    private final ProductService productService;
    private final UserService userService;

    public ChatResolver(ConversationService conversationService, MessageService messageService,
                        ProductService productService, UserService userService) {
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.productService = productService;
        this.userService = userService;
    }

    @QueryMapping
    public List<Conversation> conversations(Authentication auth) {
        User current = userService.getCurrentUser(auth);
        return conversationService.getConversations(current.getId());
    }

    @QueryMapping
    public Conversation conversation(@Argument String id, Authentication auth) {
        User current = userService.getCurrentUser(auth);
        return conversationService.getParticipantConversation(id, current.getId());
    }

    @QueryMapping
    public List<Message> messages(@Argument String conversationId, Authentication auth) {
        User current = userService.getCurrentUser(auth);
        conversationService.getParticipantConversation(conversationId, current.getId());
        return messageService.getMessages(conversationId);
    }

    @MutationMapping
    public Conversation startConversation(@Argument String sellerId, @Argument String productId,
                                          @Argument String message, Authentication auth) {
        User buyer = userService.getCurrentUser(auth);
        if (sellerId != null && sellerId.equals(buyer.getId())) {
            throw new IllegalStateException("Cannot start a conversation with yourself");
        }
        User seller = userService.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
        Product product = productService.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!product.getSeller().getId().equals(sellerId)) {
            throw new IllegalStateException("Seller does not own this product");
        }
        Conversation conv = conversationService.getOrCreate(buyer, seller, product);
        if (message != null && !message.isBlank()) {
            messageService.send(conv, buyer, message);
        }
        return conv;
    }

    @MutationMapping
    public Message sendMessage(@Argument String conversationId, @Argument String content, Authentication auth) {
        User sender = userService.getCurrentUser(auth);
        Conversation conv = conversationService.getParticipantConversation(conversationId, sender.getId());
        return messageService.send(conv, sender, content);
    }

    @MutationMapping
    public int markMessagesRead(@Argument String conversationId, Authentication auth) {
        User current = userService.getCurrentUser(auth);
        conversationService.getParticipantConversation(conversationId, current.getId());
        return messageService.markAsRead(conversationId, current.getId());
    }
}
