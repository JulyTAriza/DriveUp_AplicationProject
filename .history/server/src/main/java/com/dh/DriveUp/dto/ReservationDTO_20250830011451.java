package com.dh.DriveUp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReservationDTO {
    private Long id;
    private Long user_id;
    private Long product_id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private String start_date;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private String end_date;

    private Integer puntuation; // ⭐ Calificación
    private Boolean favorite;   // ❤️ Favorito

    public ReservationDTO() {
    }

    public ReservationDTO(Long id, Long user_id, Long product_id, String start_date, String end_date, Integer puntuation, Boolean favorite) {
        this.id = id;
        this.user_id = user_id;
        this.product_id = product_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.puntuation = puntuation;
        this.favorite = favorite;
    }

    public ReservationDTO(Long user_id, Long product_id, String start_date, String end_date, Integer puntuation, Boolean favorite) {
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

    public String getStart_date() {
        return start_date;
    }

    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }

    public String getEnd_date() {
        return end_date;
    }

    public void setEnd_date(String end_date) {
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
