package com.dh.AlquilerAutosMVC.service;

import com.dh.AlquilerAutosMVC.dto.CarReservationDTO;
import com.dh.AlquilerAutosMVC.entity.CarReservation;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ICarReservationService {


    CarReservationDTO save(CarReservationDTO carReservationDTO);
    Optional<CarReservationDTO> findById(Long id) throws ResourceNotFoundException;
    CarReservationDTO update(CarReservationDTO carReservationDTO) throws Exception;
    Optional<CarReservationDTO> delete(Long id) throws ResourceNotFoundException;
    List<CarReservationDTO> findAll();
}
