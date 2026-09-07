package com.bazaarnepal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ProductInput {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @Positive
    private double price;

    private String currency = "NPR";

    private Boolean negotiable;

    private String condition;

    private String brand;

    private Integer quantity;

    private String stockStatus;

    @NotBlank
    private String categoryId;

    private String subcategory;

    @NotBlank
    private String location;

    private String district;
    private String province;
    private String country;
    private Double latitude;
    private Double longitude;

    @Size(max = 8, message = "A product can have at most 8 images")
    private List<String> images;

    @Size(max = 8, message = "A product can have at most 8 videos")
    private List<String> videos;

    @Size(max = 20, message = "A product can have at most 20 tags")
    private List<String> tags;

    private Boolean isEscrowEligible;

    private Boolean isDeliveryAvailable;

    private Boolean isPickupAvailable;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Boolean getNegotiable() { return negotiable; }
    public void setNegotiable(Boolean negotiable) { this.negotiable = negotiable; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
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
    public Boolean isEscrowEligible() { return isEscrowEligible; }
    public void setEscrowEligible(Boolean escrowEligible) { isEscrowEligible = escrowEligible; }
    public Boolean isDeliveryAvailable() { return isDeliveryAvailable; }
    public void setDeliveryAvailable(Boolean deliveryAvailable) { isDeliveryAvailable = deliveryAvailable; }
    public Boolean isPickupAvailable() { return isPickupAvailable; }
    public void setPickupAvailable(Boolean pickupAvailable) { isPickupAvailable = pickupAvailable; }
}
