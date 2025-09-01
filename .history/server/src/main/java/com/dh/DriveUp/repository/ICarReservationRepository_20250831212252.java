package com.dh.DriveUp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dh.DriveUp.entity.CarReservation;

@Repository
public interface ICarReservationRepository extends JpaRepository<CarReservation, Long> {
     List<CarReservation> findByUserId(Long userId); 

@Query("SELECT r FROM CarReservation r WHERE r.car.id = :carId AND r.status <> 'CANCELADA' " +
"AND (r.rentalStart <= :rentalEnd AND r.rentalEnd >= :rentalStart)")
List<CarReservation> findOverlappingReservations(@Param("carId") Long carId,
                                                  @Param("rentalStart") LocalDate rentalStart,
                                                  @Param("rentalEnd") LocalDate rentalEnd);

}

