-- V4: Create deliveries table
CREATE TABLE deliveries (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            sales_order_id BIGINT NOT NULL,
                            delivery_date DATETIME NOT NULL,
                            status VARCHAR(20) NOT NULL,
                            notes VARCHAR(500),
                            CONSTRAINT fk_delivery_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id)
);

CREATE INDEX idx_deliveries_order ON deliveries(sales_order_id);