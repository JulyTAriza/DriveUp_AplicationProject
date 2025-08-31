package com.dh.DriveUp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dh.DriveUp.dto.CategoryDTO;
import com.dh.DriveUp.entity.Category;

import java.util.Optional;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
}
