package com.dh.DriveUp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.service.ICarReservationService;
import com.dh.DriveUp.service.ICarService;
import com.dh.DriveUp.service.IUserService;

@RestController
@RequestMapping("/reservas")
public class CarReservationController {

    private ICarReservationService iCarReservationService;
    private ICarService iCarService;
    private IUserService iUserService;

    @Autowired
    public CarReservationController(ICarReservationService iCarReservationService, ICarService iCarService, IUserService iUserService) {
        this.iCarReservationService = iCarReservationService;
        this.iCarService = iCarService;
        this.iUserService = iUserService;
    }

    @PostMapping
    public ResponseEntity<CarReservationDTO> save(@RequestBody CarReservationDTO carReservationDTO) throws ResourceNotFoundException {
        ResponseEntity<CarReservationDTO> response;

        // Chequeamos que existan el auto y el usuario
        if (iCarService.findById(carReservationDTO.getCar_id()).isPresent()
                && iUserService.findById(carReservationDTO.getUser_id()).isPresent()) {

            // ✅ Si no se envía un status, lo inicializamos como "PENDIENTE"
            if (carReservationDTO.getStatus() == null || carReservationDTO.getStatus().isEmpty()) {
                carReservationDTO.setStatus("PENDIENTE");
            }

            // Seteamos al ResponseEntity con el 200 OK
            response = ResponseEntity.ok(iCarReservationService.save(carReservationDTO));
        } else {
            //Seteamos al ResponseEntity el 400 bad request
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarReservationDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<CarReservationDTO> carReservationDTOToLookFor = iCarReservationService.findById(id);

        return ResponseEntity.ok(carReservationDTOToLookFor.get());
    }

    // TODO: AGREGAR
    //  filtros de por qué no se podría actualizar
    //  - si cambia fecha (chequear si el auto está disponible)

    @PutMapping
    public ResponseEntity<CarReservationDTO> update(@RequestBody CarReservationDTO carReservationDTO) throws Exception {
        ResponseEntity<CarReservationDTO> response;

        if(iCarService.findById(carReservationDTO.getCar_id()).isPresent()
                && iUserService.findById(carReservationDTO.getUser_id()).isPresent()) {

            response = ResponseEntity.ok(iCarReservationService.update(carReservationDTO));
        } else {
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        iCarReservationService.delete(id);
        return ResponseEntity.ok("Se eliminó la reserva con id: " + id);
    }

    // Endpoint consulto todas las reservas
    @GetMapping
    public ResponseEntity<List<CarReservationDTO>> findAll() {
        return ResponseEntity.ok(iCarReservationService.findAll());
    }

}
