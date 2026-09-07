package com.bazaarnepal.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String lastMessage;

    @Column(nullable = false)
    private LocalDateTime lastMessageAt;

    @Column(nullable = false)
    private int unreadBuyer;

    @Column(nullable = false)
    private int unreadSeller;

    @Column(nullable = false)
    private boolean buyerArchived;

    @Column(nullable = false)
    private boolean sellerArchived;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastMessageAt = LocalDateTime.now();
    }

    public Conversation() {}

    public Conversation(User buyer, User seller, Product product) {
        this.buyer = buyer;
        this.seller = seller;
        this.product = product;
        this.lastMessage = "";
        this.unreadBuyer = 0;
        this.unreadSeller = 0;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public int getUnreadBuyer() { return unreadBuyer; }
    public void setUnreadBuyer(int unreadBuyer) { this.unreadBuyer = unreadBuyer; }

    public int getUnreadSeller() { return unreadSeller; }
    public void setUnreadSeller(int unreadSeller) { this.unreadSeller = unreadSeller; }

    public boolean isBuyerArchived() { return buyerArchived; }
    public void setBuyerArchived(boolean buyerArchived) { this.buyerArchived = buyerArchived; }

    public boolean isSellerArchived() { return sellerArchived; }
    public void setSellerArchived(boolean sellerArchived) { this.sellerArchived = sellerArchived; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
