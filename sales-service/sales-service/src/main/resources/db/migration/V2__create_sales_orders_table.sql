-- V2: Create sales_orders table
CREATE TABLE sales_orders (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              order_number VARCHAR(30) NOT NULL UNIQUE,
                              customer_id BIGINT NOT NULL,
                              order_date DATETIME NOT NULL,
                              status VARCHAR(30) NOT NULL,
                              total_amount DECIMAL(15,2) DEFAULT 0,
                              created_at DATETIME NOT NULL,
                              updated_at DATETIME NOT NULL,
                              CONSTRAINT fk_sales_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);