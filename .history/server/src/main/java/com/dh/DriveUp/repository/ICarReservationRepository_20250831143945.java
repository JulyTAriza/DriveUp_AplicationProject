package com.dh.DriveUp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dh.DriveUp.entity.CarReservation;
import java.util.List;

@Repository
public interface ICarReservationRepository extends JpaRepository<CarReservation, Long> {
     List<CarReservation> findByUserId(Long userId); 
}

