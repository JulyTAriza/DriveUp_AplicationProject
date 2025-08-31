package com.dh.AlquilerAutosMVC.dto;

import java.util.ArrayList;
import java.util.List;

public class CategoryDTO {

    private Long id;
    private String name;
    private List<Long> cars_id = new ArrayList<>();

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String name, List<Long> cars_id) {
        this.id = id;
        this.name = name;
        this.cars_id = cars_id;
    }

    public CategoryDTO(String name, List<Long> cars_id) {
        this.name = name;
        this.cars_id = cars_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getCars_id() {
        return cars_id;
    }

    public void setCars_id(List<Long> cars_id) {
        this.cars_id = cars_id;
    }
}
