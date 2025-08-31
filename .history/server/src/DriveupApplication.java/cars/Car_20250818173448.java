package com.driveup.cars;

import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private int year;
    private double price;
    private String image;

    public Car() {}
    public Car(String brand, String model, int year, double price, String image) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.price = price;
        this.image = image;
    }

    // getters y setters
}
