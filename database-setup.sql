-- ============================================================
-- FlowERP Database Setup Script
-- Run this script as MySQL root user to create all required
-- databases. Flyway migrations will handle table creation.
-- ============================================================

-- Auth Service Database
CREATE DATABASE IF NOT EXISTS flowerp_auth
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Product Service Database
CREATE DATABASE IF NOT EXISTS flowerp_product
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Sales Service Database
CREATE DATABASE IF NOT EXISTS flowerp_sales
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Grant privileges (if using root, these are already available)
-- GRANT ALL PRIVILEGES ON flowerp_auth.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON flowerp_product.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON flowerp_sales.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================
-- Verification: Run after script execution
-- ============================================================
-- SHOW DATABASES LIKE 'flowerp_%';
-- Expected output:
--   flowerp_auth
--   flowerp_product
--   flowerp_sales
-- ============================================================
