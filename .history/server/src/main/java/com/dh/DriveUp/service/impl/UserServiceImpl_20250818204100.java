package com.dh.DriveUp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.repository.IUserRepository;
import com.dh.DriveUp.service.IUserService;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

    private IUserRepository userRepository;

    @Autowired
    public UserServiceImpl(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void update(User user) {
        userRepository.save(user);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        Optional<User> userToLookFor = userRepository.findById(id);

        if (userToLookFor.isPresent()) {
            userRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("No se pudo eliminar el usuario con id: " + id);
        }

        userRepository.deleteById(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // TODO: AGREGAR
    //  - Cambiar de role(solo lo puede hacer el ADMIN)
    //  - Buscar por nombre o apellido

}
