package com.bazaarnepal.service;

import com.bazaarnepal.domain.Notification;
import com.bazaarnepal.domain.User;
import com.bazaarnepal.events.RealtimePublisher;
import com.bazaarnepal.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final RealtimePublisher publisher;

    public NotificationService(NotificationRepository notificationRepository, RealtimePublisher publisher) {
        this.notificationRepository = notificationRepository;
        this.publisher = publisher;
    }

    @Transactional
    public Notification create(User user, String type, String title, String body) {
        Notification notification = new Notification(user, type, title, body);
        notification = notificationRepository.save(notification);
        publisher.publishNotification(notification);
        return notification;
    }

    @Transactional
    public Notification create(User user, String type, String title, String body, String imageUrl, String actionUrl) {
        Notification notification = new Notification(user, type, title, body);
        notification.setImageUrl(imageUrl);
        notification.setActionUrl(actionUrl);
        notification = notificationRepository.save(notification);
        publisher.publishNotification(notification);
        return notification;
    }

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public int markAllAsRead(String userId) {
        return notificationRepository.markAllAsRead(userId);
    }
}
