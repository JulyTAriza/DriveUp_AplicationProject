package com.dh.AlquilerAutosMVC.dto;

import java.time.LocalDate;

public class DateRangeDTO {

    private LocalDate rentalStart;
    private LocalDate rentalEnd;

    public DateRangeDTO() {
    }

    public DateRangeDTO(LocalDate rentalStart, LocalDate rentalEnd) {
        this.rentalStart = rentalStart;
        this.rentalEnd = rentalEnd;
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
}
