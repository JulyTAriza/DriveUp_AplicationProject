package com.dh.AlquilerAutosMVC.controller;

import com.dh.AlquilerAutosMVC.dto.CarReservationDTO;
import com.dh.AlquilerAutosMVC.dto.CategoryDTO;
import com.dh.AlquilerAutosMVC.entity.Category;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;
import com.dh.AlquilerAutosMVC.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
