package com.dh.DriveUp.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dh.DriveUp.dto.CarDTO;
import com.dh.DriveUp.dto.CategoryDTO;
import com.dh.DriveUp.dto.DateRangeDTO;
import com.dh.DriveUp.entity.Car;
import com.dh.DriveUp.entity.Category;
import com.dh.DriveUp.exception.ResourceNotFoundException;
import com.dh.DriveUp.repository.ICarRepository;
import com.dh.DriveUp.repository.ICategoryRepository;
import com.dh.DriveUp.service.ICarService;

@Service
public class CarServiceImpl implements ICarService {

    private final ICarRepository carRepository;
    private final ICategoryRepository categoryRepository;

    @Autowired
    public CarServiceImpl(ICarRepository carRepository, ICategoryRepository categoryRepository) {
        this.carRepository = carRepository;
        this.categoryRepository = categoryRepository;
    }

    public Car fromDTO(CarDTO dto) {
        Car car = new Car();
        car.setName(dto.getName());
        car.setDescription(dto.getDescription());
        car.setImagePaths(dto.getImagePaths() != null ? dto.getImagePaths() : new ArrayList<>());
        car.setCarBrand(dto.getCarBrand());
        car.setPricePerHour(dto.getPricePerHour());
        car.setCharacteristics(dto.getCharacteristics());

        // Lógica corregida para obtener la categoría desde el DTO
        if (dto.getCategory() == null || dto.getCategory().getId() == null) {
            throw new IllegalArgumentException("El ID de categoría no puede ser null");
        }
        Category category = categoryRepository.findById(dto.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        car.setCategory(category);

        return car;
    }

    public CarDTO toDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setName(car.getName());
        dto.setDescription(car.getDescription());
        dto.setImagePaths(car.getImagePaths());
        dto.setCarBrand(car.getCarBrand());
        dto.setPricePerHour(car.getPricePerHour());
        dto.setCharacteristics(car.getCharacteristics());

        // Lógica corregida para mapear la categoría al DTO
        CategoryDTO categoryDto = new CategoryDTO();
        categoryDto.setId(car.getCategory().getId());
        categoryDto.setName(car.getCategory().getName());
        // No se requiere la lista de cars_id en este DTO de salida
        dto.setCategory(categoryDto);

        List<DateRangeDTO> reservedDates = car.getCarReservations().stream()
                .map(res -> new DateRangeDTO(res.getRentalStart(), res.getRentalEnd()))
                .collect(Collectors.toList());
        dto.setReservedDates(reservedDates);

        return dto;
    }

    // --- MÉTODOS EXISTENTES ---

    private List<String> uploadImages(MultipartFile[] images) {
        List<String> urls = new ArrayList<>();
        if (images == null) return urls;

        String uploadDir = "uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        for (MultipartFile image : images) {
            try {
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filepath = Paths.get(uploadDir, filename);
                Files.write(filepath, image.getBytes());
                urls.add("http://localhost:8080/" + uploadDir + filename); // URL COMPLETA
            } catch (IOException e) {
                throw new RuntimeException("Error al subir imagen", e);
            }
        }
        return urls;
    }

    @Override
    public CarDTO save(CarDTO carDTO, MultipartFile[] images) {
        Car car = fromDTO(carDTO);
        List<String> imageUrls = uploadImages(images);
        car.setImagePaths(imageUrls);
        carRepository.save(car);
        return toDTO(car);
    }

    @Override
    public Optional<CarDTO> findById(Long id) throws ResourceNotFoundException {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auto no encontrado"));
        return Optional.of(toDTO(car));
    }

    @Override
    public CarDTO update(CarDTO carDTO, MultipartFile[] images) {
        Car car = carRepository.findById(carDTO.getId())
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));

        car.setName(carDTO.getName());
        car.setDescription(carDTO.getDescription());
        car.setCarBrand(carDTO.getCarBrand());
        car.setPricePerHour(carDTO.getPricePerHour());
        car.setCharacteristics(carDTO.getCharacteristics());
        car.setImagePaths(carDTO.getImagePaths() != null ? carDTO.getImagePaths() : new ArrayList<>());

        // Lógica corregida para la actualización
        if (carDTO.getCategory() != null && carDTO.getCategory().getId() != null) {
            Category category = categoryRepository.findById(carDTO.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            car.setCategory(category);
        }

        if (images != null && images.length > 0) {
            List<String> newImageUrls = uploadImages(images);
            car.getImagePaths().addAll(newImageUrls);
        }

        carRepository.save(car);
        return toDTO(car);
    }

    @Override
    public void delete(Long id) throws ResourceNotFoundException {
        Optional<Car> carToLookFor = carRepository.findById(id);
        if (carToLookFor.isPresent()) {
            carRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("No existe un auto con id: " + id);
        }
    }

    @Override
    public List<CarDTO> findAll() {
        return carRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> findByCarBrand(String carBrand) {
        List<Car> cars = carRepository.findByCarBrandContainingIgnoreCase(carBrand);
        return cars.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> findByName(String name) throws Exception {
        List<Car> cars = carRepository.findByNameContainingIgnoreCase(name);
        return cars.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> findRandom() {
        List<Car> randomCars = carRepository.findRandomCars();
        return randomCars.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<CarDTO> findAllPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Car> carsPage = carRepository.findAll(pageable);
        return carsPage.map(this::toDTO);
    }

    @Override
    public List<CarDTO> findByCategory(String categoryName) {
        List<Car> cars = carRepository.findByCategory_NameIgnoreCase(categoryName);
        return cars.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
        @Override
        public CarDTO updateCharacteristics(CarDTO carDTO) {
        Car existingCar = carRepository.findById(carDTO.getId())
                .orElseThrow(() -> new RuntimeException("Auto no encontrado con ID: " + carDTO.getId()));

        // Actualiza solo las propiedades que te interesan, como las características
        existingCar.setNames(carDTO.getName());
        existingCar.setDescription(carDTO.getDescription());
        existingCar.setCarBrand(carDTO.getCarBrand());
        existingCar.setPricePerHour(carDTO.getPricePerHour());
        existingCar.setCharacteristics(carDTO.getCharacteristics());

        if (carDTO.getCategory() != null) {
            existingCar.setCategory(categoryRepository.findById(carDTO.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }

        Car savedCar = carRepository.save(existingCar);
        return toDTO(savedCar);
    }
}
