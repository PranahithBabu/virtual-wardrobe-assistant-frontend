package com.styleai.dto;

import java.util.List;

public class WeatherBasedOutfitRequest {
    private List<ClosetItemDTO> closetItems;
    private String occasion;
    private List<String> timesOfDay;
    private String userPreferences;
    private String city;
    private String country;

    // Constructors
    public WeatherBasedOutfitRequest() {}

    // Getters and Setters
    public List<ClosetItemDTO> getClosetItems() { return closetItems; }
    public void setClosetItems(List<ClosetItemDTO> closetItems) { this.closetItems = closetItems; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public List<String> getTimesOfDay() { return timesOfDay; }
    public void setTimesOfDay(List<String> timesOfDay) { this.timesOfDay = timesOfDay; }

    public String getUserPreferences() { return userPreferences; }
    public void setUserPreferences(String userPreferences) { this.userPreferences = userPreferences; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}