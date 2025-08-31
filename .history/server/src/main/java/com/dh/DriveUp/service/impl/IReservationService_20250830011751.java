package com.dh.DriveUp.service;

import com.dh.DriveUp.dto.ReservationDTO;
import java.util.List;

public interface ReservationService {
    List<ReservationDTO> getAll();
    ReservationDTO getById(Long id);
    ReservationDTO create(ReservationDTO dto);
    ReservationDTO update(ReservationDTO dto);
    void delete(Long id);

    // Extras
    ReservationDTO updatePuntuation(Long id, Integer stars);
    ReservationDTO updateFavorite(Long id, Boolean favorite);
}
