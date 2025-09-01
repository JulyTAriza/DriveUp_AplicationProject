package com.dh.DriveUp.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.entity.Car;
import com.dh.DriveUp.entity.CarReservation;
import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.repository.ICarReservationRepository;
import com.dh.DriveUp.repository.IUserRepository;
import com.dh.DriveUp.service.ICarReservationService;

@Service
public class CarReservationService implements ICarReservationService {

    private ICarReservationRepository carReservationRepository;

     @Autowired
    private IUserRepository userRepository;

    // 🔹 nuevo: para enviar correos
    @Autowired
    private EmailService emailService;


    @Autowired
    public CarReservationService(ICarReservationRepository carReservationRepository) {
        this.carReservationRepository = carReservationRepository;
    }

    @Override
    public CarReservationDTO save(CarReservationDTO carReservationDTO) {
        CarReservation carReservationEntity = new CarReservation();

        Car carEntity = new Car();
        carEntity.setId(carReservationDTO.getCar_id());

        User userEntity = new User();
        userEntity.setId(carReservationDTO.getUser_id());

        carReservationEntity.setCar(carEntity);
        carReservationEntity.setUser(userEntity);
        carReservationEntity.setPickUp(carReservationDTO.getPickUp());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate rentalStart = LocalDate.parse(carReservationDTO.getRentalStart(), formatter);
        LocalDate rentalEnd = LocalDate.parse(carReservationDTO.getRentalEnd(), formatter);

        carReservationEntity.setRentalStart(rentalStart);
        carReservationEntity.setRentalEnd(rentalEnd);
               // Validación de fechas: La fecha de inicio no puede ser posterior a la de fin
        if (rentalStart.isAfter(rentalEnd)) {
            throw new IllegalArgumentException("La fecha de inicio de la reserva no puede ser posterior a la fecha de finalización.");
        }

        // VALIDACIÓN DE DISPONIBILIDAD
        // Buscamos si ya existen reservas superpuestas para este auto
        List<CarReservation> overlappingReservations = carReservationRepository.findOverlappingReservations(
            carReservationDTO.getCar_id(), rentalStart, rentalEnd
        );

        // Si se encuentra al menos una reserva superpuesta, lanzamos una excepción
        if (!overlappingReservations.isEmpty()) {
            throw new IllegalStateException("El auto ya está reservado en las fechas seleccionadas.");
        }

        // ✅ status
        carReservationEntity.setStatus(
                carReservationDTO.getStatus() != null ? carReservationDTO.getStatus() : "PENDIENTE"
        );

        // ⭐ y ❤️
        carReservationEntity.setStars(carReservationDTO.getStars());
        carReservationEntity.setFavorite(
                carReservationDTO.getFavorite() != null ? carReservationDTO.getFavorite() : false
        );
        
        // 🔹 Enviar correo al usuario al crear la reserva
        try {
            emailService.enviarCorreo(
                    userEntity.getEmail(), // destinatario
                    "Reserva creada en DriveUp", // asunto
                    "Estimado Usuario de DriveUp "  + // cuerpo
                            "Tu reserva ha sido creada con éxito para el auto con ID: " + carEntity.getId() +
                            " desde " + rentalStart + " hasta " + rentalEnd + ".\n" +
                            "Estado actual: " + carReservationEntity.getStatus() + "\n\n" +
                            "¡Gracias por usar DriveUp! Sigue conduciendo con nosotros"
            );
        } catch (Exception e) {
            System.err.println("⚠️ Error enviando correo de reserva: " + e.getMessage());
        }

        carReservationRepository.save(carReservationEntity);

        CarReservationDTO carReservationDTOToReturn = new CarReservationDTO();
        carReservationDTOToReturn.setId(carReservationEntity.getId());
        carReservationDTOToReturn.setCar_id(carReservationEntity.getCar().getId());
        carReservationDTOToReturn.setUser_id(carReservationEntity.getUser().getId());
        carReservationDTOToReturn.setPickUp(carReservationEntity.getPickUp());
        carReservationDTOToReturn.setRentalStart(carReservationEntity.getRentalStart().toString());
        carReservationDTOToReturn.setRentalEnd(carReservationEntity.getRentalEnd().toString());
        carReservationDTOToReturn.setStatus(carReservationEntity.getStatus());
        carReservationDTOToReturn.setStars(carReservationEntity.getStars());
        carReservationDTOToReturn.setFavorite(carReservationEntity.getFavorite());

        return carReservationDTOToReturn;
    }

    @Override
    public Optional<CarReservationDTO> findById(Long id) throws ResourceNotFoundException {
        Optional<CarReservation> carReservationToLookFor = carReservationRepository.findById(id);

        if (carReservationToLookFor.isPresent()) {
            CarReservation carReservation = carReservationToLookFor.get();

            CarReservationDTO carReservationDTOToReturn = new CarReservationDTO();
            carReservationDTOToReturn.setId(carReservation.getId());
            carReservationDTOToReturn.setCar_id(carReservation.getCar().getId());
            carReservationDTOToReturn.setUser_id(carReservation.getUser().getId());
            carReservationDTOToReturn.setPickUp(carReservation.getPickUp());
            carReservationDTOToReturn.setRentalStart(carReservation.getRentalStart().toString());
            carReservationDTOToReturn.setRentalEnd(carReservation.getRentalEnd().toString());
            carReservationDTOToReturn.setStatus(carReservation.getStatus());
            carReservationDTOToReturn.setStars(carReservation.getStars());
            carReservationDTOToReturn.setFavorite(carReservation.getFavorite());

            return Optional.of(carReservationDTOToReturn);
        } else {
            throw new ResourceNotFoundException("No se encontró la reserva con id: "+ id);
        }
    }

    @Override
    public CarReservationDTO update(CarReservationDTO carReservationDTO) throws Exception {
        if (carReservationRepository.findById(carReservationDTO.getId()).isPresent()) {
            Optional<CarReservation> carReservationEntity = carReservationRepository.findById(carReservationDTO.getId());

            Car carEntity = new Car();
            carEntity.setId(carReservationDTO.getCar_id());

            User userEntity = new User();
            userEntity.setId(carReservationDTO.getUser_id());

            carReservationEntity.get().setCar(carEntity);
            carReservationEntity.get().setUser(userEntity);
            carReservationEntity.get().setPickUp(carReservationDTO.getPickUp());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate rentalStart = LocalDate.parse(carReservationDTO.getRentalStart(), formatter);
            LocalDate rentalEnd = LocalDate.parse(carReservationDTO.getRentalEnd(), formatter);
                        // VALIDACIÓN DE ACTUALIZACIÓN
            // Buscamos si ya existen reservas superpuestas, excluyendo la que estamos actualizando
            List<CarReservation> overlappingReservations = carReservationRepository.findOverlappingReservations(
                carReservationDTO.getCar_id(), rentalStart, rentalEnd
            );
            
            // Filtramos la reserva actual para no considerarla como superpuesta
            List<CarReservation> otherOverlappingReservations = overlappingReservations.stream()
                .filter(r -> !r.getId().equals(carReservationDTO.getId()))
                .collect(Collectors.toList());

            if (!otherOverlappingReservations.isEmpty()) {
                throw new IllegalStateException("El auto ya está reservado en las fechas seleccionadas.");
            }

            carReservationEntity.get().setRentalStart(rentalStart);
            carReservationEntity.get().setRentalEnd(rentalEnd);

            if (carReservationDTO.getStatus() != null) {
                carReservationEntity.get().setStatus(carReservationDTO.getStatus());
            }

            // ⭐ y ❤️
            if (carReservationDTO.getStars() != null) {
                carReservationEntity.get().setStars(carReservationDTO.getStars());
            }
            if (carReservationDTO.getFavorite() != null) {
                carReservationEntity.get().setFavorite(carReservationDTO.getFavorite());
            }

            carReservationRepository.save(carReservationEntity.get());

            CarReservationDTO carReservationDTOToReturn = new CarReservationDTO();
            carReservationDTOToReturn.setId(carReservationEntity.get().getId());
            carReservationDTOToReturn.setCar_id(carReservationEntity.get().getCar().getId());
            carReservationDTOToReturn.setUser_id(carReservationEntity.get().getUser().getId());
            carReservationDTOToReturn.setPickUp(carReservationEntity.get().getPickUp());
            carReservationDTOToReturn.setRentalStart(carReservationEntity.get().getRentalStart().toString());
            carReservationDTOToReturn.setRentalEnd(carReservationEntity.get().getRentalEnd().toString());
            carReservationDTOToReturn.setStatus(carReservationEntity.get().getStatus());
            carReservationDTOToReturn.setStars(carReservationEntity.get().getStars());
            carReservationDTOToReturn.setFavorite(carReservationEntity.get().getFavorite());

            return carReservationDTOToReturn;
        } else {
            throw new Exception("No se pudo actualizar el turno");
        }
    }

    @Override
    public Optional<CarReservationDTO> delete(Long id) throws ResourceNotFoundException {
        Optional<CarReservation> carReservationToLookFor = carReservationRepository.findById(id);
        Optional<CarReservationDTO> carReservationDTO;

        if (carReservationToLookFor.isPresent()) {
            CarReservation carReservation = carReservationToLookFor.get();
            carReservationRepository.delete(carReservation);

            CarReservationDTO carReservationDTOToReturn = new CarReservationDTO();
            carReservationDTOToReturn.setId(carReservation.getId());
            carReservationDTOToReturn.setCar_id(carReservation.getCar().getId());
            carReservationDTOToReturn.setUser_id(carReservation.getUser().getId());
            carReservationDTOToReturn.setPickUp(carReservation.getPickUp());
            carReservationDTOToReturn.setRentalStart(carReservation.getRentalStart().toString());
            carReservationDTOToReturn.setRentalEnd(carReservation.getRentalEnd().toString());
            carReservationDTOToReturn.setStatus(carReservation.getStatus());
            carReservationDTOToReturn.setStars(carReservation.getStars());
            carReservationDTOToReturn.setFavorite(carReservation.getFavorite());

            carReservationDTO = Optional.of(carReservationDTOToReturn);
            return carReservationDTO;
        } else {
            throw new ResourceNotFoundException("No se encontró la reserva con id: " + id);
        }
    }

    @Override
    public List<CarReservationDTO> findAll() {
        List<CarReservation> carReservationList = carReservationRepository.findAll();
        List<CarReservationDTO> carReservationDTOS = new ArrayList<>();

        for (CarReservation carReservation : carReservationList) {
            carReservationDTOS.add(new CarReservationDTO(
                    carReservation.getId(),
                    carReservation.getCar().getId(),
                    carReservation.getUser().getId(),
                    carReservation.getPickUp(),
                    carReservation.getRentalStart().toString(),
                    carReservation.getRentalEnd().toString(),
                    carReservation.getStatus(),
                    carReservation.getStars(),
                    carReservation.getFavorite()
            ));
        }

        return carReservationDTOS;
    }

    // ✅ nuevo: actualizar solo las estrellas
    @Override
    public CarReservationDTO updateStars(Long reservationId, Integer stars) throws ResourceNotFoundException {
        CarReservation reservation = carReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + reservationId));

        reservation.setStars(stars);
        carReservationRepository.save(reservation);

        return new CarReservationDTO(
                reservation.getId(),
                reservation.getCar().getId(),
                reservation.getUser().getId(),
                reservation.getPickUp(),
                reservation.getRentalStart().toString(),
                reservation.getRentalEnd().toString(),
                reservation.getStatus(),
                reservation.getStars(),
                reservation.getFavorite()
        );
    }

    // ✅ nuevo: actualizar solo favorito
    @Override
    public CarReservationDTO updateFavorite(Long reservationId, Boolean favorite) throws ResourceNotFoundException {
        CarReservation reservation = carReservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + reservationId));

        reservation.setFavorite(favorite);
        carReservationRepository.save(reservation);

        return new CarReservationDTO(
                reservation.getId(),
                reservation.getCar().getId(),
                reservation.getUser().getId(),
                reservation.getPickUp(),
                reservation.getRentalStart().toString(),
                reservation.getRentalEnd().toString(),
                reservation.getStatus(),
                reservation.getStars(),
                reservation.getFavorite()
        );
    }

    // ✅ sigue igual, solo maneja fechas
    public List<Long> findReservedCarsBetweenDates(LocalDate startDate, LocalDate endDate) {
        List<CarReservation> reservations = carReservationRepository.findAll();
        List<Long> reservedCarIds = new ArrayList<>();

        for (CarReservation reservation : reservations) {
            boolean overlaps = !(reservation.getRentalEnd().isBefore(startDate) || reservation.getRentalStart().isAfter(endDate));
            if (overlaps && "CONFIRMADA".equalsIgnoreCase(reservation.getStatus())) {
                reservedCarIds.add(reservation.getCar().getId());
            }
        }
        return reservedCarIds;
    }
@Override
public List<CarReservationDTO> findByUserId(Long userId) throws ResourceNotFoundException {
List<CarReservation> userReservations = carReservationRepository.findByUserId(userId);

 if (userReservations.isEmpty()) {
 throw new ResourceNotFoundException("No se encontraron reservas para el usuario con id: " + userId);
}

 List<CarReservationDTO> dtos = new ArrayList<>();
 for (CarReservation reservation : userReservations) {
dtos.add(new CarReservationDTO(
reservation.getId(),
 reservation.getCar().getId(),
 reservation.getUser().getId(),
 reservation.getPickUp(),
 reservation.getRentalStart().toString(),
 reservation.getRentalEnd().toString(),
reservation.getStatus(),
reservation.getStars(),
 reservation.getFavorite()
 ));
}
return dtos;
}
}
