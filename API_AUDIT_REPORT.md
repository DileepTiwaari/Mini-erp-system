# FlowERP API Audit Report

This report presents a thorough audit of the API mapping, endpoint cleanliness, ports configuration, and backend service verification in the FlowERP platform before production submission.

---

## 📋 Executive Summary
We have audited the connections between the React SPA frontend and the running microservices on the backend. The API Gateway is active at port `8080` and dynamically forwards all `/api/**` request calls to their registered microservices on Eureka.

* **Gateway Status:** Active (`http://localhost:8080`)
* **Eureka Registry Status:** Active (`http://localhost:8761`)
* **Service Ports Cleanliness:** 100% verified. No remnants of obsolete direct microservice ports or port `5000` exist in the frontend source code. All network calls correctly route through the Gateway.

---

## 🔍 Microservice Port Mapping & Registry Status

| Service Name | Port | Eureka Status | Description / Purpose |
|--------------|------|---------------|-----------------------|
| `eureka-server` | `8761` | 🟢 Active | Service Discovery Registry |
| `api-gateway` | `8080` | 🟢 Active | API routing gateway and proxy |
| `auth-service` | `8081` | 🟢 Registered | Identity management & JWT claims |
| `product-service`| `8082` | 🟢 Registered | Master catalog & Category hierarchies |
| `sales-service` | `8084` | 🟢 Registered | Customer profiles & Sales order flow |

---

## 🚀 Endpoint Verification Matrix

Each frontend service mapping is verified against a live Gateway path and active backend controller:

| Frontend API File | Method / Call | Gateway Path | Target Microservice Controller | Status |
|-------------------|---------------|--------------|-------------------|--------|
| `authApi.js` | `login` | `POST /api/auth/login` | `AuthController.login()` | 🟢 Verified & Connected |
| `authApi.js` | `register` | `POST /api/auth/register` | `AuthController.register()` | 🟢 Verified & Connected |
| `authApi.js` | `getMe` | `GET /api/auth/me` | `AuthController.getCurrentUser()` | 🟢 Verified & Connected |
| `productApi.js` | `getAll` | `GET /api/products` | `ProductController.getAllProducts()` | 🟢 Verified & Connected |
| `productApi.js` | `create` | `POST /api/products` | `ProductController.createProduct()` | 🟢 Verified & Connected |
| `productApi.js` | `update` | `PUT /api/products/{id}` | `ProductController.updateProduct()` | 🟢 Verified & Connected |
| `categoryApi.js` | `getAll` | `GET /api/categories` | `CategoryController.getAllCategories()` | 🟢 Verified & Connected |
| `categoryApi.js` | `create` | `POST /api/categories` | `CategoryController.createCategory()` | 🟢 Verified & Connected |
| `customerApi.js` | `getCustomers`| `GET /api/customers` | `CustomerController.getAllCustomers()` | 🟢 Verified & Connected |
| `salesApi.js` | `getOrders` | `GET /api/sales-orders` | `SalesOrderController.getAllSalesOrders()` | 🟢 Verified & Connected |
| `salesApi.js` | `confirmOrder`| `POST /api/sales-orders/{id}/confirm` | `SalesOrderController.confirmSalesOrder()` | 🟢 Verified & Connected |
| `salesApi.js` | `cancelOrder` | `POST /api/sales-orders/{id}/cancel` | `SalesOrderController.cancelSalesOrder()` | 🟢 Verified & Connected |
| `salesApi.js` | `deliver` | `POST /api/sales-orders/{id}/deliver` | `DeliveryController.deliverSalesOrder()` | 🟢 Verified & Connected |

---

## 🧼 Code Cleanliness & Mismatch Auditing

* **Port 5000 Audit:** Grepped `src/` directory. Found `0` occurrences of `localhost:5000`.
* **Port 8081/8082/8084 Direct Connection Check:** Grepped `src/` directory. Found `0` direct references to individual microservice ports. All URLs correctly utilize the global `axiosInstance` base endpoint (`http://localhost:8080/api`).
* **Request/Response Wrappers Check:** Checked that frontend services successfully extract `.data` property from unified `ApiResponse` envelopes returning `res.data.data` (or `.content` for Spring Data page mappings) to prevent view screen list crashes.
