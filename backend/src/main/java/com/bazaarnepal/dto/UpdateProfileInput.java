package com.bazaarnepal.dto;

public class UpdateProfileInput {
    private String name;
    private String avatar;
    private String phone;
    private String whatsapp;
    private String phoneVisibility;
    private String whatsappVisibility;
    private String emailVisibility;
    private String district;
    private String province;
    private String country;
    private Double latitude;
    private Double longitude;
    private String contactPreference;
    private Boolean allowPhoneCalls;
    private Boolean allowWhatsApp;
    private Boolean allowChat;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
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
    public String getContactPreference() { return contactPreference; }
    public void setContactPreference(String contactPreference) { this.contactPreference = contactPreference; }
    public Boolean getAllowPhoneCalls() { return allowPhoneCalls; }
    public void setAllowPhoneCalls(Boolean allowPhoneCalls) { this.allowPhoneCalls = allowPhoneCalls; }
    public Boolean getAllowWhatsApp() { return allowWhatsApp; }
    public void setAllowWhatsApp(Boolean allowWhatsApp) { this.allowWhatsApp = allowWhatsApp; }
    public Boolean getAllowChat() { return allowChat; }
    public void setAllowChat(Boolean allowChat) { this.allowChat = allowChat; }
}
