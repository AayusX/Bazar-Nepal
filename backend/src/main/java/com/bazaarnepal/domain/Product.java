package com.bazaarnepal.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String currency = "NPR";

    @Column(nullable = false)
    private boolean negotiable;

    @Column(length = 100)
    private String condition;

    @Column(length = 100)
    private String brand;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String stockStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 100)
    private String subcategory;

    @Column(nullable = false)
    private String location;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String province;

    @Column(length = 100)
    private String country;

    private Double latitude;
    private Double longitude;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", nullable = false)
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_videos", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "video_url")
    private List<String> videos = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag", nullable = false)
    private List<String> tags = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false, updatable = false)
    private LocalDateTime postedAt;

    @Column(nullable = false)
    private int views;

    @Column(nullable = false)
    private int favoriteCount;

    @Column(nullable = false)
    private int chatCount;

    @Column(nullable = false)
    private boolean isEscrowEligible;

    @Column(nullable = false)
    private boolean isBoosted;

    @Column(nullable = false)
    private boolean isDeliveryAvailable;

    @Column(nullable = false)
    private boolean isPickupAvailable;

    @Column(nullable = false)
    private boolean isActive;

    @Column(nullable = false)
    private boolean isSold;

    @Column(length = 20)
    private String moderationStatus;

    @Column(columnDefinition = "TEXT")
    private String moderationNotes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("date ASC")
    private List<PriceEntry> priceHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
        views = 0;
        favoriteCount = 0;
        chatCount = 0;
        quantity = 1;
        stockStatus = "in_stock";
        isActive = true;
        isSold = false;
        moderationStatus = "approved";
        if (priceHistory.isEmpty()) {
            priceHistory.add(new PriceEntry(this, price));
        }
    }

    public Product() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public boolean isNegotiable() { return negotiable; }
    public void setNegotiable(boolean negotiable) { this.negotiable = negotiable; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = videos; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public LocalDateTime getPostedAt() { return postedAt; }
    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }
    public int getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(int favoriteCount) { this.favoriteCount = favoriteCount; }
    public int getChatCount() { return chatCount; }
    public void setChatCount(int chatCount) { this.chatCount = chatCount; }
    public boolean isEscrowEligible() { return isEscrowEligible; }
    public void setEscrowEligible(boolean escrowEligible) { isEscrowEligible = escrowEligible; }
    public boolean isBoosted() { return isBoosted; }
    public void setBoosted(boolean boosted) { isBoosted = boosted; }
    public boolean isDeliveryAvailable() { return isDeliveryAvailable; }
    public void setDeliveryAvailable(boolean deliveryAvailable) { isDeliveryAvailable = deliveryAvailable; }
    public boolean isPickupAvailable() { return isPickupAvailable; }
    public void setPickupAvailable(boolean pickupAvailable) { isPickupAvailable = pickupAvailable; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public boolean isSold() { return isSold; }
    public void setSold(boolean sold) { isSold = sold; }
    public String getModerationStatus() { return moderationStatus; }
    public void setModerationStatus(String moderationStatus) { this.moderationStatus = moderationStatus; }
    public String getModerationNotes() { return moderationNotes; }
    public void setModerationNotes(String moderationNotes) { this.moderationNotes = moderationNotes; }
    public List<PriceEntry> getPriceHistory() { return priceHistory; }
    public void setPriceHistory(List<PriceEntry> priceHistory) { this.priceHistory = priceHistory; }
}
