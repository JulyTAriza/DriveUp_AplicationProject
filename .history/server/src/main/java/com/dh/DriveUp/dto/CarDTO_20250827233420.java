package com.dh.DriveUp.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CarDTO {

    private Long id;
    private String name;
    private String description;
    private List<String> imagePaths;
    private String carBrand;
    private Integer pricePerHour;
    private List<String> characteristics;

    // Aquí está el cambio clave: se espera un objeto CategoryDTO
    @JsonProperty("category")
    private CategoryDTO category;

    private List<DateRangeDTO> reservedDates = new ArrayList<>();

    public CarDTO() {
    }

    public CarDTO(Long id, String name, String description, List<String> imagePaths, String carBrand, Integer pricePerHour, List<String> characteristics, CategoryDTO category, List<DateRangeDTO> reservedDates) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imagePaths = imagePaths;
        this.carBrand = carBrand;
        this.pricePerHour = pricePerHour;
        this.characteristics = characteristics;
        this.category = category;
        this.reservedDates = reservedDates;
    }

    public CarDTO(String name, String description, List<String> imagePaths, String carBrand, Integer pricePerHour, List<String> characteristics, CategoryDTO category, List<DateRangeDTO> reservedDates) {
        this.name = name;
        this.description = description;
        this.imagePaths = imagePaths;
        this.carBrand = carBrand;
        this.pricePerHour = pricePerHour;
        this.characteristics = characteristics;
        this.category = category;
        this.reservedDates = reservedDates;
    }

    // Getters y Setters para todas las propiedades
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public String getCarBrand() {
        return carBrand;
    }

    public void setCarBrand(String carBrand) {
        this.carBrand = carBrand;
    }

    public Integer getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Integer pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public List<String> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(List<String> characteristics) {
        this.characteristics = characteristics;
    }
    
    // Nuevo getter y setter para la categoría
    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    public List<DateRangeDTO> getReservedDates() {
        return reservedDates;
    }

    public void setReservedDates(List<DateRangeDTO> reservedDates) {
        this.reservedDates = reservedDates;
    }
}
