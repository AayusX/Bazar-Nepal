package com.bazaarnepal.service;

import com.bazaarnepal.domain.Conversation;
import com.bazaarnepal.domain.Message;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.events.RealtimePublisher;
import com.bazaarnepal.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationService conversationService;
    private final RealtimePublisher publisher;

    public MessageService(MessageRepository messageRepository, ConversationService conversationService,
                          RealtimePublisher publisher) {
        this.messageRepository = messageRepository;
        this.conversationService = conversationService;
        this.publisher = publisher;
    }

    @Transactional
    public Message send(Conversation conversation, User sender, String content) {
        Message message = new Message(conversation, sender, content);
        message = messageRepository.save(message);
        conversationService.updateLastMessage(conversation, content, sender.getId());
        forceInit(message);
        publisher.publishMessage(message);
        return message;
    }

    public long getUnreadCount(String userId) {
        return messageRepository.countUnreadForUser(userId);
    }

    private void forceInit(Message message) {
        if (message.getSender() != null) {
            message.getSender().getName();
            message.getSender().getAvatar();
        }
        Conversation conv = message.getConversation();
        if (conv != null) {
            if (conv.getBuyer() != null) conv.getBuyer().getId();
            if (conv.getSeller() != null) conv.getSeller().getId();
        }
    }

    public List<Message> getMessages(String conversationId) {
        return messageRepository.findByConversation_IdOrderBySentAtAsc(conversationId);
    }

    @Transactional
    public int markAsRead(String conversationId, String userId) {
        conversationService.markRead(conversationId, userId);
        return messageRepository.markAsRead(conversationId, userId);
    }
}
