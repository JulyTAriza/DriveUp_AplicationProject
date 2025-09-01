package com.dh.DriveUp.service;

import java.util.List;
import java.util.Optional;

import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.exception.ResourceNotFoundException;

public interface ICarReservationService {

    CarReservationDTO save(CarReservationDTO carReservationDTO);
    Optional<CarReservationDTO> findById(Long id) throws ResourceNotFoundException;
    CarReservationDTO update(CarReservationDTO carReservationDTO) throws Exception;
    Optional<CarReservationDTO> delete(Long id) throws ResourceNotFoundException;
    List<CarReservationDTO> findAll();
    List<CarReservationDTO> findByUserId(Long userId) throws ResourceNotFoundException; 

    // ⭐ Nuevo: actualizar solo las estrellas
    CarReservationDTO updateStars(Long reservationId, Integer stars) throws ResourceNotFoundException;

    // ❤️ Nuevo: marcar / desmarcar como favorito
    CarReservationDTO updateFavorite(Long reservationId, Boolean favorite) throws ResourceNotFoundException;
}
