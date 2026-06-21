-- =========================================================================
-- FlowERP Database Verification Script
-- Run after seed.sql to verify seeded row counts across all databases
-- =========================================================================

USE flowerp_auth;
SELECT COUNT(*) FROM users;

USE flowerp_product;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;

USE flowerp_sales;
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM sales_orders;
SELECT COUNT(*) FROM sales_order_lines;
