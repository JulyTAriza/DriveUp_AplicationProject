package com.dh.DriveUp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus; // Importación para HttpStatus.OK/CREATED
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dh.DriveUp.dto.CarDTO;
import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.service.ICarService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/autos")
public class CarController {

    private ICarService iCarService;

    @Autowired
    public CarController(ICarService iCarService) {
        this.iCarService = iCarService;
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        System.out.println("Recibido");
        return ResponseEntity.ok("pong");
    }

    // --- Método 'save' corregido y comentado ---
    // Este método ya estaba usando @RequestPart y ObjectMapper, lo cual es correcto
    // para manejar solicitudes multipart/form-data con JSON y archivos.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDTO> save(
            @RequestPart("car") String carJson, // Recibe el JSON del CarDTO como un String
            @RequestPart(value = "images", required = false) MultipartFile[] images // Recibe las imágenes
    ) throws JsonProcessingException {
        // Se utiliza ObjectMapper para convertir el String JSON a un objeto CarDTO
        ObjectMapper mapper = new ObjectMapper();
        CarDTO carDTO = mapper.readValue(carJson, CarDTO.class);

        // Llama al servicio para guardar el auto y las imágenes
        return ResponseEntity.status(HttpStatus.CREATED).body(iCarService.save(carDTO, images)); // Se cambió a HttpStatus.CREATED
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<CarDTO> carDTO = iCarService.findById(id);

        if (carDTO.isPresent()) {
            return ResponseEntity.ok(carDTO.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Método 'update' corregido y comentado ---
    // Se ha cambiado de @RequestBody a @RequestPart para permitir recibir
    // tanto el JSON del CarDTO como los archivos (imágenes) en una solicitud
    // de tipo multipart/form-data.
@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<CarDTO> update(
    @PathVariable Long id, // Aquí capturamos el ID de la URL
    @RequestPart("car") String carJson,
    @RequestPart(value = "images", required = false) MultipartFile[] images
) throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    CarDTO carDTO = mapper.readValue(carJson, CarDTO.class);
    
    // Asignamos el ID de la URL al DTO antes de enviarlo al servicio
    carDTO.setId(id);
    
    CarDTO updated = iCarService.update(carDTO, images);
    return ResponseEntity.ok(updated);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        iCarService.delete(id);
        return ResponseEntity.ok("Se eliminó el auto con id: " + id);
    }

    @GetMapping
    public ResponseEntity<List<CarDTO>> findAll() {
        return ResponseEntity.ok(iCarService.findAll());
    }

    @GetMapping("/marca/{carBrand}")
    public ResponseEntity<List<CarDTO>> findByCarBrand(@PathVariable String carBrand) throws Exception {
        List<CarDTO> carList = iCarService.findByCarBrand(carBrand);

        if (carList != null) {
            return ResponseEntity.ok(carList);
        } else {
            throw new Exception("No se encontró autos con la marca: " + carBrand);
        }
    }

    @GetMapping("/nombre")
    public ResponseEntity<List<CarDTO>> findByName(@RequestParam String name) throws Exception {
        List<CarDTO> carList = iCarService.findByName(name);

        if (carList.isEmpty()) {
            throw new Exception("No se encontró un auto con el nombre: " + name);
        }
        return ResponseEntity.ok(carList);
    }

    @GetMapping("/random")
    public ResponseEntity<List<CarDTO>> findRandom() {
        return ResponseEntity.ok(iCarService.findRandom());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<CarDTO>> findAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(iCarService.findAllPaged(page, size));
    }

    @GetMapping("/byCategory")
    public ResponseEntity<List<CarDTO>> findByCategory(@RequestParam String category) {
        return ResponseEntity.ok(iCarService.findByCategory(category));
    }

    @GetMapping("/debug/me")
    public ResponseEntity<?> whoAmI(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("No authentication present");
        }
        return ResponseEntity.ok(authentication);
    }
    @PutMapping("/{id}/caracteristicas")
    public ResponseEntity<CarDTO> updateCharacteristics(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        // Asegura que el DTO tenga el ID del PathVariable
        carDTO.setId(id);
        CarDTO updated = iCarService.updateCharacteristics(carDTO);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CarReservationDTO>> findByUserId(@PathVariable Long userId) throws ResourceNotFoundException {
    return ResponseEntity.ok(iCarReservationService.findByUserId(userId));
    }
}
