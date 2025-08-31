package com.dh.AlquilerAutosMVC.repository;

import com.dh.AlquilerAutosMVC.dto.CategoryDTO;
import com.dh.AlquilerAutosMVC.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
}
