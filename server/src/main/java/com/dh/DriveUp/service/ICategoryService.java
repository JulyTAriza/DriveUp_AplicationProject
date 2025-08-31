package com.dh.DriveUp.service;

import java.util.List;
import java.util.Optional;

import com.dh.DriveUp.dto.CategoryDTO;
import com.dh.DriveUp.entity.Category;
import com.dh.DriveUp.exception.ResourceNotFoundException;

public interface ICategoryService {

    CategoryDTO save(CategoryDTO categoryDTO);
    Optional<CategoryDTO> findById(Long id) throws ResourceNotFoundException;
    CategoryDTO update(CategoryDTO categoryDTO) throws ResourceNotFoundException;
    void delete(Long id) throws ResourceNotFoundException;
    List<CategoryDTO> findAll();
    Optional<CategoryDTO> findByName(String name)  throws ResourceNotFoundException;
}
