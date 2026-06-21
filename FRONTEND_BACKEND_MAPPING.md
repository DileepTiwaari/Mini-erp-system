# Frontend to Backend Endpoint Mapping

This document maps the React frontend API files (located in `src/api/`) to their corresponding microservice endpoints exposed via the Gateway.

---

## 1. Authentication (`src/api/authApi.js`)
| Frontend Call / Method | HTTP Method | Gateway Route Path | Target Service | Purpose |
|------------------------|-------------|--------------------|----------------|---------|
| `authApi.login(credentials)` | `POST` | `/api/auth/login` | `auth-service` | Log in user, get JWT token |
| `authApi.register(userData)` | `POST` | `/api/auth/register` | `auth-service` | Register a new user |
| `authApi.getCurrentUser()` | `GET` | `/api/auth/me` | `auth-service` | Fetch profile of logged-in user |
| `authApi.refreshToken(token)` | `POST` | `/api/auth/refresh-token` | `auth-service` | Refresh expired access token |

---

## 2. Product Management (`src/api/productApi.js` & `src/api/categoryApi.js`)
| Frontend Call / Method | HTTP Method | Gateway Route Path | Target Service | Purpose |
|------------------------|-------------|--------------------|----------------|---------|
| `productApi.getAll()` | `GET` | `/api/products` | `product-service` | Retrieve all products |
| `productApi.getById(id)` | `GET` | `/api/products/{id}` | `product-service` | Retrieve a product by ID |
| `productApi.create(data)` | `POST` | `/api/products` | `product-service` | Create a new product |
| `productApi.update(id, data)` | `PUT` | `/api/products/{id}` | `product-service` | Update an existing product |
| `productApi.delete(id)` | `DELETE` | `/api/products/{id}` | `product-service` | Delete a product |
| `categoryApi.getAll()` | `GET` | `/api/categories` | `product-service` | Retrieve all categories |
| `categoryApi.create(data)` | `POST` | `/api/categories` | `product-service` | Create a category |

---

## 3. Customer Management (`src/api/customerApi.js`)
| Frontend Call / Method | HTTP Method | Gateway Route Path | Target Service | Purpose |
|------------------------|-------------|--------------------|----------------|---------|
| `customerApi.getAll()` | `GET` | `/api/customers` | `sales-service` | Retrieve all customers |
| `customerApi.getById(id)` | `GET` | `/api/customers/{id}` | `sales-service` | Retrieve a customer by ID |
| `customerApi.create(data)` | `POST` | `/api/customers` | `sales-service` | Create a new customer |
| `customerApi.update(id, data)` | `PUT` | `/api/customers/{id}` | `sales-service` | Update a customer |
| `customerApi.delete(id)` | `DELETE` | `/api/customers/{id}` | `sales-service` | Delete a customer |

---

## 4. Sales Orders (`src/api/salesApi.js`)
| Frontend Call / Method | HTTP Method | Gateway Route Path | Target Service | Purpose |
|------------------------|-------------|--------------------|----------------|---------|
| `salesApi.getAll()` | `GET` | `/api/sales-orders` | `sales-service` | Retrieve all sales orders |
| `salesApi.getById(id)` | `GET` | `/api/sales-orders/{id}` | `sales-service` | Retrieve an order by ID |
| `salesApi.create(data)` | `POST` | `/api/sales-orders` | `sales-service` | Create a new draft sales order |
| `salesApi.confirm(id)` | `PUT` | `/api/sales-orders/{id}/confirm` | `sales-service` | Confirm order and allocate stock |
| `salesApi.cancel(id)` | `PUT` | `/api/sales-orders/{id}/cancel` | `sales-service` | Cancel order and release stock |

---

## 5. Dashboard (`src/api/dashboardApi.js`)
For our demo layout, dashboard metrics (total products, total customers, total orders, sales revenue) are aggregated directly in the frontend from active services:
* Gets list of products from `/api/products` (calculates count)
* Gets list of customers from `/api/customers` (calculates count)
* Gets list of orders from `/api/sales-orders` (calculates count and sums up revenue)
This guarantees a fully operational dashboard without needing a separate reporting service.
