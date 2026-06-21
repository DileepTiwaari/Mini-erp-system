# FlowERP API Documentation

Welcome to the **FlowERP** API Documentation. This document provides complete REST API documentation for all modules in FlowERP, exposed through the API Gateway at `http://localhost:8080` (production/gateway URL) or direct microservices dev ports.

---

## 🌐 Global API Configuration
* **Gateway Base URL:** `http://localhost:8080/api`
* **Content-Type:** `application/json`
* **Security:** JWT-based Bearer Token propagation. Header: `Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 AUTH MODULE (`auth-service`)

### 1. User Registration
* **Endpoint URL:** `/auth/register`
* **HTTP Method:** `POST`
* **Description:** Register a new user in the ERP system.
* **Authentication Required:** No
* **Required Role:** Any
* **Request Headers:**
  - `Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "username": "erp_admin",
    "email": "admin@flowerp.com",
    "password": "password123",
    "role": "ADMIN"
  }
  ```
* **Validation Rules:**
  - `username`: Not Blank, Unique
  - `email`: Not Blank, Valid Email format, Unique
  - `password`: Not Blank, Min length 6
  - `role`: Must be one of `ADMIN`, `OWNER`, `SALES_USER`, `PURCHASE_USER`, `MANUFACTURING_USER`, `INVENTORY_MANAGER`.
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "4ba7f78a-3438-4d11-abf3-82e0f13f389d",
      "tokenType": "Bearer",
      "user": {
        "id": 1,
        "username": "erp_admin",
        "email": "admin@flowerp.com",
        "role": "ADMIN",
        "isActive": true
      }
    }
  }
  ```
* **Error Response Example (400 Bad Request - Duplicate Username):**
  ```json
  {
    "success": false,
    "message": "Username already exists: erp_admin"
  }
  ```
* **Database Tables Affected:** `flowerp_auth.users`

---

### 2. User Login
* **Endpoint URL:** `/auth/login`
* **HTTP Method:** `POST`
* **Description:** Authenticate user and issue JWT and Refresh Tokens.
* **Authentication Required:** No
* **Request Headers:**
  - `Content-Type: application/json`
* **Request Body Example:**
  ```json
  {
    "username": "erp_admin",
    "password": "password123"
  }
  ```
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "4ba7f78a-3438-4d11-abf3-82e0f13f389d",
      "tokenType": "Bearer",
      "user": {
        "id": 1,
        "username": "erp_admin",
        "email": "admin@flowerp.com",
        "role": "ADMIN",
        "isActive": true
      }
    }
  }
  ```
* **Error Response Example (401 Unauthorized - Invalid Credentials):**
  ```json
  {
    "success": false,
    "message": "Invalid username or password"
  }
  ```
* **Database Tables Affected:** `flowerp_auth.users`, `flowerp_auth.refresh_tokens`

---

### 3. Get Current User Profile
* **Endpoint URL:** `/auth/me`
* **HTTP Method:** `GET`
* **Description:** Retrieve details of the currently logged-in user.
* **Authentication Required:** Yes
* **Required Role:** Any
* **Request Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Current user fetched successfully",
    "data": {
      "id": 1,
      "fullName": "erp_admin",
      "email": "admin@flowerp.com",
      "role": "ADMIN"
    }
  }
  ```
* **Database Tables Affected:** `flowerp_auth.users`

---

### 4. Refresh Token
* **Endpoint URL:** `/auth/refresh-token`
* **HTTP Method:** `POST`
* **Description:** Generate a new JWT Access Token using a valid Refresh Token.
* **Authentication Required:** No
* **Request Body Example:**
  ```json
  {
    "refreshToken": "4ba7f78a-3438-4d11-abf3-82e0f13f389d"
  }
  ```
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "7c0500bf-bc27-4632-9cb7-7fb96720d1e3",
      "tokenType": "Bearer"
    }
  }
  ```
* **Database Tables Affected:** `flowerp_auth.refresh_tokens`

---

### 5. Logout User
* **Endpoint URL:** `/auth/logout`
* **HTTP Method:** `POST`
* **Description:** Revoke the active user session and delete related Refresh Tokens.
* **Authentication Required:** Yes
* **Request Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
* **Database Tables Affected:** `flowerp_auth.refresh_tokens`

---

## 📦 PRODUCT MODULE (`product-service`)

### 1. Categories CRUD

#### Create Category
* **Endpoint URL:** `/categories`
* **HTTP Method:** `POST`
* **Description:** Register a new catalog category.
* **Authentication Required:** Yes
* **Request Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
* **Query Parameters:**
  - `name`: Category Name (Required)
  - `description`: Category Description (Optional)
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "id": 1,
      "name": "Raw Materials",
      "description": "Unfinished metals and raw inputs"
    }
  }
  ```
* **Database Tables Affected:** `flowerp_product.categories`

#### Get All Categories
* **Endpoint URL:** `/categories`
* **HTTP Method:** `GET`
* **Description:** List all categories in the system.
* **Authentication Required:** Yes
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Categories fetched successfully",
    "data": [
      {
        "id": 1,
        "name": "Raw Materials",
        "description": "Unfinished metals and raw inputs"
      }
    ]
  }
  ```

---

### 2. Products CRUD

#### Create Product
* **Endpoint URL:** `/products`
* **HTTP Method:** `POST`
* **Description:** Register a new product in the master catalog.
* **Authentication Required:** Yes
* **Request Body Example:**
  ```json
  {
    "name": "Copper Wire Coil 1.5mm",
    "description": "Heavy-duty electric copper wire",
    "salesPrice": 12.50,
    "costPrice": 4.20,
    "onHandQty": 500,
    "categoryId": 1,
    "procurementType": "PURCHASE",
    "procurementStrategy": "MTS",
    "procureOnDemand": false
  }
  ```
* **Validation Rules:**
  - `name`: Not Blank, Unique
  - `salesPrice`: Not Null, Non-negative
  - `costPrice`: Not Null, Non-negative
  - `onHandQty`: Non-negative
  - `procurementType`: Sourcing type (`PURCHASE` or `MANUFACTURING`)
  - `procurementStrategy`: Inventory strategy (`MTS` or `MTO`)
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": 1,
      "name": "Copper Wire Coil 1.5mm",
      "description": "Heavy-duty electric copper wire",
      "salesPrice": 12.50,
      "costPrice": 4.20,
      "onHandQty": 500.0,
      "reservedQty": 0.0,
      "freeToUseQty": 500.0,
      "procurementType": "PURCHASE",
      "procurementStrategy": "MTS",
      "procureOnDemand": false,
      "categoryId": 1,
      "categoryName": "Raw Materials",
      "isActive": true
    }
  }
  ```
* **Database Tables Affected:** `flowerp_product.products`

#### Get All Products
* **Endpoint URL:** `/products`
* **HTTP Method:** `GET`
* **Description:** Retrieve the catalog list of products.
* **Authentication Required:** Yes

#### Update Product
* **Endpoint URL:** `/products/{id}`
* **HTTP Method:** `PUT`
* **Description:** Modify pricing, description, stock quantities, or sourcing paths of a product.
* **Path Parameters:**
  - `id`: Product Primary ID (Required)
* **Request Body Example:**
  ```json
  {
    "name": "Copper Wire Coil 1.5mm",
    "description": "Heavy-duty electric copper wire - Grade A",
    "salesPrice": 14.00,
    "costPrice": 4.20,
    "procurementType": "PURCHASE",
    "procurementStrategy": "MTS",
    "categoryId": 1,
    "isActive": true
  }
  ```

---

## 👥 CUSTOMER MODULE (`sales-service`)

### 1. Create Customer
* **Endpoint URL:** `/customers`
* **HTTP Method:** `POST`
* **Description:** Add a new client profile.
* **Authentication Required:** Yes
* **Request Body Example:**
  ```json
  {
    "name": "Tesla Motors Inc",
    "email": "billing@tesla.com",
    "phone": "+1-800-555-0144",
    "address": "1 Tesla Road, Austin, TX"
  }
  ```
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer created successfully",
    "data": {
      "id": 1,
      "name": "Tesla Motors Inc",
      "email": "billing@tesla.com",
      "phone": "+1-800-555-0144",
      "address": "1 Tesla Road, Austin, TX"
    }
  }
  ```
* **Database Tables Affected:** `flowerp_sales.customers`

### 2. Get All Customers
* **Endpoint URL:** `/customers`
* **HTTP Method:** `GET`
* **Description:** Get all registered customer profiles (Paginated).
* **Query Parameters:**
  - `page`: Page index (Default: `0`)
  - `size`: Page limit size (Default: `20`)
  - `sort`: Sorting field (Default: `id`)
* **Success Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customers fetched successfully",
    "data": {
      "content": [
        {
          "id": 1,
          "name": "Tesla Motors Inc",
          "email": "billing@tesla.com",
          "phone": "+1-800-555-0144",
          "address": "1 Tesla Road, Austin, TX"
        }
      ],
      "totalPages": 1,
      "totalElements": 1,
      "size": 20,
      "number": 0
    }
  }
  ```

---

## 🛍️ SALES MODULE (`sales-service`)

### 1. Create Sales Order (Draft Quote)
* **Endpoint URL:** `/sales-orders`
* **HTTP Method:** `POST`
* **Description:** Record a new quotation request draft.
* **Authentication Required:** Yes
* **Request Body Example:**
  ```json
  {
    "customerId": 1,
    "lines": [
      {
        "productId": 1,
        "qty": 50
      }
    ]
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Sales order created successfully",
    "data": {
      "id": 1,
      "orderNumber": "SO-20260621-0001",
      "customerId": 1,
      "status": "DRAFT",
      "totalAmount": 700.00,
      "lines": [
        {
          "id": 1,
          "productId": 1,
          "qty": 50,
          "price": 14.00,
          "subtotal": 700.00
        }
      ],
      "orderDate": "2026-06-21"
    }
  }
  ```
* **Database Tables Affected:** `flowerp_sales.sales_orders`, `flowerp_sales.sales_order_lines`

---

### 2. Confirm Sales Order
* **Endpoint URL:** `/sales-orders/{id}/confirm`
* **HTTP Method:** `POST`
* **Description:** Confirm order, allocate stock, and increase product's `reservedQty`.
* **Authentication Required:** Yes
* **Path Parameters:**
  - `id`: Sales Order ID (Required)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Sales order confirmed",
    "data": {
      "id": 1,
      "orderNumber": "SO-20260621-0001",
      "status": "CONFIRMED",
      "totalAmount": 700.00
    }
  }
  ```
* **Database Tables Affected:** `flowerp_sales.sales_orders`, `flowerp_product.products` (via Feign Client update to reserved/free stock)

---

### 3. Cancel Sales Order
* **Endpoint URL:** `/sales-orders/{id}/cancel`
* **HTTP Method:** `POST`
* **Description:** Cancel quotation and release stock reservations back to free stock.
* **Authentication Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Sales order cancelled",
    "data": {
      "id": 1,
      "status": "CANCELLED"
    }
  }
  ```

---

### 4. Record Dispatch Shipment (Delivery)
* **Endpoint URL:** `/sales-orders/{id}/deliver`
* **HTTP Method:** `POST`
* **Description:** Record dispatch shipment lines, deduct physical inventory `onHandQty`, and update order delivery state.
* **Authentication Required:** Yes
* **Request Body Example:**
  ```json
  {
    "lines": [
      {
        "salesOrderLineId": 1,
        "deliveredQty": 50
      }
    ]
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Delivery recorded successfully",
    "data": {
      "id": 1,
      "salesOrderId": 1,
      "deliveryNumber": "DLV-001",
      "deliveryDate": "2026-06-21",
      "status": "DELIVERED",
      "lines": [
        {
          "salesOrderLineId": 1,
          "deliveredQty": 50
        }
      ]
    }
  }
  ```
* **Database Tables Affected:** `flowerp_sales.deliveries`, `flowerp_sales.delivery_lines`, `flowerp_product.products` (stock counts deducted)

---

## 📊 DASHBOARD MODULE (Frontend Aggregation)

The FlowERP dashboard gathers analytics dynamically using client-side parallel promise groupings, keeping metrics accurate without a dedicated reporting microservice.

### Aggregated KPIs Calculation Formulas:
1. **Total Sales Orders:** Length of array returned by `GET /api/sales-orders`
2. **Total Customers:** Length of array returned by `GET /api/customers`
3. **Total Products:** Length of array returned by `GET /api/products`
4. **Confirmed Revenue:** Sum of `totalAmount` for all orders where status matches `CONFIRMED` or `FULLY_DELIVERED` or `PARTIALLY_DELIVERED`.
5. **Low Stock Items Alert:** Count of products where `stock <= minStock`.

---

## 🛠️ SIMULATED MODULES (Client-Side Mock Fallback)
For the following modules, when the corresponding microservice is simulated, standard business service endpoints default to `mockDb` client-side databases:

### 1. PURCHASE MODULE
* **Get Purchase Orders:** `GET /api/purchases` (fallback to `mockDb.getAll(DB_KEYS.PURCHASES)`)
* **Get Vendors:** `GET /api/vendors` (fallback to `mockDb.getAll(DB_KEYS.VENDORS)`)

### 2. INVENTORY MODULE
* **Get Inventory Ledgers:** `GET /api/inventory` (fallback to `mockDb.getAll(DB_KEYS.INVENTORY_LEDGER)`)
* **Adjust Stock Levels:** `POST /api/inventory/adjust` (fallback to `mockDb.update(...)`)

### 3. MANUFACTURING MODULE
* **Get Bill of Materials (BOM):** `GET /api/bom` (fallback to `mockDb.getAll(DB_KEYS.BOMS)`)
* **Get Manufacturing Work Orders:** `GET /api/manufacturing` (fallback to `mockDb.getAll(DB_KEYS.MANUFACTURING)`)

### 4. PROCUREMENT MODULE
* **Get Sourcing Recommendations:** `GET /api/procurement` (derived client-side)

### 5. AUDIT MODULE
* **Get Audit Activity logs:** `GET /api/audit-logs` (fallback to `mockDb.getAll(DB_KEYS.AUDIT_LOGS)`)

---

## 📋 API Integration Matrix
This table maps frontend code requests directly to backend REST endpoints:

| Frontend File / Call | Method | Gateway Endpoint | target Microservice |
|----------------------|--------|------------------|---------------------|
| `authApi.login` | `POST` | `/api/auth/login` | `auth-service` |
| `authApi.register` | `POST` | `/api/auth/register` | `auth-service` |
| `authApi.getMe` | `GET` | `/api/auth/me` | `auth-service` |
| `productApi.getAll` | `GET` | `/api/products` | `product-service` |
| `productApi.create` | `POST` | `/api/products` | `product-service` |
| `productApi.update` | `PUT` | `/api/products/{id}` | `product-service` |
| `categoryApi.getAll` | `GET` | `/api/categories` | `product-service` |
| `categoryApi.create` | `POST` | `/api/categories` | `product-service` |
| `customerApi.getAll` | `GET` | `/api/customers` | `sales-service` |
| `customerApi.create` | `POST` | `/api/customers` | `sales-service` |
| `salesApi.getAll` | `GET` | `/api/sales-orders` | `sales-service` |
| `salesApi.create` | `POST` | `/api/sales-orders` | `sales-service` |
| `salesApi.confirm` | `POST` | `/api/sales-orders/{id}/confirm` | `sales-service` |
| `salesApi.cancel` | `POST` | `/api/sales-orders/{id}/cancel` | `sales-service` |
| `salesApi.deliver` | `POST` | `/api/sales-orders/{id}/deliver` | `sales-service` |

---

## 📁 Swagger/OpenAPI Spec Listing
Each microservice exposes local Swagger documentation and JSON API schemas:
* **Auth Service Spec:** `http://localhost:8081/swagger-ui/index.html` (JSON: `http://localhost:8081/api-docs`)
* **Product Service Spec:** `http://localhost:8082/swagger-ui/index.html` (JSON: `http://localhost:8082/api-docs`)
* **Sales Service Spec:** `http://localhost:8084/swagger-ui/index.html` (JSON: `http://localhost:8084/api-docs`)

---

## 📮 Postman Collection Examples

Copy these raw requests directly into your Postman interface:

### 1. Register Account
```
Method: POST
URL: http://localhost:8080/api/auth/register
Headers: Content-Type: application/json
Body:
{
  "username": "tester",
  "email": "tester@flowerp.com",
  "password": "password123",
  "role": "ADMIN"
}
```

### 2. Login Account
```
Method: POST
URL: http://localhost:8080/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "username": "tester",
  "password": "password123"
}
```

### 3. Create Product Category
```
Method: POST
URL: http://localhost:8080/api/categories?name=Finished Goods&description=Completed assemblies
Headers: 
  Authorization: Bearer <JWT_TOKEN>
```

### 4. Add Product
```
Method: POST
URL: http://localhost:8080/api/products
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "name": "Electric Motor 1HP",
  "description": "Standard induction motor",
  "salesPrice": 150.00,
  "costPrice": 62.00,
  "onHandQty": 20,
  "categoryId": 1,
  "procurementType": "MANUFACTURING",
  "procurementStrategy": "MTS",
  "procureOnDemand": false
}
```

### 5. Register Customer
```
Method: POST
URL: http://localhost:8080/api/customers
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "name": "General Electric",
  "email": "orders@ge.com",
  "phone": "+1-888-293-1022",
  "address": "5 Space Park, Boston, MA"
}
```

### 6. Create Sales Order
```
Method: POST
URL: http://localhost:8080/api/sales-orders
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "customerId": 1,
  "lines": [
    {
      "productId": 1,
      "qty": 5
    }
  ]
}
```

### 7. Confirm Sales Order
```
Method: POST
URL: http://localhost:8080/api/sales-orders/1/confirm
Headers:
  Authorization: Bearer <JWT_TOKEN>
```

---

## 🏃 Demo Testing Flow

Follow these sequential steps to demonstrate a full transactional cycle in FlowERP:

### Step 1: Register User
* Register a new user role `ADMIN` at `/api/auth/register`. Keep the returned `accessToken`.

### Step 2: Login
* Authenticate credentials via `/api/auth/login`. Verify that a successful Bearer Token response is generated.

### Step 3: Create Category
* Create a category division `Finished Assemblies` (e.g. via `POST /api/categories?name=Assemblies`).

### Step 4: Create Product
* Create a product `Electric Motor 1HP` with category referencing Category ID `1`, `onHandQty` set to `100`, and `procurementType: MANUFACTURING`.

### Step 5: Create Customer
* Add a customer `General Motors Corp` via `POST /api/customers`. Remember returned Customer ID `1`.

### Step 6: Create Sales Order
* Create a draft sales order quoting `5` quantities of `Electric Motor 1HP` (Product ID `1`) for `General Motors` (Customer ID `1`). Status defaults to `DRAFT`.

### Step 7: Confirm Sales Order
* Trigger `POST /api/sales-orders/1/confirm`. 
* Verify that the order status transitions to `CONFIRMED`.
* Verify that the product's `reservedQty` increases to `5` and `freeToUseQty` falls to `95`.

### Step 8: Verify Dashboard
* Load the Dashboard view. Verify that the summary counts show:
  - **Sales Orders:** `1`
  - **Total Customers:** `1`
  - **Total Products:** `1`
  - **Revenue:** `$750.00` (Product price 150.00 * qty 5)

---

## 🗄️ Database Verification Queries

Run these SQL scripts against target MySQL databases to audit database record insertion consistency:

### 1. Authenticated User Profiles
```sql
-- Database: flowerp_auth
USE flowerp_auth;
SELECT id, username, email, role, is_active FROM users;
```

### 2. Catalog Divisions
```sql
-- Database: flowerp_product
USE flowerp_product;
SELECT id, name, description FROM categories;
```

### 3. Catalog Sourcing Inventory
```sql
-- Database: flowerp_product
USE flowerp_product;
SELECT id, name, sales_price, cost_price, on_hand_qty, reserved_qty, free_to_use_qty FROM products;
```

### 4. Client Contacts
```sql
-- Database: flowerp_sales
USE flowerp_sales;
SELECT id, name, email, phone, address FROM customers;
```

### 5. Sales Orders status
```sql
-- Database: flowerp_sales
USE flowerp_sales;
SELECT id, order_number, customer_id, status, total_amount, order_date FROM sales_orders;
SELECT id, sales_order_id, product_id, qty, price, subtotal FROM sales_order_lines;
```
