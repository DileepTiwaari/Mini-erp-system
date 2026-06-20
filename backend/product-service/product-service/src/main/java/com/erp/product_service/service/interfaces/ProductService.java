package com.erp.product_service.service.interfaces;

import com.erp.product_service.dto.request.ProductCreateRequest;
import com.erp.product_service.dto.request.ProductUpdateRequest;
import com.erp.product_service.dto.response.ProductResponse;
import com.erp.product_service.dto.response.StockSummaryResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductCreateRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getActiveProducts();
    ProductResponse updateProduct(Long id, ProductUpdateRequest request);
    void deleteProduct(Long id);
    StockSummaryResponse getStockSummary(Long id);
    List<ProductResponse> getProductsByCategory(Long categoryId);
}