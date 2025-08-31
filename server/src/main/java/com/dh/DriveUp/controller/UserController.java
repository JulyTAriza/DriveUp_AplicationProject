package com.dh.DriveUp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.service.IUserService;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private IUserService iUserService;

    @Autowired
    public UserController(IUserService iUserService) {
        this.iUserService = iUserService;
    }

    @PostMapping
    public ResponseEntity<User> save(@RequestBody User user) {
        return ResponseEntity.ok(iUserService.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        Optional<User> user = iUserService.findById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<String> update(@RequestBody User user) {
        ResponseEntity<String> response;
        Optional<User> userToLookFor = iUserService.findById(user.getId());

        if (userToLookFor.isPresent()) {
            iUserService.update(user);
            response = ResponseEntity.ok("Se actualizó el auto con id: " + user.getId());
        } else {
            response = ResponseEntity.ok().body("No se puede actualizar un auto que no existe dentro de la BD");
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) throws ResourceNotFoundException {
        iUserService.delete(id);
        return ResponseEntity.ok("Se eliminó el usuario con id: " + id);
    }

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(iUserService.findAll());
    }
}
