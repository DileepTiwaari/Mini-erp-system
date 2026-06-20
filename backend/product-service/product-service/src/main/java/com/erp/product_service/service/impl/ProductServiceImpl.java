package com.erp.product_service.service.impl;

import com.erp.product_service.dto.request.ProductCreateRequest;
import com.erp.product_service.dto.request.ProductUpdateRequest;
import com.erp.product_service.dto.response.ProductResponse;
import com.erp.product_service.dto.response.StockSummaryResponse;
import com.erp.product_service.entity.Category;
import com.erp.product_service.entity.Product;
import com.erp.product_service.exception.DuplicateProductException;
import com.erp.product_service.exception.ProductNotFoundException;
import com.erp.product_service.repository.CategoryRepository;
import com.erp.product_service.repository.ProductRepository;
import com.erp.product_service.service.interfaces.ProductService;
import com.erp.product_service.util.ProductUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateProductException(
                    "Product already exists: " + request.getName());
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ProductNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .salesPrice(request.getSalesPrice())
                .costPrice(request.getCostPrice())
                .onHandQty(request.getOnHandQty())
                .reservedQty(java.math.BigDecimal.ZERO)
                .freeToUseQty(request.getOnHandQty())
                .procurementType(request.getProcurementType())
                .procurementStrategy(request.getProcurementStrategy())
                .procureOnDemand(request.getProcureOnDemand())
                .category(category)
                .isActive(true)
                .build();

        productRepository.save(product);
        return mapToProductResponse(product);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with id: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getSalesPrice() != null)
            product.setSalesPrice(request.getSalesPrice());
        if (request.getCostPrice() != null)
            product.setCostPrice(request.getCostPrice());
        if (request.getProcurementType() != null)
            product.setProcurementType(request.getProcurementType());
        if (request.getProcurementStrategy() != null)
            product.setProcurementStrategy(request.getProcurementStrategy());
        if (request.getProcureOnDemand() != null)
            product.setProcureOnDemand(request.getProcureOnDemand());
        if (request.getIsActive() != null)
            product.setIsActive(request.getIsActive());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ProductNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.updateFreeToUseQty();
        productRepository.save(product);
        return mapToProductResponse(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Override
    public StockSummaryResponse getStockSummary(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with id: " + id));
        return StockSummaryResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .onHandQty(product.getOnHandQty())
                .reservedQty(product.getReservedQty())
                .freeToUseQty(ProductUtil.calculateFreeToUseQty(
                        product.getOnHandQty(), product.getReservedQty()))
                .build();
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .salesPrice(product.getSalesPrice())
                .costPrice(product.getCostPrice())
                .onHandQty(product.getOnHandQty())
                .reservedQty(product.getReservedQty())
                .freeToUseQty(product.getFreeToUseQty())
                .procurementType(product.getProcurementType())
                .procurementStrategy(product.getProcurementStrategy())
                .procureOnDemand(product.getProcureOnDemand())
                .categoryId(product.getCategory() != null ?
                        product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ?
                        product.getCategory().getName() : null)
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}