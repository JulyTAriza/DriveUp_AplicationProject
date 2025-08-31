package com.dh.DriveUp.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;



@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @ElementCollection
    private List<String> imagePaths = new ArrayList<>();
    @Column(name = "card_brand")
    private String carBrand;
    @Column(name = "price_per_hour")
    private Integer pricePerHour;

    @Column(name = "characteristics")
    private List<String> characteristics;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference("category-cars")
    private Category category;

    @OneToMany(mappedBy = "car")
    private List<CarReservation> carReservations = new ArrayList<>();


    public Car() {
    }

    public Car(Long id, String name, String description, List<String> imagePaths, String carBrand, Integer pricePerHour, List<String> characteristics, Category category, List<CarReservation> carReservations) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imagePaths = imagePaths;
        this.carBrand = carBrand;
        this.pricePerHour = pricePerHour;
        this.characteristics = characteristics;
        this.category = category;
        this.carReservations = carReservations;
    }

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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<CarReservation> getCarReservations() {
        return carReservations;
    }

    public void setCarReservations(List<CarReservation> carReservations) {
        this.carReservations = carReservations;
    }
}
