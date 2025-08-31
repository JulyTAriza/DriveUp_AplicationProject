package com.dh.DriveUp.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "carReservations")
public class CarReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_reservation_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pick_up")
    private String pickUp;

    @Column(name = "return_start_date")
    private LocalDate rentalStart;

    @Column(name = "return_end_date")
    private LocalDate rentalEnd;

    @Column(name = "status") // ✅ Nuevo campo en BD
    private String status;

    public CarReservation() {
    }

    public CarReservation(Long id, Car car, User user, String pickUp, LocalDate rentalStart, LocalDate rentalEnd, String status) {
        this.id = id;
        this.car = car;
        this.user = user;
        this.pickUp = pickUp;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
    }

    public CarReservation(Car car, User user, String pickUp, LocalDate rentalStart, LocalDate rentalEnd, String status) {
        this.car = car;
        this.user = user;
        this.pickUp = pickUp;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPickUp() {
        return pickUp;
    }

    public void setPickUp(String pickUp) {
        this.pickUp = pickUp;
    }

    public LocalDate getRentalStart() {
        return rentalStart;
    }

    public void setRentalStart(LocalDate rentalStart) {
        this.rentalStart = rentalStart;
    }

    public LocalDate getRentalEnd() {
        return rentalEnd;
    }

    public void setRentalEnd(LocalDate rentalEnd) {
        this.rentalEnd = rentalEnd;
    }

    public String getStatus() { // ✅ Getter
        return status;
    }

    public void setStatus(String status) { // ✅ Setter
        this.status = status;
    }
}
