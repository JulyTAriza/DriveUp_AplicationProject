package com.dh.DriveUp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dh.DriveUp.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser_Id(Long user_id);
    List<Reservation> findByProduct_Id(Long product_id);
}
