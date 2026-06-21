# FlowERP Backend — Complete Architecture Analysis Report

**Analyst**: Senior Java Spring Boot Architect  
**Date**: 2026-06-21  
**Scope**: Full static analysis of all 12 microservices (READ-ONLY — no code was modified)

---

## A. COMPLETE BACKEND ARCHITECTURE REPORT

### Overall Architecture

```
                        ┌─────────────────────────────────────────┐
                        │           Eureka Server :8761            │
                        │    (Service Discovery Registry)          │
                        └──────────────────┬──────────────────────┘
                                           │ register/heartbeat
          ┌─────────────────────────────────┼──────────────────────────────┐
          │                                 │                              │
  ┌───────▼────────┐              ┌─────────▼──────────┐        ┌─────────▼──────┐
  │  Config Server │              │    API Gateway      │        │  Auth Service  │
  │     :8888      │              │       :8080         │        │    :8081       │
  │ (native config)│              │  (Spring Cloud GW)  │        │  MySQL:3306    │
  └────────────────┘              │  JWT auth, routing  │        │  erp_auth_db   │
                                  └─────────┬───────────┘        └────────────────┘
                                            │ routes to
        ┌───────────────┬───────────────────┼───────────────────┬──────────────┐
        │               │                   │                   │              │
┌───────▼──────┐ ┌──────▼──────┐  ┌────────▼───────┐ ┌────────▼───────┐ ┌────▼────────────────┐
│Product Service│ │Sales Service│  │Purchase Service│ │Inventory Svc   │ │Manufacturing/        │
│   :8082       │ │ :MISSING    │  │  :MISSING      │ │  :MISSING      │ │Procurement/Audit/BOM │
│ erp_product_db│ │ STUB         │  │  STUB (broken) │ │  STUB          │ │  ALL STUBS           │
└───────────────┘ └─────────────┘  └────────────────┘ └────────────────┘ └──────────────────────┘
```

### Repository / Directory Structure

```
backend/
├── api-gateway/api-gateway/           ← Spring Cloud Gateway (SB 3.2.0)
├── auth-service/auth-service/          ← Auth + JWT (SB 3.2.0) ✅ READY
├── bom-service/bom-service/            ← Bill of Materials (SB 4.1.0) ⚠️ STUB
├── config-server/config-server/        ← Spring Cloud Config (SB 3.2.0)
├── eureka-server/eureka-server/        ← Netflix Eureka (SB 3.2.0) ✅ READY
├── inventory-service/inventory-service/ ← Inventory (SB 4.1.0) ⚠️ STUB
├── manufacturing-service/manufacturing-service/ ← Manufacturing (SB 4.1.0) ⚠️ STUB
├── procurement-service/procurement-service/     ← Procurement (SB 4.1.0) ⚠️ STUB
├── product-service/product-service/    ← Products (SB 3.2.0) ✅ READY (minor issues)
├── purchase-service/purchase-service/  ← Purchase Orders (SB 4.1.0) ❌ BUILD BROKEN
├── sales-service/sales-service/        ← Sales Orders (SB 4.1.0) ❌ CANNOT START
├── audit-service/audit-service/        ← Audit Log (SB 4.1.0) ⚠️ STUB
└── backend/                            ← ⚠️ DUPLICATE COPY (untracked shadow folder)
    └── [all 12 services duplicated]
```

**CRITICAL STRUCTURAL ISSUE**: The directory `backend/backend/` contains a complete duplicate of all 12 services. This is a dangling copy that causes confusion. There is no parent `pom.xml` at the root — the project is NOT a multi-module Maven project. Each service is a fully standalone Maven project.

### Spring Boot / Spring Cloud Version Matrix

| Service | Spring Boot | Spring Cloud | Java | Status |
|---|---|---|---|---|
| eureka-server | **3.2.0** | 2023.0.0 | 17 | Stable |
| config-server | **3.2.0** | 2023.0.0 | 17 | Stable |
| api-gateway | **3.2.0** | 2023.0.0 | 17 | Stable |
| auth-service | **3.2.0** | 2023.0.0 | 17 | Stable |
| product-service | **3.2.0** | 2023.0.0 | 17 | Stable |
| sales-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| inventory-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| purchase-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| manufacturing-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| procurement-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| audit-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |
| bom-service | **4.1.0** ❌ | 2025.1.2 ❌ | 17 | INVALID — does not exist |

> **Spring Boot 4.x and Spring Cloud 2025.x do NOT exist.** The latest stable versions are Spring Boot 3.3.x and Spring Cloud 2023.0.x. Maven will fail to resolve these artifacts from Maven Central. All 7 services using version 4.1.0 will fail to build.

---

## B. COMPLETE LIST OF COMPILE ERRORS

### B-1. purchase-service — Non-Existent Maven Artifacts (FATAL BUILD FAILURE)

The `purchase-service/pom.xml` references artifacts that do not exist in any Maven repository:

| Line | Invalid Artifact | Correct Replacement |
|---|---|---|
| Test dep | `spring-boot-starter-actuator-test` | `spring-boot-starter-test` |
| Test dep | `spring-boot-starter-data-jpa-test` | `spring-boot-starter-test` |
| Test dep | `spring-boot-starter-flyway-test` | `spring-boot-starter-test` |
| Test dep | `spring-boot-starter-validation-test` | `spring-boot-starter-test` |
| Test dep | `spring-boot-starter-webmvc-test` | `spring-boot-starter-test` |
| Main dep | `spring-boot-starter-webmvc` | `spring-boot-starter-web` |
| Main dep | `spring-boot-starter-flyway` | `flyway-core` |

> Same invalid test artifacts appear in `inventory-service`, `manufacturing-service`, `procurement-service`, `audit-service`, `bom-service` pom files — all 6 services will fail to resolve dependencies.

### B-2. Spring Boot 4.1.0 / Spring Cloud 2025.1.2 Resolution Failure

All 7 services using version `4.1.0` will fail at the `mvn dependency:resolve` or `mvn package` phase:

```
[ERROR] Failed to execute goal on project sales-service: 
Could not resolve dependencies for project com.erp:sales-service:jar:0.0.1-SNAPSHOT:
  Could not find artifact org.springframework.boot:spring-boot-starter-parent:pom:4.1.0
```

Affected: `sales-service`, `inventory-service`, `purchase-service`, `manufacturing-service`, `procurement-service`, `audit-service`, `bom-service`.

### B-3. PurchaseOrderController / VendorController — Missing Class-Level Annotations

```
backend/purchase-service/.../controller/PurchaseOrderController.java
backend/purchase-service/.../controller/VendorController.java
```

Both are empty Java classes with no annotations (`@RestController`, `@Controller`, `@RequestMapping`). While technically valid Java, they register no endpoints and Spring will not treat them as request handlers. Any HTTP requests routed to purchase-service will always return 404.

### B-4. Incomplete Service Stubs — No Controllers, No Repositories, No Entities

The following services have only a bare `@SpringBootApplication` main class and nothing else. `spring-boot-starter-data-jpa` is on the classpath, which triggers Hibernate autoconfiguration — but with no entities to scan and no `datasource` config, Spring Boot will throw:

```
org.springframework.beans.factory.BeanCreationException: 
  Error creating bean with name 'entityManagerFactory': 
  Unable to connect to datasource (no spring.datasource.url configured)
```

Affected services: `inventory-service`, `manufacturing-service`, `procurement-service`, `audit-service`, `bom-service`.

---

## C. COMPLETE LIST OF STARTUP ERRORS

### C-1. Sales Service — Missing Datasource (Will Throw at Startup)

`application.properties` contains only:
```properties
spring.application.name=sales-service
```

Missing required properties for JPA + Flyway to function:
```
spring.datasource.url=jdbc:mysql://localhost:3306/erp_sales_db
spring.datasource.username=...
spring.datasource.password=...
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
server.port=8083
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

Expected startup exception:
```
org.springframework.boot.autoconfigure.jdbc.DataSourceProperties$DataSourceBeanCreationException:
  Failed to determine a suitable driver class
```

### C-2. All Stub Services — Missing Datasource + Port

`inventory-service`, `purchase-service`, `manufacturing-service`, `procurement-service`, `audit-service`, `bom-service` all have the same problem: only `spring.application.name` is configured. With JPA + Flyway on the classpath, they will all fail startup with the same DataSource exception as C-1.

### C-3. API Gateway — Spring Security vs AuthenticationFilter Conflict (Will Block All Requests)

`SecurityConfig.java` in `api-gateway` declares:
```java
.authorizeExchange(exchanges -> exchanges
    .pathMatchers(PUBLIC_PATHS).permitAll()
    .anyExchange().authenticated()
)
```

In Spring WebFlux/Gateway, `anyExchange().authenticated()` requires a `ReactiveAuthenticationManager` to be present. None is configured. The `AuthenticationFilter` (GlobalFilter) is a separate filter that sets `Authentication` into `SecurityContext`, but it runs AFTER Spring Security's filter chain evaluates authorization. This creates the following behavior:

- **Public paths** → work correctly
- **All other paths** → Spring Security returns `401 Unauthorized` before `AuthenticationFilter` sets the JWT authentication — so even valid JWT tokens are rejected

This means **every protected endpoint behind the gateway is completely inaccessible**.

### C-4. Config Server — Missing `/configs` Directory

`application.properties` specifies:
```properties
spring.cloud.config.server.native.search-locations=classpath:/configs
```

No `configs/` directory exists under `src/main/resources/`. If services try to fetch config from the config server, they will receive empty responses or 404. However, since most services do not have `spring.config.import=optional:configserver:` in their properties, this is currently only an issue if it's wired up in the future.

### C-5. Sales Service — Feign Client Calls to Non-Existent Services

When `SalesOrderServiceImpl.confirmSalesOrder()` executes, it calls:

```java
inventoryServiceClient.reserveStock(...)    // → inventory-service (not running)
productServiceClient.getProductById(...)    // → product-service (path mismatch: /api/v1/ vs /api/)
procurementServiceClient.triggerAutoProcurement(...) // → procurement-service (not running)
```

Without fallback/circuit breaker (no Resilience4j in pom), these calls will throw:
```
feign.RetryableException: Connection refused executing GET http://inventory-service/api/v1/stock/1
```

This means `POST /api/v1/sales-orders/{id}/confirm` will always fail with a 500.

### C-6. Eureka Client Registration Failure for Stub Services

Services without `eureka.client.service-url.defaultZone` configured will use the default Eureka URL `http://localhost:8761/eureka/`. If Eureka is running, they will attempt to register but fail to connect to the database anyway (C-2). If Eureka is NOT running first, services will log repeated connection errors on startup.

---

## D. COMPLETE LIST OF MISSING IMPORTS

### D-1. auth-service — `RefreshTokenRepository`

```java
// File: auth-service/.../repository/RefreshTokenRepository.java
@Modifying
// MISSING: @Transactional
@Query("DELETE FROM RefreshToken r WHERE r.user = :user")
void deleteByUser(@Param("user") User user);
```

Missing import: `import org.springframework.transaction.annotation.Transactional;`

The `@Modifying` annotation requires `@Transactional`. While the calling `AuthServiceImpl` method is `@Transactional`, the repository method itself should declare it to be safe in isolation.

### D-2. sales-service — `SecurityConfig.java`

The `SecurityConfig` in sales-service implements `WebMvcConfigurer` for CORS but has no Spring Security dependency on the classpath (`spring-boot-starter-security` is absent from `pom.xml`). This is intentional but means the class must not import any `org.springframework.security.*` classes. Currently it only imports Spring MVC classes — this is acceptable.

However, the service has **no authentication at all** if accessed directly (bypassing gateway). Confirm this is an intentional design decision.

### D-3. api-gateway — `RateLimitConfig.java`

```java
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
// MISSING usage: RedisRateLimiter is not imported anywhere
// The bean only creates a KeyResolver but never wires it to a route
```

Missing (if rate limiting is intended):
```java
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
```

And dependency `spring-boot-starter-data-redis-reactive` is missing from `pom.xml`.

### D-4. product-service — `Category` entity / `CategoryController`

```java
// Entity Category.java
@OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
private List<Product> products;
// MISSING: @JsonIgnore or @JsonManagedReference to prevent infinite recursion
```

Missing import that should be added:
```java
import com.fasterxml.jackson.annotation.JsonIgnore;
```

---

## E. COMPLETE LIST OF DEPENDENCY ISSUES

### E-1. Spring Boot 4.1.0 Does Not Exist (7 Services)

| Service | pom.xml version | Fix |
|---|---|---|
| sales-service | `4.1.0` | Change to `3.3.5` |
| inventory-service | `4.1.0` | Change to `3.3.5` |
| purchase-service | `4.1.0` | Change to `3.3.5` |
| manufacturing-service | `4.1.0` | Change to `3.3.5` |
| procurement-service | `4.1.0` | Change to `3.3.5` |
| audit-service | `4.1.0` | Change to `3.3.5` |
| bom-service | `4.1.0` | Change to `3.3.5` |

### E-2. Spring Cloud 2025.1.2 Does Not Exist (7 Services)

Same 7 services use `spring-cloud.version=2025.1.2`. Fix: change to `2023.0.3` (compatible with SB 3.3.x).

### E-3. Non-Existent Test Artifacts (6 Services)

The following Spring Boot "starter test" variants do not exist in Maven Central. Spring Boot only provides `spring-boot-starter-test` as a unified test dependency:

| Invalid Artifact | Appears In |
|---|---|
| `spring-boot-starter-actuator-test` | purchase, inventory, manufacturing, procurement, audit, bom |
| `spring-boot-starter-data-jpa-test` | purchase, inventory, manufacturing, procurement, audit, bom |
| `spring-boot-starter-flyway-test` | purchase, inventory, manufacturing, procurement, audit, bom |
| `spring-boot-starter-validation-test` | purchase, inventory, manufacturing, procurement, audit, bom |
| `spring-boot-starter-webmvc-test` | purchase, inventory, manufacturing, procurement, audit, bom |

Replace ALL with a single `spring-boot-starter-test` with `<scope>test</scope>`.

### E-4. Non-Existent Main Artifacts (purchase-service + 5 others)

| Invalid Artifact | Correct Artifact |
|---|---|
| `spring-boot-starter-webmvc` | `spring-boot-starter-web` |
| `spring-boot-starter-flyway` | `flyway-core` (+ `flyway-mysql`) |

### E-5. Missing Dependencies in Sales Service

`sales-service` uses `springdoc-openapi-starter-webmvc-ui:3.0.3`. SpringDoc 3.x is the correct line for Spring Boot 3.x (requires version ≥ 2.0.0). However, given `sales-service` pom declares SB 4.1.0, this may be a version that doesn't exist yet. Fix the SB version first.

### E-6. Missing Resilience4j / Circuit Breaker (All Feign-using Services)

`sales-service` makes 3 cross-service Feign calls (inventory, product, procurement) with no circuit breaker or fallback. Without `spring-cloud-starter-circuitbreaker-resilience4j`, any downstream service outage will cause cascading 500 errors in the sales flow.

### E-7. Missing Spring Cloud Config Client (auth-service, product-service)

`auth-service` and `product-service` do not include `spring-cloud-starter-config`. They cannot pull configuration from the config server. This is only an issue if the team intends to centralize configuration — but the config server is deployed and the services can't use it.

### E-8. API Gateway Missing Redis Dependency for Rate Limiting

`RateLimitConfig.java` creates a `KeyResolver` bean (IP-based), implying intent to use Redis-backed rate limiting. However:
- `spring-boot-starter-data-redis-reactive` is absent from `api-gateway/pom.xml`
- No `RequestRateLimiter` filter is applied to any route
- Rate limiting is effectively dead code

### E-9. JWT Version Inconsistency

`auth-service` and `api-gateway` both use JJWT `0.11.5`. The API surface is consistent between them (both use `Jwts.parserBuilder()`, `Keys.hmacShaKeyFor()`). However, `0.11.5` is not the latest (latest is `0.12.x`). No compile errors from this, but `0.12.x` has breaking API changes if upgraded.

---

## F. LIST OF ALL BROKEN APIs

### F-1. All APIs Behind Gateway — Blocked by Security Misconfiguration

Due to the Spring Security WebFlux conflict (Issue C-3), every endpoint that requires authentication behind the gateway returns **401 Unauthorized** even with a valid JWT token.

**Affected endpoints**: All endpoints except `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`, `/actuator/**`.

### F-2. Sales Service — ALL Endpoints (Service Cannot Start)

Sales service has no database configuration. It cannot start, so all 13 endpoints are broken:

| Endpoint | Status | Reason |
|---|---|---|
| `POST /api/v1/sales-orders` | ❌ BROKEN | Service won't start |
| `GET /api/v1/sales-orders` | ❌ BROKEN | Service won't start |
| `GET /api/v1/sales-orders/{id}` | ❌ BROKEN | Service won't start |
| `POST /api/v1/sales-orders/{id}/confirm` | ❌ BROKEN | Service won't start + Feign failures |
| `POST /api/v1/sales-orders/{id}/cancel` | ❌ BROKEN | Service won't start |
| `GET /api/v1/sales-orders/pending-deliveries` | ❌ BROKEN | Service won't start |
| `POST /api/v1/sales-orders/{id}/deliver` | ❌ BROKEN | Service won't start |
| `GET /api/v1/sales-orders/{id}/delivery-status` | ❌ BROKEN | Service won't start |
| `POST /api/v1/customers` | ❌ BROKEN | Service won't start |
| `GET /api/v1/customers` | ❌ BROKEN | Service won't start |
| `GET /api/v1/customers/{id}` | ❌ BROKEN | Service won't start |
| `PUT /api/v1/customers/{id}` | ❌ BROKEN | Service won't start |
| `DELETE /api/v1/customers/{id}` | ❌ BROKEN | Service won't start |

### F-3. Purchase Service — ALL Endpoints (Build Fails + Empty Controllers)

| Endpoint | Status | Reason |
|---|---|---|
| Any `POST/GET/PUT/DELETE /api/purchase-orders/**` | ❌ BROKEN | No methods in controller |
| Any `POST/GET/PUT/DELETE /api/vendors/**` | ❌ BROKEN | No methods in controller |

### F-4. Inventory, Manufacturing, Procurement, Audit, BOM Services — ALL Endpoints

All 5 stub services have ZERO controllers, ZERO endpoints. Gateway routes pointing to them will always return a connection-refused error or 503.

### F-5. Gateway Route Path Version Mismatch — Sales Service Routes

The gateway routes sales-service paths WITHOUT `/v1/`:
```yaml
- path=/api/customers/**    → sales-service   # routes to /api/customers/**
- path=/api/sales-orders/** → sales-service   # routes to /api/sales-orders/**
- path=/api/deliveries/**   → sales-service   # routes to /api/deliveries/**
```

But `SalesOrderController`, `CustomerController`, `DeliveryController` all use `@RequestMapping("/api/v1/...")`. The `/v1/` segment is never added by the gateway. Result: **404 Not Found** for every sales endpoint, even if the service were running.

### F-6. ProductServiceClient — Path Mismatch (Sales → Product)

```java
// In InventoryServiceClient (sales-service)
@GetMapping("/api/v1/products/{id}")  // ← called via Feign lb://product-service
```

But `ProductController` maps to:
```java
@RequestMapping("/api/products")  // ← NO /v1/
```

Result: Every Feign call from sales-service to product-service returns **404 Not Found**.

### F-7. `POST /api/v1/sales-orders/{id}/confirm` — Always Fails (Even If Service Starts)

The confirm flow calls:
1. `productServiceClient.getProductById(productId)` → 404 (path mismatch)
2. `inventoryServiceClient.reserveStock(...)` → Connection refused (stub)
3. `procurementServiceClient.triggerAutoProcurement(...)` → Connection refused (stub)

Without a fallback/circuit breaker, the first failure throws an exception and the entire confirm transaction rolls back.

### F-8. Category Controller — JSON Serialization Error

`GET /api/categories` and `GET /api/categories/{id}` return `Category` entity directly. The `Category.products` list is `@OneToMany(fetch = LAZY)`. Inside an active Hibernate session, Jackson will serialize `List<Product>`, each `Product` has `Category category`, creating an infinite recursion:

```
StackOverflowError: Infinite recursion (StackOverflowError) through reference chain:
  Category["products"] → Product["category"] → Category["products"] → ...
```

### F-9. User Management Endpoints — No Role Guard

```
GET    /api/auth/users       (any authenticated user can list ALL users)
PUT    /api/auth/users/{id}  (any authenticated user can update ANY user)
DELETE /api/auth/users/{id}  (any authenticated user can delete ANY user)
```

These endpoints are not broken in a technical sense, but they are a **broken access control** vulnerability. Any `SALES_USER` can delete the `ADMIN` account.

---

## G. LIST OF ALL DATABASE ISSUES

### G-1. Missing Database Configuration (6 Services)

| Service | `spring.datasource.url` | Flyway Migrations | Can Startup? |
|---|---|---|---|
| sales-service | ❌ MISSING | 4 SQL files present | NO |
| inventory-service | ❌ MISSING | None | NO |
| purchase-service | ❌ MISSING | None | NO |
| manufacturing-service | ❌ MISSING | None | NO |
| procurement-service | ❌ MISSING | None | NO |
| audit-service | ❌ MISSING | None | NO |
| bom-service | ❌ MISSING | None | NO |

### G-2. Auth Service — `role` Default Value Mismatch

Flyway migration `V1__create_users_table.sql`:
```sql
role VARCHAR(20) DEFAULT 'USER'
```

The Java `Role` enum contains: `ADMIN`, `SALES_USER`, `PURCHASE_USER`, `MANUFACTURING_USER`, `INVENTORY_MANAGER`, `BUSINESS_OWNER`. There is **no `USER` value**. This means:
- Any row inserted directly into MySQL with the default role will have an invalid enum value
- JPA will throw `IllegalArgumentException: No enum constant com.erp.auth_service.enums.Role.USER` when reading such rows

### G-3. Auth Service — `role` Column Length Too Small

`role VARCHAR(20)` and the longest enum value is `MANUFACTURING_USER` (17 chars). While all current values fit within 20 characters, it is a fragile constraint. If a new role like `MANUFACTURING_SUPERVISOR` (24 chars) is added, existing migration cannot accommodate it without another migration.

### G-4. Product Entity — `freeToUseQty` Computed Field vs Database Column

`Product.java` has:
```java
@Column(name = "free_to_use_qty")
private BigDecimal freeToUseQty;

@PrePersist
@PreUpdate
public void updateFreeToUseQty() {
    this.freeToUseQty = this.onHandQty.subtract(this.reservedQty);
}
```

And the migration creates `free_to_use_qty DECIMAL(10,2)` as a regular column. This pattern stores a derived value redundantly in the database. If `onHandQty` or `reservedQty` are ever updated outside of JPA (e.g., direct SQL), `free_to_use_qty` becomes stale. Better: use `@Transient` and compute on the fly, or use a database computed/generated column.

### G-5. SalesOrderLine — Integer Qty Types May Truncate

```java
private Integer orderedQty;   // INT (matches SQL)
private Integer reservedQty;  // INT (matches SQL)
private Integer deliveredQty; // INT (matches SQL)
```

But `StockSummaryResponse` and `InventoryServiceClient.StockDto` use `BigDecimal` for quantities (matching product's `onHandQty` which is `DECIMAL(10,2)`). The type mismatch between `Integer` (sales line) and `BigDecimal` (inventory) will require explicit conversion in the service layer. Currently `StockCheckServiceImpl` returns `int`, requiring casting that could lose decimal precision for non-integer stock quantities.

### G-6. Sales Service Flyway Has 4 Migrations but No Database to Run Against

`V1` through `V4` SQL migration files exist and are well-formed. However:
- No `spring.datasource.url` is configured
- Flyway cannot run
- Schema never gets created
- JPA `ddl-auto=validate` (if it were set) would immediately fail

### G-7. No Database Migrations for 6 Services

| Service | Flyway Migrations |
|---|---|
| inventory-service | ❌ None |
| purchase-service | ❌ None |
| manufacturing-service | ❌ None |
| procurement-service | ❌ None |
| audit-service | ❌ None |
| bom-service | ❌ None |

These services have `flyway-core` or `spring-boot-starter-flyway` in their pom but zero `.sql` files in `src/main/resources/db/migration/`. Flyway will throw on startup if `spring.flyway.enabled=true` (the default when Flyway is on classpath).

### G-8. Cross-Service Foreign Key Managed Purely by Application Code

`SalesOrder.customerId` is a plain `Long` (no `@ManyToOne` to a `Customer`), and `SalesOrderLine.productId` is a plain `Long` (no relationship to product-service). This is an intentional microservices pattern (no distributed JPA joins), but it means:
- No referential integrity enforcement at the DB level across services
- A deleted `Customer` does not cascade-delete `SalesOrder` records
- A deleted `Product` leaves orphaned `SalesOrderLine` records

This is an architectural choice, not an error, but it must be handled in application logic (currently not validated in `SalesOrderServiceImpl`).

### G-9. `Delivery` Entity Missing `createdAt` / `updatedAt` Audit Fields

All other entities have timestamp fields. `Delivery` has only `deliveryDate` and `status`. No `created_at` or `updated_at` makes audit/history tracking difficult.

### G-10. Hard-coded Database Credentials in application.properties

```properties
spring.datasource.username=root
spring.datasource.password=root
```

Root MySQL credentials in plaintext configuration files. These should be externalized via environment variables (`${DB_USERNAME}`, `${DB_PASSWORD}`) or Spring Cloud Config with encryption.

---

## SUMMARY — SERVICE HEALTH DASHBOARD

| Service | Port | Build | Startup | DB | Endpoints | Health |
|---|---|---|---|---|---|---|
| eureka-server | 8761 | ✅ OK | ✅ OK | N/A | Dashboard | ✅ READY |
| config-server | 8888 | ✅ OK | ✅ OK | N/A | Config serve | ✅ READY |
| api-gateway | 8080 | ✅ OK | ⚠️ Starts | N/A | Routes (broken auth) | ⚠️ PARTIAL |
| auth-service | 8081 | ✅ OK | ✅ OK | ✅ erp_auth_db | 8 endpoints | ✅ READY |
| product-service | 8082 | ✅ OK | ✅ OK | ✅ erp_product_db | 13 endpoints | ⚠️ PARTIAL (JSON bug) |
| sales-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 13 endpoints | ❌ BROKEN |
| inventory-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ STUB |
| purchase-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ BROKEN |
| manufacturing-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ STUB |
| procurement-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ STUB |
| audit-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ STUB |
| bom-service | ❌ none | ❌ Build fail | ❌ Crash | ❌ missing | 0 endpoints | ❌ STUB |

---

## PRIORITY FIX ORDER

### P0 — Immediate (Services Won't Even Build)
1. Downgrade `spring-boot-starter-parent` from `4.1.0` → `3.3.5` in all 7 affected services
2. Downgrade `spring-cloud.version` from `2025.1.2` → `2023.0.3` in all 7 affected services
3. Replace 5 invalid test artifacts with single `spring-boot-starter-test` in 6 services
4. Replace `spring-boot-starter-webmvc` → `spring-boot-starter-web` in purchase-service
5. Replace `spring-boot-starter-flyway` → `flyway-core` + `flyway-mysql` in 6 services

### P1 — High (Services Won't Start or All Requests Fail)
6. Add full `application.properties` for sales-service (port, datasource, JPA, Flyway, Eureka, JWT)
7. Add full `application.properties` for inventory, purchase, manufacturing, procurement, audit, bom
8. Fix API Gateway `SecurityConfig` — either add `ReactiveAuthenticationManager` or remove `anyExchange().authenticated()` and rely on `AuthenticationFilter` exclusively
9. Remove duplicate route registration in `api-gateway` (remove from either `application.properties` OR `GatewayConfig.java`, not both)

### P2 — Medium (APIs Return Wrong Results)
10. Fix path mismatch: align gateway routes with controller `@RequestMapping` (add `/v1/` to gateway path predicates for sales-service, OR remove `/v1/` from controllers)
11. Fix Feign client path: `ProductServiceClient` calls `/api/v1/products/{id}` but controller is at `/api/products/{id}`
12. Add `@EnableDiscoveryClient` to `SalesServiceApplication`
13. Add `@EnableDiscoveryClient` to all stub service Application classes
14. Fix `Category` / `CategoryController` infinite recursion: add `@JsonIgnore` on `Category.products` or return `CategoryResponse` DTO
15. Add `@Transactional` to `RefreshTokenRepository.deleteByUser()`

### P3 — Security (Broken Access Control)
16. Add `@PreAuthorize("hasRole('ADMIN')")` to user management endpoints in `AuthController`
17. Externalize JWT secret and DB credentials to environment variables

### P4 — Design Improvements (Non-Blocking)
18. Add Resilience4j circuit breakers on all Feign clients in sales-service
19. Remove orphan `sku`, `vendorId`, `bomId` fields from `ProductServiceClient.ProductDto`
20. Fix `Role` enum default value in Flyway V1 migration (change `'USER'` to `'SALES_USER'`)
21. Implement controllers, entities, services, repos for stub services
22. Delete `backend/backend/` duplicate directory

---

*Report generated by static code analysis. No code was modified.*
