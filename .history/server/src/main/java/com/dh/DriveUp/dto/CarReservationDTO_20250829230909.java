package com.dh.DriveUp.dto;

public class CarReservationDTO {
    private Long id;
    private Long car_id;
    private Long user_id;
    private String pickUp;
    private String rentalStart;
    private String rentalEnd;
    private String status; // ✅ Nuevo campo

    public CarReservationDTO() {
    }

    public CarReservationDTO(Long id, Long car_id, Long user_id, String pickUp, String rentalStart, String rentalEnd, String status) {
        this.id = id;
        this.car_id = car_id;
        this.user_id = user_id;
        this.pickUp = pickUp;
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
        this.status = status;
    }

    public CarReservationDTO(Long car_id, Long user_id, String pickUp, String rentalStart, String rentalEnd, String status) {
        this.car_id = car_id;
        this.user_id = user_id;
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

    public String getStatus() { // ✅ Getter de status
        return status;
    }

    public void setStatus(String status) { // ✅ Setter de status
        this.status = status;
    }
}
