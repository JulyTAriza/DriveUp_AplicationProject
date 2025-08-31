package com.dh.AlquilerAutosMVC.service;

import com.dh.AlquilerAutosMVC.entity.User;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    User save(User user);
    Optional<User> findById(Long id);
    void update(User user);
    void delete(Long id) throws ResourceNotFoundException;
    List<User> findAll();
}
