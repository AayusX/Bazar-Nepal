package com.bazaarnepal.graphql;

import com.bazaarnepal.domain.Notification;
import com.bazaarnepal.service.NotificationService;
import com.bazaarnepal.service.UserService;
import com.bazaarnepal.service.MessageService;
import com.bazaarnepal.graphql.types.UnreadCounts;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;

import java.util.List;

@Controller
public class NotificationResolver {

    private final NotificationService notificationService;
    private final UserService userService;
    private final MessageService messageService;

    public NotificationResolver(NotificationService notificationService, UserService userService,
                                MessageService messageService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.messageService = messageService;
    }

    @QueryMapping
    public List<Notification> notifications(Authentication auth) {
        var user = userService.getCurrentUser(auth);
        return notificationService.getNotifications(user.getId());
    }

    @QueryMapping
    public UnreadCounts unreadCounts(Authentication auth) {
        var user = userService.getCurrentUser(auth);
        return new UnreadCounts(
            messageService.getUnreadCount(user.getId()),
            notificationService.getUnreadCount(user.getId())
        );
    }

    @MutationMapping
    public int markNotificationsRead(Authentication auth) {
        var user = userService.getCurrentUser(auth);
        return notificationService.markAllAsRead(user.getId());
    }
}
