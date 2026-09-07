package com.bazaarnepal.graphql.types;

public class UnreadCounts {
    private final long messages;
    private final long notifications;

    public UnreadCounts(long messages, long notifications) {
        this.messages = messages;
        this.notifications = notifications;
    }

    public long getMessages() { return messages; }
    public long getNotifications() { return notifications; }
}
