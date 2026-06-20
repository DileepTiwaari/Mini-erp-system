-- V3: Create sales_order_lines table
CREATE TABLE sales_order_lines (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   sales_order_id BIGINT NOT NULL,
                                   product_id BIGINT NOT NULL,
                                   ordered_qty INT NOT NULL,
                                   reserved_qty INT NOT NULL DEFAULT 0,
                                   delivered_qty INT NOT NULL DEFAULT 0,
                                   unit_price DECIMAL(15,2),
                                   CONSTRAINT fk_sales_order_line_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_sales_order_lines_order ON sales_order_lines(sales_order_id);
CREATE INDEX idx_sales_order_lines_product ON sales_order_lines(product_id);