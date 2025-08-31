package com.dh.DriveUp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.dto.CategoryDTO;
import com.dh.DriveUp.entity.Category;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.service.ICategoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categorias")
public class CategoryController {

    private ICategoryService iCategoryService;

    @Autowired
    public CategoryController(ICategoryService iCategoryService) {
        this.iCategoryService = iCategoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> save(@RequestBody CategoryDTO categoryDTO) throws ResourceNotFoundException {

        if (iCategoryService.findByName(categoryDTO.getName()) == null) {
            return ResponseEntity.ok(iCategoryService.save(categoryDTO));
        } else {
            throw new ResourceNotFoundException("No se puede guardar, ya existe una categoría con el nombre: " + categoryDTO.getName());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<CategoryDTO> categoryDTO = iCategoryService.findById(id);

        if (categoryDTO.isPresent()) {
            return ResponseEntity.ok(categoryDTO.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<String> update(@RequestBody CategoryDTO categoryDTO) throws ResourceNotFoundException {
        ResponseEntity<String> response;
        Optional<CategoryDTO> categoryToLookFor = iCategoryService.findById(categoryDTO.getId());

        if (categoryToLookFor.isPresent()) {
            iCategoryService.update(categoryDTO);
            response = ResponseEntity.ok("Se actualizó la categoría con id: " + categoryDTO.getId());
        } else {
            response = ResponseEntity.ok().body("No se puede actualizar una categoría que no existe dentro de la BD");
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        iCategoryService.delete(id);
        return ResponseEntity.ok("Se eliminó con éxito la categoría con id: " + id);

    }

    @GetMapping
    public List<CategoryDTO> findAll() {
        return iCategoryService.findAll();
    }


    // TODO: CORREGIR
    //  
    @GetMapping("/nombre/{name}")
    public ResponseEntity<CategoryDTO> findByName(@PathVariable String name) throws ResourceNotFoundException {
        Optional<CategoryDTO> categoryToLookFor = iCategoryService.findByName(name);

        return ResponseEntity.ok(categoryToLookFor.get());
    }
}
