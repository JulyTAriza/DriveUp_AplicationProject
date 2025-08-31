package com.dh.DriveUp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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



    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDTO> save(
            @RequestPart("car") String carJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        CarDTO carDTO = mapper.readValue(carJson, CarDTO.class);

        return ResponseEntity.ok(iCarService.save(carDTO, images));
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

    // endpoint que nos permita actualizar un auto ya existente
    @PutMapping
    public ResponseEntity<CarDTO> update(@RequestBody CarDTO carDTO, @RequestPart(value = "images", required = false) MultipartFile[] images) {
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
            throw new Exception("No se escontró un auto con el nombre: " + name);
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

}
