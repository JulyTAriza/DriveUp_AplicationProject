package com.dh.DriveUp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dh.DriveUp.dto.CategoryDTO;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.service.ICategoryService;

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

  
    @GetMapping("/nombre/{name}")
    public ResponseEntity<CategoryDTO> findByName(@PathVariable String name) throws ResourceNotFoundException {
        Optional<CategoryDTO> categoryToLookFor = iCategoryService.findByName(name);

        return ResponseEntity.ok(categoryToLookFor.get());
    }
}
