package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Message;
import com.bazaarnepal.domain.Notification;
import com.bazaarnepal.domain.Product;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.events.RealtimePublisher;
import com.bazaarnepal.service.ConversationService;
import com.bazaarnepal.service.UserService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

@Controller
public class SubscriptionResolver {

    private final RealtimePublisher publisher;
    private final UserService userService;
    private final ConversationService conversationService;

    public SubscriptionResolver(RealtimePublisher publisher,
                                UserService userService,
                                ConversationService conversationService) {
        this.publisher = publisher;
        this.userService = userService;
        this.conversationService = conversationService;
    }

    @SubscriptionMapping
    public Flux<Message> messageReceived(@Argument String conversationId, Authentication auth) {
        User current = userService.getCurrentUser(auth);
        conversationService.getParticipantConversation(conversationId, current.getId());
        return publisher.messageStream()
                .filter(m -> isParticipant(m, current.getId()))
                .filter(m -> conversationId == null || conversationId.equals(m.getConversation().getId()));
    }

    private boolean isParticipant(Message message, String userId) {
        if (message.getConversation() == null) return false;
        return userId.equals(message.getConversation().getBuyer().getId())
                || userId.equals(message.getConversation().getSeller().getId());
    }

    @SubscriptionMapping
    public Flux<Notification> notificationReceived(Authentication auth) {
        User current = userService.getCurrentUser(auth);
        String userId = current.getId();
        return publisher.notificationStream()
                .filter(n -> n != null && n.getUser() != null && userId.equals(n.getUser().getId()));
    }

    @SubscriptionMapping
    public Flux<Product> productAdded() {
        return publisher.productStream();
    }
}
