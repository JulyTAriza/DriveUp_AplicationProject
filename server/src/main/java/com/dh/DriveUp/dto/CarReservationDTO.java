package com.dh.DriveUp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

public class CarReservationDTO {
    private Long id;
    private Long car_id;
    private Long user_id;
    private String pickUp;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private String rentalStart;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private String rentalEnd;
    private String status; // ✅ Estado de la reserva

    // 🔹 Nuevos campos
    private Integer stars;   // ⭐ Puntuación (1-5)
    private Boolean favorite; // ❤️ Favorito (true/false)

    public CarReservationDTO() {
    }

    public CarReservationDTO(Long id, Long car_id, Long user_id, String pickUp, String rentalStart, String rentalEnd, String status, Integer stars, Boolean favorite) {
        this.id = id;
        this.car_id = car_id;
        this.user_id = user_id;
        this.pickUp = pickUp;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
        this.stars = stars;
        this.favorite = favorite;
    }

    public CarReservationDTO(Long car_id, Long user_id, String pickUp, String rentalStart, String rentalEnd, String status, Integer stars, Boolean favorite) {
        this.car_id = car_id;
        this.user_id = user_id;
        this.pickUp = pickUp;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
        this.stars = stars;
        this.favorite = favorite;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCar_id() {
        return car_id;
    }

    public void setCar_id(Long car_id) {
        this.car_id = car_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getPickUp() {
        return pickUp;
    }

    public void setPickUp(String pickUp) {
        this.pickUp = pickUp;
    }

    public String getRentalStart() {
        return rentalStart;
    }

    public void setRentalStart(String rentalStart) {
        this.rentalStart = rentalStart;
    }

    public String getRentalEnd() {
        return rentalEnd;
    }

    public void setRentalEnd(String rentalEnd) {
        this.rentalEnd = rentalEnd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ⭐ Getter/Setter Stars
    public Integer getStars() {
        return stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    // ❤️ Getter/Setter Favorite
    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }
}

