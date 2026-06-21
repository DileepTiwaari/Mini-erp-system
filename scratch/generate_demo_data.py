# scratch/generate_demo_data.py
import json
import random
from datetime import datetime, timedelta

def generate_demo_data():
    random.seed(42)  # For consistent mock data generation
    
    # 1. Generate 20 Vendors
    vendor_names = [
        "Apex Metal Corp", "Silicon Foundry Co.", "Precision Fasteners Ltd.", 
        "ElectroComponents Inc.", "Global Logistics Partners", "Nexus Plastics Group",
        "Optics & Sensors LLC", "Thermal Dynamics Corp", "Microcircuits Express",
        "Pneumatic Solutions Inc.", "Heavy Foundry Dynamics", "Advanced Robotics Supply",
        "Industrial Wiring & Cable", "Metals & Alloys Co.", "Cabinet Fittings Supply",
        "Chemical & Resins Corp", "Logic Boards Ltd.", "Power Systems Group",
        "Stamping & Dies LLC", "Industrial Packaging Corp"
    ]
    
    vendors = []
    for i, name in enumerate(vendor_names):
        v_id = f"v{i+1}"
        code = f"VND-{i+1:03d}"
        vendors.append({
            "id": v_id,
            "code": code,
            "name": name,
            "email": f"contact@{name.lower().replace(' ', '').replace('&', 'and')}.com",
            "phone": f"+1-555-{100+i:03d}",
            "status": "ACTIVE",
            "address": f"Suite {200+i}, Industrial Way, Cityville",
            "createdAt": (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%dT%H:%M:%SZ")
        })

    # 2. Generate 30 Purchase Orders
    purchase_orders = []
    statuses = ["draft", "confirmed", "partially_received", "fully_received", "cancelled"]
    po_weights = [0.15, 0.20, 0.20, 0.35, 0.10]
    
    for i in range(1, 31):
        po_id = f"po-2{i:02d}"
        order_number = f"PO-002{i:02d}"
        vendor = random.choice(vendors)
        
        # Date generation
        order_date = datetime.now() - timedelta(days=random.randint(2, 45))
        expected_date = order_date + timedelta(days=random.randint(5, 10))
        
        status = random.choices(statuses, weights=po_weights)[0]
        
        # Items logic
        items = []
        num_items = random.randint(1, 3)
        total_amount = 0.0
        
        # Pick random product IDs
        prod_ids = [f"p{random.randint(1, 150)}" for _ in range(num_items)]
        prod_ids = list(set(prod_ids)) # Deduplicate
        
        for p_id in prod_ids:
            qty = random.randint(10, 80)
            cost = round(random.uniform(5.0, 150.0), 2)
            items.append({
                "productId": p_id,
                "quantity": qty,
                "unitCost": cost
            })
            total_amount += qty * cost
            
        tax = round(total_amount * 0.18, 2)
        grand_total = round(total_amount + tax, 2)
        
        # Receipts log
        receipts = []
        received_qty = {}
        if status in ["partially_received", "fully_received"]:
            receipt_date = order_date + timedelta(days=random.randint(4, 7))
            receipt_items = []
            
            for item in items:
                p_id = item["productId"]
                if status == "fully_received":
                    r_qty = item["quantity"]
                else:  # partially
                    r_qty = random.randint(1, item["quantity"] - 1)
                
                receipt_items.append({
                    "productId": p_id,
                    "quantity": r_qty
                })
                received_qty[p_id] = r_qty
                
            receipts.append({
                "date": receipt_date.strftime("%Y-%m-%d"),
                "items": receipt_items,
                "remarks": "Delivered parts logged into warehouse stock.",
                "user": "Inventory Manager"
            })
        
        purchase_orders.append({
            "id": po_id,
            "orderNumber": order_number,
            "vendorId": vendor["id"],
            "orderDate": order_date.strftime("%Y-%m-%d"),
            "expectedDate": expected_date.strftime("%Y-%m-%d"),
            "totalAmount": grand_total,
            "orderTotal": total_amount,
            "taxTotal": tax,
            "grandTotal": grand_total,
            "status": status,
            "items": items,
            "receivedQty": received_qty,
            "receipts": receipts,
            "sourceSalesOrder": "" if random.random() > 0.3 else f"SO-2026-{random.randint(10, 40):05d}"
        })

    # 3. Generate 15 BOM Records
    boms = []
    # Selected finished product IDs
    finished_goods_ids = [1, 5, 9, 13, 17, 21, 26, 31, 35, 41, 45, 51, 61, 71, 81]
    
    for i, p_num in enumerate(finished_goods_ids):
        bom_id = f"bom-3{i+1:02d}"
        product_id = f"p{p_num}"
        code = f"BOM-{i+1:03d}"
        
        # Raw materials components mapping
        components = []
        num_components = random.randint(2, 4)
        for c_idx in range(num_components):
            comp_id = f"p{random.randint(50, 150)}"
            if comp_id == product_id:
                comp_id = f"p{random.randint(100, 150)}"
            components.append({
                "productId": comp_id,
                "quantity": random.randint(1, 6),
                "wastePercent": random.randint(0, 4)
            })
            
        operations = [
            {
                "workCenterId": "wc-assembly",
                "name": "Component Assembly & Mounting",
                "sequence": 10,
                "durationMinutes": random.randint(10, 25)
            },
            {
                "workCenterId": "wc-testing",
                "name": "Functional Signal Inspection",
                "sequence": 20,
                "durationMinutes": random.randint(5, 15)
            }
        ]
        
        boms.append({
            "id": bom_id,
            "productId": product_id,
            "name": f"Product P{p_num} Assembly Layout",
            "code": code,
            "quantity": 1,
            "uom": "pcs",
            "items": components,
            "operations": operations
        })

    # 4. Generate 25 Manufacturing Orders
    manufacturing_orders = []
    mo_statuses = ["PLANNED", "IN_PROGRESS", "DONE", "CANCELLED"]
    mo_weights = [0.20, 0.30, 0.40, 0.10]
    
    for i in range(1, 26):
        mo_id = f"mo-4{i:02d}"
        mo_number = f"MO-004{i:02d}"
        bom = boms[(i - 1) % len(boms)]
        qty = random.randint(10, 60)
        
        status = random.choices(mo_statuses, weights=mo_weights)[0]
        
        start_date = datetime.now() - timedelta(days=random.randint(2, 30))
        end_date = start_date + timedelta(days=2) if status == "DONE" else None
        
        manufacturing_orders.append({
            "id": mo_id,
            "moNumber": mo_number,
            "productId": bom["productId"],
            "bomId": bom["id"],
            "quantity": qty,
            "status": status,
            "sourceSalesOrder": "" if random.random() > 0.4 else f"SO-2026-{random.randint(1, 40):05d}",
            "plannedStartDate": start_date.strftime("%Y-%m-%d"),
            "actualEndDate": end_date.strftime("%Y-%m-%d") if end_date else "",
            "assignee": random.choice(["manufacturing", "admin"])
        })

    # 5. Generate 25 Work Orders
    work_orders = []
    wo_statuses = ["PENDING", "IN_PROGRESS", "DONE", "BLOCKED"]
    
    for i in range(1, 26):
        wo_id = f"wo-{i:03d}"
        mo = manufacturing_orders[(i - 1) % len(manufacturing_orders)]
        
        wc_id = random.choice(["wc-assembly", "wc-testing", "wc-packaging"])
        
        work_orders.append({
            "id": wo_id,
            "moId": mo["id"],
            "workCenterId": wc_id,
            "name": f"Operation Assembly Run #{i}",
            "operationOrder": random.choice([10, 20, 30]),
            "durationPlanned": random.randint(20, 120),
            "status": "DONE" if mo["status"] == "DONE" else random.choice(wo_statuses)
        })

    # 6. Generate 50 Inventory Ledger Movements
    inventory_ledger = []
    movement_types = ["Purchase Receipt", "Sales Delivery", "Manufacturing Consumption", "Manufacturing Production", "Adjustment"]
    
    for i in range(1, 51):
        il_id = f"il-{i:03d}"
        p_id = f"p{random.randint(1, 150)}"
        m_type = random.choice(movement_types)
        
        ref = "-"
        if m_type == "Purchase Receipt":
            ref = f"PO-002{random.randint(1, 30):02d}"
            sign_type = "in"
        elif m_type == "Sales Delivery":
            ref = f"SO-2026-{random.randint(1, 50):05d}"
            sign_type = "out"
        elif m_type == "Manufacturing Consumption":
            ref = f"MO-004{random.randint(1, 25):02d}"
            sign_type = "out"
        elif m_type == "Manufacturing Production":
            ref = f"MO-004{random.randint(1, 25):02d}"
            sign_type = "in"
        else: # Adjustment
            ref = f"ADJ-{random.randint(100, 999)}"
            sign_type = random.choice(["in", "out"])
            
        qty = random.randint(1, 40)
        timestamp = datetime.now() - timedelta(days=random.randint(1, 30), hours=random.randint(0, 23))
        
        inventory_ledger.append({
            "id": il_id,
            "productId": p_id,
            "movementType": m_type,
            "type": sign_type,
            "quantity": qty,
            "reference": ref,
            "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "balanceAfterMovement": float(random.randint(50, 600))
        })
        
    # Sort ledger chronologically descending
    inventory_ledger.sort(key=lambda x: x["timestamp"], reverse=True)

    # 7. Generate 100 Audit Log Entries
    audit_logs = []
    modules = ["Sales", "Purchase", "Manufacturing", "Inventory", "Procurement", "Authentication"]
    users = ["admin", "owner", "sales", "purchase", "manufacturing", "inventory"]
    
    actions_map = {
        "Sales": ["Create Sales Order", "Confirm Sales Order", "Cancel Sales Order", "Register Customer"],
        "Purchase": ["Create Purchase Order", "Confirm Purchase Order", "Goods Receipt", "Register Vendor"],
        "Manufacturing": ["Create BOM", "Create MO", "Start Work Order", "Complete MO"],
        "Inventory": ["Physical Inventory Adjustment", "Reorder Level Changed", "Stock Valuation Audit"],
        "Procurement": ["Trigger Procurement Suggestion", "Execute Replenishment Order"],
        "Authentication": ["User Login", "User Logout", "User Password Reset"]
    }
    
    for i in range(1, 101):
        al_id = f"al-{i:03d}"
        user = random.choice(users)
        mod = random.choice(modules)
        action = random.choice(actions_map[mod])
        
        ref = "-"
        if mod == "Sales":
            ref = f"SO-2026-{random.randint(1, 50):05d}"
        elif mod == "Purchase":
            ref = f"PO-002{random.randint(1, 30):02d}"
        elif mod == "Manufacturing":
            ref = f"MO-004{random.randint(1, 25):02d}"
        elif mod == "Inventory":
            ref = f"ADJ-{random.randint(100, 999)}"
            
        desc = f"User {user} executed {action.lower()} on resource {ref}."
        if action == "User Login":
            desc = f"User {user}@flowerp.com authenticated successfully."
        elif action == "User Logout":
            desc = f"User {user}@flowerp.com logged out and session destroyed."
            
        timestamp = datetime.now() - timedelta(days=random.randint(1, 30), minutes=random.randint(0, 1440))
        
        audit_logs.append({
            "id": al_id,
            "userName": user.capitalize() + " User" if user != "admin" else "System Administrator",
            "module": mod,
            "action": action,
            "referenceNumber": ref,
            "description": desc,
            "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
        })
        
    # Sort audit logs chronologically descending
    audit_logs.sort(key=lambda x: x["timestamp"], reverse=True)

    # 8. Procurement Recommendations & Shortages
    procurement_recs = []
    shortage_alerts = []
    
    for i in range(1, 11):
        p_id = f"p{random.randint(1, 150)}"
        p_type = random.choice(["PURCHASE", "MANUFACTURING"])
        qty = random.randint(20, 100)
        
        recs_item = {
            "id": f"rec-demo-{i}",
            "productId": p_id,
            "productName": f"Component Element #{p_id[1:]}",
            "productCode": f"PRD-{p_id[1:]:03s}" if p_id[1:].isdigit() else f"PRD-0{p_id[1:]}",
            "currentStock": random.randint(1, 8),
            "freeToUseQty": random.randint(0, 5),
            "minStock": random.randint(10, 20),
            "recommendedQty": qty,
            "uom": "pcs",
            "procurementType": p_type,
            "reason": f"Safety stock threshold breached. Recommended minimum reorder point triggered.",
        }
        
        if p_type == "PURCHASE":
            recs_item.update({
                "suggestedVendorId": f"v{random.randint(1, 20)}",
                "suggestedVendorName": random.choice(vendor_names),
                "estimatedCost": round(qty * random.uniform(5.0, 50.0), 2)
            })
        else:
            recs_item.update({
                "bomId": f"bom-3{random.randint(1, 15):02d}"
            })
            
        procurement_recs.append(recs_item)
        
        if random.random() > 0.5:
            shortage_alerts.append({
                "id": f"short-demo-{i}",
                "productId": p_id,
                "productName": recs_item["productName"],
                "productCode": recs_item["productCode"],
                "stock": recs_item["currentStock"],
                "minStock": recs_item["minStock"],
                "shortageQty": recs_item["minStock"] - recs_item["currentStock"],
                "uom": "pcs"
            })

    output_data = {
        "vendors": vendors,
        "purchaseOrders": purchase_orders,
        "boms": boms,
        "manufacturingOrders": manufacturing_orders,
        "workOrders": work_orders,
        "inventoryLedger": inventory_ledger,
        "auditLogs": audit_logs,
        "procurementRecommendations": procurement_recs,
        "shortageAlerts": shortage_alerts
    }
    
    # Save to src/utils/demo_data.json
    output_path = "/Users/harshavardhan/flowERP/src/utils/demo_data.json"
    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Successfully generated demo data. Saved to {output_path}")

if __name__ == "__main__":
    generate_demo_data()
