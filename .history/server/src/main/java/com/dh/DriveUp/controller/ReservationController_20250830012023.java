package com.dh.DriveUp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dh.DriveUp.dto.ReservationDTO;
import com.dh.DriveUp.service.ReservationService;

@RestController
@RequestMapping("/reservas")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<ReservationDTO> getAll() {
        return reservationService.getAll();
    }

    @GetMapping("/{id}")
    public ReservationDTO getById(@PathVariable Long id) {
        return reservationService.getById(id);
    }

    @PostMapping
    public ReservationDTO create(@RequestBody ReservationDTO dto) {
        return reservationService.create(dto);
    }

    @PutMapping
    public ReservationDTO update(@RequestBody ReservationDTO dto) {
        return reservationService.update(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reservationService.delete(id);
    }

    @PatchMapping("/{id}/puntuation")
    public ReservationDTO updatePuntuation(@PathVariable Long id, @RequestParam Integer stars) {
        return reservationService.updatePuntuation(id, stars);
    }

    @PatchMapping("/{id}/favorite")
    public ReservationDTO updateFavorite(@PathVariable Long id, @RequestParam Boolean favorite) {
        return reservationService.updateFavorite(id, favorite);
    }
}
