package com.dh.DriveUp.service.impl;

import com.dh.DriveUp.dto.ReservationDTO;
import com.dh.DriveUp.entity.Reservation;
import com.dh.DriveUp.repository.ReservationRepository;
import com.dh.DriveUp.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    private ReservationDTO mapToDTO(Reservation r) {
        return new ReservationDTO(
                r.getId(),
                r.getUser_id(),
                r.getProduct_id(),
                r.getStart_date().toString(),
                r.getEnd_date().toString(),
                r.getPuntuation(),
                r.getFavorite()
        );
    }

    private Reservation mapToEntity(ReservationDTO dto) {
        Reservation r = new Reservation();
        r.setId(dto.getId());
        r.setUser_id(dto.getUser_id());
        r.setProduct_id(dto.getProduct_id());
        r.setStart_date(java.time.LocalDate.parse(dto.getStart_date()));
        r.setEnd_date(java.time.LocalDate.parse(dto.getEnd_date()));
        r.setPuntuation(dto.getPuntuation());
        r.setFavorite(dto.getFavorite());
        return r;
    }

    @Override
    public List<ReservationDTO> getAll() {
        return reservationRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public ReservationDTO getById(Long id) {
        return reservationRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public ReservationDTO create(ReservationDTO dto) {
        Reservation reservation = mapToEntity(dto);
        return mapToDTO(reservationRepository.save(reservation));
    }

    @Override
    public ReservationDTO update(ReservationDTO dto) {
        Reservation reservation = mapToEntity(dto);
        return mapToDTO(reservationRepository.save(reservation));
    }

    @Override
    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public ReservationDTO updatePuntuation(Long id, Integer stars) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        reservation.setPuntuation(stars);
        return mapToDTO(reservationRepository.save(reservation));
    }

    @Override
    public ReservationDTO updateFavorite(Long id, Boolean favorite) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        reservation.setFavorite(favorite);
        return mapToDTO(reservationRepository.save(reservation));
    }
}
