package com.dh.DriveUp.service;

import org.springframework.web.multipart.MultipartFile;

import com.dh.DriveUp.dto.CarDTO;
import com.dh.DriveUp.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ICarService {

    CarDTO save(CarDTO carDTO, MultipartFile[] images);
    Optional<CarDTO> findById(Long id) throws ResourceNotFoundException;
    CarDTO update(CarDTO carDTO, MultipartFile[] images);
    void delete(Long id) throws ResourceNotFoundException;
    List<CarDTO> findAll();
    List<CarDTO> findByCarBrand(String carBrand) throws Exception;
    List<CarDTO> findByName(String name) throws Exception;

}
