package com.dh.AlquilerAutosMVC.service.impl;

import com.dh.AlquilerAutosMVC.dto.CarDTO;
import com.dh.AlquilerAutosMVC.dto.CategoryDTO;
import com.dh.AlquilerAutosMVC.dto.DateRangeDTO;
import com.dh.AlquilerAutosMVC.entity.Car;
import com.dh.AlquilerAutosMVC.exception.ResourceNotFoundException;
import com.dh.AlquilerAutosMVC.repository.ICarRepository;
import com.dh.AlquilerAutosMVC.repository.ICategoryRepository;
import com.dh.AlquilerAutosMVC.entity.Category;
import com.dh.AlquilerAutosMVC.service.ICarService;
import com.dh.AlquilerAutosMVC.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService implements ICategoryService {

    private ICategoryRepository categoryRepository;
    private ICarRepository carRepository;

    @Autowired
    public CategoryService(ICategoryRepository categoryRepository, ICarRepository carRepository) {
        this.categoryRepository = categoryRepository;
        this.carRepository = carRepository;
    }

    public CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        List<Long> carIds = category.getCars().stream()
                .map(Car::getId)
                .collect(Collectors.toList());

        dto.setCars_id(carIds);
        return dto;
    }

    @Override
    public CategoryDTO save(CategoryDTO categoryDTO) {
        Category categoryEntity = new Category();

        List<Car> carList = new ArrayList<>();

        // Recorro lista de IDs
        List<Long> cars_id = categoryDTO.getCars_id();
        for (Long id : cars_id) {
            // Busco auto con esa id
            Optional<Car> car = carRepository.findById(id);

            // CUANDO AGREGUE EL CARDTO TENGO QUE MODIFICAR ESTO
            // Creo y agrego el auto con todos sus atributos
            Car carToAdd = new Car(car.get().getId(),car.get().getName(),
                    car.get().getDescription(),car.get().getImagePaths(),
                    car.get().getCarBrand(), car.get().getPricePerHour(),
                    car.get().getCharacteristics(), car.get().getCategory(),
                    car.get().getCarReservations());
            carList.add(carToAdd);
        }

        // Seteo los atributos de la entidad categoria para instanciarla en la BD
        categoryEntity.setName(categoryDTO.getName());
        categoryEntity.setCars(carList);

        categoryRepository.save(categoryEntity);

        //Ahora vamos a trabajor con el dto a devolver
        CategoryDTO categoryDTOToReturn = new CategoryDTO();

        categoryDTOToReturn.setId(categoryEntity.getId());
        categoryDTOToReturn.setName(categoryEntity.getName());

        // Instanciar la lista a devolver
        List<Long> cars_id_ToReturn = new ArrayList<>();
        // Recorro lista de entidades auto y la paso a lista de ids
        for (Car car : categoryEntity.getCars()) {
            cars_id_ToReturn.add(car.getId());
        }
        categoryDTOToReturn.setCars_id(cars_id_ToReturn);

        return categoryDTOToReturn;
    }

    @Override
    public Optional<CategoryDTO> findById(Long id) throws ResourceNotFoundException {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auto no encontrado"));
        return Optional.of(toDTO(category));
    }

    @Override
    public CategoryDTO update(CategoryDTO categoryDTO) throws ResourceNotFoundException {

        if (categoryRepository.findById(categoryDTO.getId()).isPresent()) {
            Optional<Category> categoryEntity = categoryRepository.findById(categoryDTO.getId());

            categoryEntity.get().setName(categoryDTO.getName());

            List<Car> carList = new ArrayList<>();

            // Recorro lista de IDs
            List<Long> cars_id = categoryDTO.getCars_id();
            for (Long id : cars_id) {
                // Busco auto con esa id
                Optional<Car> car = carRepository.findById(id);

                // CUANDO AGREGUE EL CARDTO TENGO QUE MODIFICAR ESTO
                // Creo y agrego el auto con todos sus atributos
                Car carToAdd = new Car(car.get().getId(),car.get().getName(),
                        car.get().getDescription(),car.get().getImagePaths(),
                        car.get().getCarBrand(), car.get().getPricePerHour(),
                        car.get().getCharacteristics(), car.get().getCategory(),
                        car.get().getCarReservations());
                carList.add(carToAdd);
            }
            categoryEntity.get().setCars(carList);

            categoryRepository.save(categoryEntity.get());

            CategoryDTO categoryDTOToReturn = new CategoryDTO();

            categoryDTOToReturn.setId(categoryEntity.get().getId());
            categoryDTOToReturn.setName(categoryEntity.get().getName());

            List<Long> cars_id_ToReturn = new ArrayList<>();
            // Recorro lista de entidades auto y la paso a lista de ids
            for (Car car : categoryEntity.get().getCars()) {
                cars_id_ToReturn.add(car.getId());
            }
            categoryDTOToReturn.setCars_id(cars_id_ToReturn);

            return categoryDTOToReturn;
        } else {
            throw new ResourceNotFoundException("No se pudo actualizar");
        }
    }

    @Override
    public void delete(Long id) throws RuntimeException {
        Optional<Category> categoryToLookFor = categoryRepository.findById(id);

        if (!categoryToLookFor.isPresent()) {
            // Si no existe ninguna categoría con ese id
            throw new RuntimeException("No se eliminó ya que no se encontró una categoría con el id: " + id);
        }
        else if (!categoryToLookFor.get().getCars().isEmpty()) {
            // Si la categoría no está vacía
            throw new RuntimeException("No se puede eliminar la categoría porque tiene " + categoryToLookFor.get().getCars().size() + " autos asocioados");
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public List<CategoryDTO> findAll() {
        /* List<Category> categoryList = categoryRepository.findAll();

        List<CategoryDTO> categoryDTOS = new ArrayList<>();

        for (Category category : categoryList) {
            // Instanciar la lista a devolver
            List<Long> cars_id_ToReturn = new ArrayList<>();
            // Recorro lista de entidades auto y la paso a lista de ids
            for (Car car : category.getCars()) {
                cars_id_ToReturn.add(car.getId());
            }

            categoryDTOS.add(new CategoryDTO(category.getId(), category.getName(), cars_id_ToReturn));
        }*/

        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        //return categoryDTOS;
    }

    // TODO: AGREGAR
    //  - Buscar por nombre de categoría

    @Override
    public Optional<CategoryDTO> findByName(String name) throws ResourceNotFoundException {
        Optional<Category> categoryToLookFor = categoryRepository.findByName(name);
        Optional<CategoryDTO> categoryDTO = null;

        if (categoryToLookFor.isPresent()) {
            Category category = categoryToLookFor.get();

            CategoryDTO categoryDTOToReturn = new CategoryDTO();
            categoryDTOToReturn.setId(category.getId());
            categoryDTOToReturn.setName(category.getName());
            // Instanciar la lista a devolver
            List<Long> cars_id_ToReturn = new ArrayList<>();
            // Recorro lista de entidades auto y la paso a lista de ids
            for (Car car : category.getCars()) {
                cars_id_ToReturn.add(car.getId());
            }
            categoryDTOToReturn.setCars_id(cars_id_ToReturn);

            categoryDTO = Optional.of(categoryDTOToReturn);
        }
        return categoryDTO;




        /*else {
            throw new ResourceNotFoundException("No se encontró categoría con el nombre: " + name);
        }*/
    }
}
