package com.styleai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key:mock-weather-key}")
    private String weatherApiKey;

    @Value("${weather.base.url:https://api.openweathermap.org/data/2.5}")
    private String weatherBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getCurrentWeather(String city, String country) {
        // For development, return mock weather data
        if ("mock-weather-key".equals(weatherApiKey)) {
            return getMockWeatherData(city);
        }

        try {
            String url = String.format("%s/weather?q=%s,%s&appid=%s&units=metric", 
                weatherBaseUrl, city, country, weatherApiKey);
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return parseWeatherResponse(response);
        } catch (Exception e) {
            // Fallback to mock data if API fails
            return getMockWeatherData(city);
        }
    }

    private Map<String, Object> getMockWeatherData(String city) {
        Map<String, Object> weather = new HashMap<>();
        weather.put("temperature", 22.0);
        weather.put("description", "Partly cloudy");
        weather.put("humidity", 65);
        weather.put("windSpeed", 5.2);
        weather.put("city", city);
        weather.put("condition", "clouds");
        return weather;
    }

    private Map<String, Object> parseWeatherResponse(Map<String, Object> response) {
        Map<String, Object> weather = new HashMap<>();
        
        if (response != null) {
            Map<String, Object> main = (Map<String, Object>) response.get("main");
            Map<String, Object> wind = (Map<String, Object>) response.get("wind");
            java.util.List<Map<String, Object>> weatherList = 
                (java.util.List<Map<String, Object>>) response.get("weather");
            
            if (main != null) {
                weather.put("temperature", main.get("temp"));
                weather.put("humidity", main.get("humidity"));
            }
            
            if (wind != null) {
                weather.put("windSpeed", wind.get("speed"));
            }
            
            if (weatherList != null && !weatherList.isEmpty()) {
                Map<String, Object> weatherInfo = weatherList.get(0);
                weather.put("description", weatherInfo.get("description"));
                weather.put("condition", weatherInfo.get("main"));
            }
            
            weather.put("city", response.get("name"));
        }
        
        return weather;
    }
}