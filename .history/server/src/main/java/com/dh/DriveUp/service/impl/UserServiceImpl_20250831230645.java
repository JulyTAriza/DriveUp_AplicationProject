package com.dh.DriveUp.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.repository.IUserRepository;
import com.dh.DriveUp.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {

    private IUserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    public UserServiceImpl(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

@Override
public User save(User user) {
    // 1️⃣ Guardamos el usuario en la BD
    User savedUser = userRepository.save(user);

    // 2️⃣ Enviamos el correo de bienvenida
    try {
        emailService.enviarCorreo(
            savedUser.getEmail(), // 📧 destinatario
            "Bienvenido a DriveUp 🚗", // asunto
            "Hola " + savedUser.getNombre() + ",\n\n" + // 🛠️ Corrección: Obtén el nombre del usuario
            "¡Gracias por registrarte en DriveUp! 🎉\n" +
            "Ya puedes explorar nuestro catálogo de autos y realizar reservas fácilmente.\n\n" +
            "Atentamente,\nEl equipo de DriveUp."
        );
    } catch (Exception e) {
        System.err.println("⚠️ Error enviando correo de bienvenida: " + e.getMessage());
    }

    // 3️⃣ Retornamos el usuario guardado
    return savedUser;
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

}
