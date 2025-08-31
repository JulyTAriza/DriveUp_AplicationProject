package com.dh.DriveUp.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;
    private Long product_id;

    private LocalDate start_date;
    private LocalDate end_date;

    private Integer puntuation; // ⭐
    private Boolean favorite;   // ❤️

    public Reservation() {
    }

    public Reservation(Long id, Long user_id, Long product_id, LocalDate start_date, LocalDate end_date, Integer puntuation, Boolean favorite) {
        this.id = id;
        this.user_id = user_id;
        this.product_id = product_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.puntuation = puntuation;
        this.favorite = favorite;
    }

    public Reservation(Long user_id, Long product_id, LocalDate start_date, LocalDate end_date, Integer puntuation, Boolean favorite) {
        this.user_id = user_id;
        this.product_id = product_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.puntuation = puntuation;
        this.favorite = favorite;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Long product_id) {
        this.product_id = product_id;
    }

    public LocalDate getStart_date() {
        return start_date;
    }

    public void setStart_date(LocalDate start_date) {
        this.start_date = start_date;
    }

    public LocalDate getEnd_date() {
        return end_date;
    }

    public void setEnd_date(LocalDate end_date) {
        this.end_date = end_date;
    }

    public Integer getPuntuation() {
        return puntuation;
    }

    public void setPuntuation(Integer puntuation) {
        this.puntuation = puntuation;
    }

    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }
}
