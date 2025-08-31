package com.dh.AlquilerAutosMVC.service;

import com.dh.AlquilerAutosMVC.dto.CategoryDTO;
import com.dh.AlquilerAutosMVC.entity.Category;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {

    CategoryDTO save(CategoryDTO categoryDTO);
    Optional<CategoryDTO> findById(Long id) throws ResourceNotFoundException;
    CategoryDTO update(CategoryDTO categoryDTO) throws ResourceNotFoundException;
    void delete(Long id) throws ResourceNotFoundException;
    List<CategoryDTO> findAll();
    Optional<CategoryDTO> findByName(String name)  throws ResourceNotFoundException;
}
