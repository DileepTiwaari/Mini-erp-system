package com.erp.product_service.service.impl;

import com.erp.product_service.entity.Category;
import com.erp.product_service.exception.DuplicateProductException;
import com.erp.product_service.exception.ProductNotFoundException;
import com.erp.product_service.repository.CategoryRepository;
import com.erp.product_service.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(String name, String description) {
        if (categoryRepository.existsByName(name)) {
            throw new DuplicateProductException(
                    "Category already exists: " + name);
        }
        Category category = Category.builder()
                .name(name)
                .description(description)
                .isActive(true)
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Category not found with id: " + id));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category updateCategory(Long id, String name, String description) {
        Category category = getCategoryById(id);
        if (name != null) category.setName(name);
        if (description != null) category.setDescription(description);
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}