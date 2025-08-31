package com.dh.AlquilerAutosMVC.repository;

import com.dh.AlquilerAutosMVC.entity.CarReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICarReservationRepository extends JpaRepository<CarReservation, Long> {
}
