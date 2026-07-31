package com.example.eventbooking.service;

import com.example.eventbooking.dto.response.CategoryDto;
import com.example.eventbooking.entity.EventCategory;
import com.example.eventbooking.repository.EventCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final EventCategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .slug(c.getSlug())
                        .build())
                .collect(Collectors.toList());
    }

    public CategoryDto createCategory(CategoryDto dto) {
        EventCategory category = EventCategory.builder()
                .name(dto.getName())
                .slug(dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replace(" ", "-"))
                .build();
        category = categoryRepository.save(category);
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }

    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}
