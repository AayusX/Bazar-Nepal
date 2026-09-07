package com.bazaarnepal.events;

import com.bazaarnepal.domain.Message;
import com.bazaarnepal.domain.Notification;
import com.bazaarnepal.domain.Product;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Component
public class RealtimePublisher {

    private final Sinks.Many<Message> messages = Sinks.many().replay().latest();
    private final Sinks.Many<Notification> notifications = Sinks.many().replay().latest();
    private final Sinks.Many<Product> products = Sinks.many().replay().latest();

    public Flux<Message> messageStream() {
        return messages.asFlux();
    }

    public Flux<Notification> notificationStream() {
        return notifications.asFlux();
    }

    public Flux<Product> productStream() {
        return products.asFlux();
    }

    public void publishMessage(Message message) {
        messages.tryEmitNext(message);
    }

    public void publishNotification(Notification notification) {
        notifications.tryEmitNext(notification);
    }

    public void publishProduct(Product product) {
        products.tryEmitNext(product);
    }
}
