package com.erp.product_service.controller;

import com.erp.product_service.dto.request.ProductCreateRequest;
import com.erp.product_service.dto.request.ProductUpdateRequest;
import com.erp.product_service.dto.response.ProductResponse;
import com.erp.product_service.dto.response.StockSummaryResponse;
import com.erp.product_service.service.interfaces.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<?> createProduct(
            @Valid @RequestBody ProductCreateRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product created successfully",
                "data", product));
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Products fetched successfully",
                "data", products));
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveProducts() {
        List<ProductResponse> products = productService.getActiveProducts();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Active products fetched successfully",
                "data", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product fetched successfully",
                "data", product));
    }

    @GetMapping("/{id}/stock-summary")
    public ResponseEntity<?> getStockSummary(@PathVariable Long id) {
        StockSummaryResponse summary = productService.getStockSummary(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Stock summary fetched successfully",
                "data", summary));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId) {
        List<ProductResponse> products =
                productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Products fetched successfully",
                "data", products));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product updated successfully",
                "data", product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product deleted successfully"));
    }
}