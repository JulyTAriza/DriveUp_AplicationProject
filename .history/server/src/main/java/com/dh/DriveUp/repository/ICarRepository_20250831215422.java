package com.dh.DriveUp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dh.DriveUp.entity.Car;

@Repository
public interface ICarRepository extends JpaRepository<Car, Long> {

    List<Car> findByCarBrandContainingIgnoreCase(String carBrand);

    List<Car> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT * FROM cars ORDER BY RAND() LIMIT 10", nativeQuery = true)
     List<Car> findRandomCars();

     List<Car> findByCategory_NameIgnoreCase(String categoryName);
        // Método para buscar un auto por nombre y marca
    Optional<Car> findByNameAndCarBrand(String name, String carBrand);

    // Método para buscar un auto por nombre y marca, excluyendo un ID específico
    Optional<Car> findByNameAndCarBrandAndIdNot(String name, String carBrand, Long id);

}
