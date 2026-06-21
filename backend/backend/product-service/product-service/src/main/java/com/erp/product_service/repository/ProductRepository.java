package com.erp.product_service.repository;

import com.erp.product_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(String name);
    Boolean existsByName(String name);
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryId(Long categoryId);
}