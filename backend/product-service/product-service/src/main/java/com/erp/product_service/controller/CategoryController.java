package com.erp.product_service.controller;

import com.erp.product_service.entity.Category;
import com.erp.product_service.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestParam String name,
            @RequestParam(required = false) String description) {
        Category category = categoryService.createCategory(name, description);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category created successfully",
                "data", category));
    }

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Categories fetched successfully",
                "data", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category fetched successfully",
                "data", category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description) {
        Category category = categoryService.updateCategory(id, name, description);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category updated successfully",
                "data", category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Category deleted successfully"));
    }
}