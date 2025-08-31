package com.dh.DriveUp.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dh.DriveUp.dto.CarReservationDTO;
import com.dh.DriveUp.entity.Car;
import com.dh.DriveUp.entity.CarReservation;
import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.repository.ICarReservationRepository;
import com.dh.DriveUp.service.ICarReservationService;

@Service
public class CarReservationService implements ICarReservationService {

    private ICarReservationRepository carReservationRepository;

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

        // ✅ status
        carReservationEntity.setStatus(
                carReservationDTO.getStatus() != null ? carReservationDTO.getStatus() : "PENDIENTE"
        );

        // ⭐ y ❤️
        carReservationEntity.setStars(carReservationDTO.getStars());
        carReservationEntity.setFavorite(
                carReservationDTO.getFavorite() != null ? carReservationDTO.getFavorite() : false
        );

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
}
