-- V1: Create customers table
CREATE TABLE customers (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(150) NOT NULL,
                           email VARCHAR(150) UNIQUE,
                           phone VARCHAR(20),
                           address VARCHAR(255),
                           created_at DATETIME NOT NULL,
                           updated_at DATETIME NOT NULL
);