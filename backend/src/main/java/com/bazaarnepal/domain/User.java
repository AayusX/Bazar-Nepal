package com.bazaarnepal.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String avatar;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String whatsapp;

    @Column(nullable = false, length = 20)
    private String phoneVisibility;

    @Column(nullable = false, length = 20)
    private String whatsappVisibility;

    @Column(nullable = false, length = 20)
    private String emailVisibility;

    @Column(nullable = false, length = 20)
    private String onlineStatus;

    @Column(nullable = false, length = 20)
    private String accountStatus;

    @Column(nullable = false)
    private boolean isVerified;

    @Column(nullable = false)
    private int reputation;

    @Column(nullable = false)
    private int itemsSold;

    @Column(nullable = false)
    private int trustScore;

    @Column(nullable = false)
    private double rating;

    @Column(nullable = false)
    private int ratingCount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinDate;

    private LocalDateTime lastSeen;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String province;

    @Column(length = 100)
    private String country;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private boolean allowPhoneCalls;

    @Column(nullable = false)
    private boolean allowWhatsApp;

    @Column(nullable = false)
    private boolean allowChat;

    @Column(nullable = false, length = 20)
    private String contactPreference;

    @PrePersist
    protected void onCreate() {
        joinDate = LocalDateTime.now();
        if (phoneVisibility == null) phoneVisibility = "private";
        if (whatsappVisibility == null) whatsappVisibility = "private";
        if (emailVisibility == null) emailVisibility = "private";
        if (onlineStatus == null) onlineStatus = "offline";
        if (accountStatus == null) accountStatus = "active";
        if (contactPreference == null) contactPreference = "chat";
        allowPhoneCalls = false;
        allowWhatsApp = false;
        allowChat = true;
        rating = 0;
        ratingCount = 0;
    }

    public User() {}

    public User(String name, String email, String password, String avatar) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getPhoneVisibility() { return phoneVisibility; }
    public void setPhoneVisibility(String phoneVisibility) { this.phoneVisibility = phoneVisibility; }
    public String getWhatsappVisibility() { return whatsappVisibility; }
    public void setWhatsappVisibility(String whatsappVisibility) { this.whatsappVisibility = whatsappVisibility; }
    public String getEmailVisibility() { return emailVisibility; }
    public void setEmailVisibility(String emailVisibility) { this.emailVisibility = emailVisibility; }
    public String getOnlineStatus() { return onlineStatus; }
    public void setOnlineStatus(String onlineStatus) { this.onlineStatus = onlineStatus; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public int getReputation() { return reputation; }
    public void setReputation(int reputation) { this.reputation = reputation; }
    public int getItemsSold() { return itemsSold; }
    public void setItemsSold(int itemsSold) { this.itemsSold = itemsSold; }
    public int getTrustScore() { return trustScore; }
    public void setTrustScore(int trustScore) { this.trustScore = trustScore; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }
    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
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
    public boolean isAllowPhoneCalls() { return allowPhoneCalls; }
    public void setAllowPhoneCalls(boolean allowPhoneCalls) { this.allowPhoneCalls = allowPhoneCalls; }
    public boolean isAllowWhatsApp() { return allowWhatsApp; }
    public void setAllowWhatsApp(boolean allowWhatsApp) { this.allowWhatsApp = allowWhatsApp; }
    public boolean isAllowChat() { return allowChat; }
    public void setAllowChat(boolean allowChat) { this.allowChat = allowChat; }
    public String getContactPreference() { return contactPreference; }
    public void setContactPreference(String contactPreference) { this.contactPreference = contactPreference; }
}
