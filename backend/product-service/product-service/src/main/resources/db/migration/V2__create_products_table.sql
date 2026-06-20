CREATE TABLE IF NOT EXISTS products (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sales_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    on_hand_qty DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    reserved_qty DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    free_to_use_qty DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    procurement_type VARCHAR(20) NOT NULL DEFAULT 'PURCHASE',
    procurement_strategy VARCHAR(20) NOT NULL DEFAULT 'MTS',
    procure_on_demand BOOLEAN NOT NULL DEFAULT FALSE,
    category_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );