package com.dh.AlquilerAutosMVC.controller;

import com.dh.AlquilerAutosMVC.dto.CarReservationDTO;
import com.dh.AlquilerAutosMVC.entity.Car;
import com.dh.AlquilerAutosMVC.entity.CarReservation;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;
import com.dh.AlquilerAutosMVC.service.ICarReservationService;
import com.dh.AlquilerAutosMVC.service.ICarService;
import com.dh.AlquilerAutosMVC.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    // TODO: AGREGAR
    //  - por qué no se podría guardar el turno
    //     . ej: si el auto no está disponible en esa fecha
    //       hay que chequear en getCarReservations
    /*
    Optional<Car> car = iCarService.findById(carReservationDTO.getCar_id());
    car.get().getCarReservations()
    // Preguntar si tiene reservas esos días
    */
    @PostMapping
    public ResponseEntity<CarReservationDTO> save(@RequestBody CarReservationDTO carReservationDTO) throws ResourceNotFoundException {
        ResponseEntity<CarReservationDTO> response;

        // Chequeamos que existan el auto y el usuario
        if (iCarService.findById(carReservationDTO.getCar_id()).isPresent()
                && iUserService.findById(carReservationDTO.getUser_id()).isPresent()) {

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

    // TODO: AGREGAR
    //  filtros de por qué no se podría eliminar

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
