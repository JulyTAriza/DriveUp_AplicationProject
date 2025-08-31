package com.dh.DriveUp.service;

import java.util.List;
import java.util.Optional;

import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;

public interface IUserService {

    User save(User user);
    Optional<User> findById(Long id);
    void update(User user);
    void delete(Long id) throws ResourceNotFoundException;
    List<User> findAll();
}
