package com.dh.DriveUp.repository;

import com.dh.DriveUp.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long user_id);
    List<Reservation> findByProductId(Long product_id);
}
