# generate_data.py
import random
import json
from datetime import datetime, timedelta

random.seed(42)  # For deterministic data

# BCrypt hash for "password123"
BCRYPT_PASSWORD = "$2a$10$8.UnVuG9HHgffUDAlk8qONuy5El5XR5YHZQVM3Y3yfnR2Y/fU.2Hi"

# Roles configuration
roles_count = {
    'ADMIN': 20,
    'BUSINESS_OWNER': 30,
    'SALES_USER': 60,
    'PURCHASE_USER': 50,
    'MANUFACTURING_USER': 50,
    'INVENTORY_MANAGER': 90
}

# Fixed accounts (will be subtracted from the counts above)
fixed_accounts = [
    {'email': 'admin@flowerp.com', 'username': 'admin', 'role': 'ADMIN'},
    {'email': 'owner@flowerp.com', 'username': 'owner', 'role': 'BUSINESS_OWNER'},
    {'email': 'sales@flowerp.com', 'username': 'sales', 'role': 'SALES_USER'},
    {'email': 'purchase@flowerp.com', 'username': 'purchase', 'role': 'PURCHASE_USER'},
    {'email': 'manufacturing@flowerp.com', 'username': 'manufacturing', 'role': 'MANUFACTURING_USER'},
    {'email': 'inventory@flowerp.com', 'username': 'inventory', 'role': 'INVENTORY_MANAGER'}
]

# Generate Users
users = []
user_id = 1

# Add fixed accounts first
for acc in fixed_accounts:
    users.append({
        'id': user_id,
        'username': acc['username'],
        'email': acc['email'],
        'password': BCRYPT_PASSWORD,
        'role': acc['role'],
        'is_active': 1,
        'created_at': '2026-01-01 08:00:00',
        'updated_at': '2026-01-01 08:00:00'
    })
    user_id += 1

# Generate remaining users to reach counts
first_names = ['Amit', 'Rajesh', 'Sanjay', 'Sunita', 'Neha', 'Thomas', 'Joseph', 'Ashley', 'Betty', 'Lisa', 'Michael', 'Karen', 'David', 'Nancy', 'Donald', 'Matthew', 'Robert', 'Pranav', 'Sarah', 'Kavya', 'Thomas', 'Margaret', 'Donald', 'Aanya', 'Rahul', 'Diya', 'John', 'Anita', 'Suresh', 'Aarav', 'Anil', 'Arjun', 'Vihaan', 'Sai', 'Ishaan', 'Vikram', 'Siddharth', 'Atharv', 'Charles', 'Douglas', 'Miller']
last_names = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Rao', 'Nair', 'Taylor', 'Anderson', 'White', 'Jones', 'Harris', 'Sen', 'Wilson', 'Joshi', 'Lewis', 'Sanchez', 'Allen', 'Winters', 'Lovelace', 'Sawyer', 'Tesla', 'Ford', 'Wright', 'Hopper', 'Miller', 'Oswald', 'Pendragon', 'Harkness', 'Noble', 'Tyler']

def gen_unique_username_email(role, index, used):
    prefix = role.lower().replace('_user', '').replace('_manager', '').replace('business_owner', 'owner')
    while True:
        fn = random.choice(first_names).lower()
        ln = random.choice(last_names).lower()
        username = f"{prefix}_{fn}{index}"
        email = f"{username}@flowerp.com"
        if username not in used:
            used.add(username)
            return username, email

used_usernames = set([u['username'] for u in users])

for role, count in roles_count.items():
    # Subtract the fixed account for this role
    fixed_in_role = sum(1 for a in fixed_accounts if a['role'] == role)
    for i in range(1, count - fixed_in_role + 1):
        username, email = gen_unique_username_email(role, i, used_usernames)
        created_days_ago = random.randint(30, 365)
        created_dt = datetime.now() - timedelta(days=created_days_ago)
        created_str = created_dt.strftime('%Y-%m-%d %H:%M:%S')
        users.append({
            'id': user_id,
            'username': username,
            'email': email,
            'password': BCRYPT_PASSWORD,
            'role': role,
            'is_active': 1,
            'created_at': created_str,
            'updated_at': created_str
        })
        user_id += 1

# Generate 30 Categories
category_names = [
    'Sensors & Actuators', 'Microcontrollers & Dev Boards', 'Power Supplies & Adapters',
    'Displays & Indicators', 'Passive Components', 'Fasteners & Bolts', 'Brackets & Mounts',
    'Hand Tools', 'Power Tools', 'Cabinet Hardware', 'CNC Milling Machines',
    'Laser Cutters & Engravers', '3D Printers & Extruders', 'Lathes & Turning Centers',
    'Heavy Hydraulic Presses', 'Aluminum Sheets & Extrusions', 'Stainless Steel Rods',
    'Copper Wires & Pipes', 'Acrylic & Polycarbonate Sheets', 'Filament & Resin',
    'Writing Instruments', 'Paper & Notebooks', 'Desktop Organizers', 'Printer Ink & Toner',
    'Adhesive Tapes & Glue', 'Stepper Motors & Drivers', 'Linear Rails & Bearings',
    'Gears & Timing Belts', 'Pneumatic Valves & Cylinders', 'Cooling Fans & Heatsinks'
]
categories = []
for idx, name in enumerate(category_names, 1):
    categories.append({
        'id': idx,
        'name': name,
        'description': f"High quality {name.lower()} suitable for general and industrial operations.",
        'is_active': 1,
        'created_at': '2026-01-01 08:00:00',
        'updated_at': '2026-01-01 08:00:00'
    })

# Generate 150 Products (5 per Category)
product_templates = [
    # Sensors (Cat 1)
    ('Ultrasonic Distance Sensor HC-SR04', 800, 400),
    ('Digital Temp & Humidity Sensor DHT22', 300, 150),
    ('Micro Servo Motor SG90', 250, 120),
    ('Piezoelectric Vibration Sensor', 450, 200),
    ('PIR Motion Detector HC-SR501', 500, 250),
    # Microcontrollers (Cat 2)
    ('Arduino Uno R3', 1800, 900),
    ('Raspberry Pi 4 Model B (4GB)', 4500, 2500),
    ('ESP32 NodeMCU Development Board', 600, 300),
    ('STM32 Blue Pill Board', 350, 180),
    ('ATmega328P Microcontroller Chip', 200, 100),
    # Power Supplies (Cat 3)
    ('Mean Well 24V 10A Power Supply', 3500, 2200),
    ('5V 2A USB Wall Adapter', 400, 180),
    ('Adjustable Bench Power Supply 30V 5A', 7500, 4500),
    ('12V 5A AC/DC Adapter', 900, 500),
    ('LiPo Battery Charger Module TP4056', 150, 60),
    # Displays (Cat 4)
    ('16x2 Character LCD Display Blue', 450, 220),
    ('0.96 inch OLED Display I2C', 550, 260),
    ('Nextion 4.3 inch HMI Touch Display', 5500, 3500),
    ('8x8 LED Matrix MAX7219', 400, 180),
    ('7-Segment 4-Digit Display', 250, 100),
    # Passives (Cat 5)
    ('Resistor Assortment Kit (600pcs)', 500, 200),
    ('Ceramic Capacitor Kit (300pcs)', 600, 250),
    ('Electrolytic Capacitor Kit (120pcs)', 700, 300),
    ('Signal Diode 1N4148 (100pcs)', 150, 50),
    ('General Purpose Transistor BC547 (50pcs)', 200, 80),
    # Fasteners (Cat 6)
    ('M3 Hex Socket Head Bolts (100pcs)', 300, 120),
    ('M4 Machine Screws Pan Head (100pcs)', 400, 150),
    ('M5 Nylon Lock Nuts (50pcs)', 250, 90),
    ('M8 Threaded Rod 1 meter', 500, 200),
    ('M6 Flat Washers (100pcs)', 150, 50),
    # Brackets (Cat 7)
    ('L-Shape Corner Bracket 2020 Aluminum', 100, 40),
    ('Flat T-Plate Bracket 3030 Aluminum', 150, 60),
    ('Nema 17 Stepper Motor Bracket', 250, 100),
    ('Linear Rail Shaft Support SK12', 350, 150),
    ('U-Shape Pipe Saddle Clamp 25mm', 80, 30),
    # Hand Tools (Cat 8)
    ('Precision Screwdriver Set (24-in-1)', 1200, 600),
    ('Wire Stripper and Cutter', 800, 350),
    ('Long Nose Pliers 6 inch', 700, 300),
    ('Digital Vernier Caliper 150mm', 2500, 1200),
    ('Utility Snap-Off Knife', 200, 80),
    # Power Tools (Cat 9)
    ('Electric Rotary Drill 550W', 4500, 2200),
    ('Hot Air Rework Station 700W', 6500, 3200),
    ('Mini Rotary Dremel Tool Kit', 3000, 1400),
    ('Cordless Impact Driver 18V', 9500, 5000),
    ('Desktop Drill Press 350W', 15000, 8500),
    # Cabinet Hardware (Cat 10)
    ('Stainless Steel Drawer Slide 14 inch', 600, 280),
    ('Hydraulic Soft Close Cabinet Hinge', 150, 60),
    ('Zinc Alloy Drawer Lock with Keys', 250, 100),
    ('Aluminum Cupboard Edge Pull Handle', 120, 45),
    ('Magnetic Door Catch Heavy Duty', 90, 35),
    # CNC Milling (Cat 11)
    ('Desktop CNC Router 3018 Pro', 22000, 13000),
    ('CNC Milling Carbide End Mill 4mm', 800, 350),
    ('CNC Spindle Motor 500W ER11', 8500, 4500),
    ('CNC Offline Controller Module', 2500, 1200),
    ('CNC Aluminum T-Track Clamp', 600, 250),
    # Laser Cutters (Cat 12)
    ('Desktop Laser Engraver 5.5W Optical', 28000, 16000),
    ('Laser Co2 Focus Lens Dia 18mm', 2500, 1100),
    ('Laser Air Assist Pump 40L/min', 5500, 2600),
    ('Honeycomb Laser Working Table', 3500, 1500),
    ('Laser Protective Safety Goggles OD6+', 1500, 600),
    # 3D Printers (Cat 13)
    ('Creality Ender 3 V2 3D Printer', 24000, 14000),
    ('E3D V6 All-Metal Hotend Assembly', 3500, 1500),
    ('Dual-Drive Bowden Extruder Kit', 1200, 500),
    ('NTC 100K Thermistor with Cable', 150, 50),
    ('Polymer Linear Bushing RJ4JP-01-08', 250, 100),
    # Lathes (Cat 14)
    ('Mini Metal Lathe Machine 550W', 65000, 38000),
    ('Lathe Indexable Turning Tool Set 10mm', 4500, 2000),
    ('Lathe Chuck 3-Jaw Self-Centering 80mm', 8500, 4500),
    ('Quick Change Tool Post Wedge Type', 9500, 5000),
    ('Live Center Morse Taper MT2', 1800, 800),
    # Hydraulic Presses (Cat 15)
    ('Shop Press Hydraulic Cylinder 10 Ton', 12000, 6500),
    ('Hydraulic Hand Pump Single Acting', 8500, 4500),
    ('Hydraulic Pressure Gauge 10000 PSI', 2500, 1100),
    ('Hydraulic Hose with Quick Coupler 1.8m', 1500, 600),
    ('Press Arbor Plate Block Set', 3000, 1300),
    # Aluminum Sheets (Cat 16)
    ('Aluminum Sheet 6061-T6 2mm x 300x300', 800, 350),
    ('Aluminum Flat Bar 20x5mm 1 meter', 300, 120),
    ('Aluminum Angle Profile 25x25mm 1m', 450, 180),
    ('Aluminum Round Tube OD 20mm 1m', 600, 250),
    ('Aluminum Slot Extrusion 2020 V-Slot 1m', 500, 200),
    # Stainless Steel (Cat 17)
    ('Stainless Steel Rod 304 Dia 8mm 1m', 700, 300),
    ('Stainless Steel Flat Bar 30x3mm 1m', 550, 220),
    ('Stainless Steel Sheet 304 1.5mm x 300x300', 1200, 550),
    ('Stainless Steel Hex Rod Hex 10mm 1m', 900, 400),
    ('Stainless Steel Threaded Stud M8 1m', 400, 160),
    # Copper Wires (Cat 18)
    ('Solid Copper Wire 14 AWG 10 meters', 1200, 600),
    ('Enamelled Magnet Copper Wire 0.5mm 500g', 1800, 900),
    ('Copper Pipe Soft Coil OD 6mm 3m', 1500, 700),
    ('Copper Tube Connector Elbow 15mm (5pcs)', 300, 120),
    ('Flexible Silicon Copper Cable 10 AWG 5m', 2000, 1000),
    # Acrylic Sheets (Cat 19)
    ('Acrylic Sheet Clear 3mm x 300x300', 400, 180),
    ('Polycarbonate Sheet Clear 2mm x 300x300', 600, 280),
    ('Acrylic Sheet Black 5mm x 300x300', 800, 350),
    ('Polycarbonate Rod Clear Dia 15mm 1m', 1200, 500),
    ('Acrylic Mirror Sheet 2mm x 300x300', 900, 400),
    # Filament (Cat 20)
    ('PLA Filament 1.75mm Black 1kg Roll', 1500, 700),
    ('PETG Filament 1.75mm Grey 1kg Roll', 1600, 750),
    ('ABS Filament 1.75mm Red 1kg Roll', 1400, 650),
    ('UV Resin Standard Clear 1kg Bottle', 3500, 1800),
    ('Nylon Filament 1.75mm Natural 1kg Roll', 2800, 1300),
    # Writing (Cat 21)
    ('Ballpoint Pen Fine Blue (10pcs)', 150, 60),
    ('Fluorescent Highlighter Assorted (5pcs)', 250, 100),
    ('Permanent Marker Black Dual Tip (5pcs)', 300, 120),
    ('Mechanical Pencil 0.5mm Metal Body', 450, 180),
    ('Pencil Lead Refills 0.5mm HB (5 tubes)', 100, 40),
    # Paper (Cat 22)
    ('Copier Paper A4 75GSM 500 Sheets', 350, 160),
    ('Spiral Notebook Ruled A5 160 Pages', 150, 60),
    ('Sticky Notes Pad 3x3 Yellow (100 sheets)', 80, 30),
    ('Graph Paper Pad A4 (50 sheets)', 120, 50),
    ('Heavy Cardstock A4 White (100 sheets)', 450, 180),
    # Desktop Organizers (Cat 23)
    ('Mesh Desk Organizer Oval Black', 500, 220),
    ('Pen and Pencil Holder Cup Wood', 300, 120),
    ('Document File Tray 3-Tier Metal Mesh', 1200, 500),
    ('Desk Writing Pad Matte Black PU Leather', 900, 400),
    ('Monitor Stand Riser with Drawers Wood', 2500, 1100),
    # Printer Ink (Cat 24)
    ('HP Black Ink Cartridge 682 Standard', 1500, 950),
    ('HP Tri-Color Ink Cartridge 682 Standard', 2200, 1400),
    ('Epson Black Refill Ink Bottle 003', 600, 350),
    ('LaserJet Toner Cartridge 88A Black', 3500, 2200),
    ('Canon Ink Bottle GI-790 Cyan', 700, 420),
    # Adhesive Tapes (Cat 25)
    ('Double Sided Foam Tape 24mm x 5m', 200, 80),
    ('Masking Tape General Purpose 2 inch x 20m', 150, 60),
    ('BOPP Packaging Tape Clear 2 inch x 50m', 120, 45),
    ('Cyanoacrylate Super Glue (50g)', 350, 150),
    ('Silicone RTV Sealant Clear (300ml)', 450, 200),
    # Stepper Motors (Cat 26)
    ('Nema 17 Stepper Motor 1.8 deg 4.2 kg-cm', 1200, 550),
    ('Nema 23 Stepper Motor 1.8 deg 19 kg-cm', 3500, 1800),
    ('A4988 Stepper Motor Driver Module', 150, 60),
    ('DRV8825 Stepper Motor Driver Module', 200, 85),
    ('TB6600 Stepper Motor Driver Controller', 1500, 700),
    # Linear Rails (Cat 27)
    ('Linear Guide Rail MGN12 300mm with Block', 2200, 1000),
    ('Linear Guide Rail MGN12 500mm with Block', 3200, 1500),
    ('Hardened Linear Shaft Dia 8mm 400mm', 400, 180),
    ('Linear Ball Bearing Slider Block SCS8UU', 250, 100),
    ('Lead Screw T8 Pitch 2mm Lead 8mm 400mm', 600, 250),
    # Gears (Cat 28)
    ('GT2 Timing Belt 2mm Pitch 6mm Width 5m', 450, 180),
    ('GT2 Timing Pulley 20 Teeth Bore 5mm', 150, 60),
    ('Spur Gear Brass 0.5 Module 30T', 350, 150),
    ('Flexible Shaft Coupling 5mm to 8mm', 200, 80),
    ('Idler Pulley 20T Toothless Bore 5mm', 120, 50),
    # Pneumatics (Cat 29)
    ('Pneumatic Solenoid Valve 5/2 Way 24VDC', 1800, 900),
    ('Pneumatic Air Cylinder Bore 20mm Stroke 50', 2500, 1200),
    ('Pneumatic Quick Fitting Elbow 6mm-1/8', 80, 30),
    ('Polyurethane Air Hose Tube OD 6mm 10m', 600, 250),
    ('Pneumatic Air Filter Regulator Combo 1/4', 3500, 1800),
    # Cooling (Cat 30)
    ('DC Brushless Cooling Fan 12V 4010', 200, 80),
    ('DC Brushless Cooling Fan 12V 8025', 300, 120),
    ('Aluminum Heatsink 40x40x11mm (5pcs)', 250, 100),
    ('Thermal Conductive Silicone Grease 30g', 180, 70),
    ('CPU Cooler Tower Heatsink with 120mm Fan', 2200, 1000)
]

# Ensure we have exactly 150 products
assert len(product_templates) == 150

products = []
for p_idx, temp in enumerate(product_templates, 1):
    name, sales_price, cost_price = temp
    category_id = (p_idx - 1) // 5 + 1
    
    # Generate realistic quantities
    on_hand_qty = float(random.randint(20, 800))
    reserved_qty = float(random.randint(0, min(15, int(on_hand_qty * 0.1))))
    free_to_use_qty = on_hand_qty - reserved_qty
    
    # Procurement configuration
    proc_type = 'MANUFACTURING' if category_id in [11, 12, 13, 14, 15, 26, 27, 29] and p_idx % 2 == 0 else 'PURCHASE'
    proc_strategy = 'MTO' if proc_type == 'MANUFACTURING' else 'MTS'
    proc_on_demand = 1 if proc_strategy == 'MTO' else 0
    
    products.append({
        'id': p_idx,
        'name': f"{name}",
        'description': f"Industrial grade {name.lower()} built to precise engineering standards.",
        'sales_price': sales_price,
        'cost_price': cost_price,
        'on_hand_qty': on_hand_qty,
        'reserved_qty': reserved_qty,
        'free_to_use_qty': free_to_use_qty,
        'procurement_type': proc_type,
        'procurement_strategy': proc_strategy,
        'procure_on_demand': proc_on_demand,
        'category_id': category_id,
        'bomId': None,  # Initialize to None
        'is_active': 1,
        'created_at': '2026-01-01 08:00:00',
        'updated_at': '2026-01-01 08:00:00'
    })

# Generate 100 Customers
company_suffixes = ['Technologies', 'Solutions', 'Builders', 'Manufacturing', 'Systems', 'Industries', 'Enterprises', 'Logistics', 'Services', 'Associates']
customers = []
used_cust_emails = set()
for c_idx in range(1, 101):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    comp_suf = random.choice(company_suffixes)
    company_name = f"{fn} & {ln} {comp_suf}" if c_idx % 3 == 0 else f"{ln} {comp_suf} Ltd"
    if c_idx % 4 == 0:
        company_name = f"Global {random.choice(last_names)} Corp"
        
    cust_email = f"{fn.lower()}.{ln.lower()}{c_idx}@clientcorp.com"
    phone = f"+91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}"
    address = f"Plot {random.randint(1, 500)}, Sector {random.randint(1, 24)}, Phase {random.randint(1, 3)}, Industrial Area, {random.choice(['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi NCR', 'Ahmedabad', 'Kolkata'])}"
    
    customers.append({
        'id': c_idx,
        'name': company_name,
        'email': cust_email,
        'phone': phone,
        'address': address,
        'created_at': '2026-01-01 09:00:00',
        'updated_at': '2026-01-01 09:00:00'
    })

# Generate 50 Sales Orders and 200 Lines
# We need to make sure each Sales Order has at least 1 line, and total lines sum to exactly 200.
sales_orders = []
sales_order_lines = []

# Distribute 200 lines across 50 orders
# Let's pre-generate the line distribution (e.g. 50 orders, each gets at least 1 line, rest distributed)
line_distribution = [1] * 50
remaining_lines = 200 - 50
while remaining_lines > 0:
    for i in range(50):
        if remaining_lines == 0:
            break
        # Allocate random lines (max 8 per order)
        if line_distribution[i] < 8:
            alloc = random.randint(1, min(remaining_lines, 3))
            line_distribution[i] += alloc
            remaining_lines -= alloc

# Ensure sum is exactly 200
assert sum(line_distribution) == 200

# Status choices with realistic distribution
status_choices = ['DRAFT'] * 8 + ['CONFIRMED'] * 12 + ['FULLY_DELIVERED'] * 25 + ['CANCELLED'] * 5
random.shuffle(status_choices)

line_id = 1
for so_idx in range(1, 51):
    order_number = f"SO-2026-{so_idx:05d}"
    customer_id = random.randint(1, 100)
    status = status_choices[so_idx - 1]
    
    # Dates distributed over the last 6 months
    order_days_ago = random.randint(1, 180)
    order_date = datetime.now() - timedelta(days=order_days_ago)
    order_date_str = order_date.strftime('%Y-%m-%d %H:%M:%S')
    
    # Generate lines for this order
    lines_count = line_distribution[so_idx - 1]
    so_lines = []
    order_total = 0.0
    
    # Pick random products (no duplicates in the same order)
    so_products = random.sample(products, lines_count)
    
    for prod in so_products:
        qty = random.randint(1, 10)
        unit_price = float(prod['sales_price'])
        line_total = qty * unit_price
        order_total += line_total
        
        # Reserved and delivered logic based on order status
        reserved = qty if status == 'CONFIRMED' else 0
        delivered = qty if status == 'FULLY_DELIVERED' else 0
        
        sales_order_lines.append({
            'id': line_id,
            'sales_order_id': so_idx,
            'product_id': prod['id'],
            'ordered_qty': qty,
            'reserved_qty': reserved,
            'delivered_qty': delivered,
            'unit_price': unit_price
        })
        line_id += 1
        
    sales_orders.append({
        'id': so_idx,
        'order_number': order_number,
        'customer_id': customer_id,
        'order_date': order_date_str,
        'status': status,
        'total_amount': order_total,
        'created_at': order_date_str,
        'updated_at': order_date_str
    })

# Generate Deliveries for fully delivered orders (status == 'FULLY_DELIVERED')
deliveries = []
delivery_id = 1
for so in sales_orders:
    if so['status'] == 'FULLY_DELIVERED':
        so_date = datetime.strptime(so['order_date'], '%Y-%m-%d %H:%M:%S')
        del_date = so_date + timedelta(days=random.randint(1, 5))
        deliveries.append({
            'id': delivery_id,
            'sales_order_id': so['id'],
            'delivery_date': del_date.strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'DONE',
            'notes': f"Order {so['order_number']} successfully dispatched and delivered in full."
        })
        delivery_id += 1


# ---------------------------------------------------------
# SIMULATED SERVICES DATA (MySQL tables + mockDb JSON)
# ---------------------------------------------------------

# Generate 50 Vendors
vendors = []
for v_idx in range(1, 51):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    comp_suf = random.choice(company_suffixes)
    company_name = f"{fn} & {ln} Suppliers" if v_idx % 3 == 0 else f"{ln} Wholesale Ltd"
    if v_idx % 4 == 0:
        company_name = f"Industrial {random.choice(last_names)} Parts"
        
    email = f"sales@{company_name.lower().replace(' ', '').replace('&', '').replace('.', '')[:15]}.com"
    phone = f"+91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}"
    address = f"Building {random.randint(1, 100)}, Logistics Park, NH-8, {random.choice(['Gurugram', 'Manesar', 'Bhiwadi', 'Chennai', 'Pune', 'Noida'])}"
    city = random.choice(['Gurugram', 'Chennai', 'Pune', 'Noida', 'Mumbai'])
    gst = f"{random.randint(10, 36)}AAAAA{random.randint(1000, 9999)}A1Z{random.randint(1, 9)}"
    
    vendors.append({
        'id': v_idx,
        'name': company_name,
        'code': f"VND-{v_idx:03d}",
        'contactName': f"{fn} {ln}",
        'email': email,
        'phone': phone,
        'gstNumber': gst,
        'address': address,
        'city': city,
        'state': 'State',
        'country': 'India',
        'status': 'ACTIVE'
    })

# Generate 50 Purchase Orders
purchase_orders = []
purchase_order_lines = []
po_statuses = ['draft'] * 10 + ['confirmed'] * 15 + ['fully_received'] * 20 + ['cancelled'] * 5
random.shuffle(po_statuses)

po_line_id = 1
for po_idx in range(1, 51):
    po_number = f"PO-00{po_idx + 200}"
    vendor_id = random.randint(1, 50)
    status = po_statuses[po_idx - 1]
    
    order_days_ago = random.randint(1, 180)
    order_date = datetime.now() - timedelta(days=order_days_ago)
    expected_date = order_date + timedelta(days=random.randint(5, 12))
    
    po_items_count = random.randint(1, 5)
    po_products = random.sample(products, po_items_count)
    
    po_total = 0.0
    for prod in po_products:
        qty = random.randint(5, 100)
        cost = float(prod['cost_price'])
        line_total = qty * cost
        po_total += line_total
        
        purchase_order_lines.append({
            'id': po_line_id,
            'purchase_order_id': po_idx,
            'product_id': prod['id'],
            'quantity': qty,
            'unitCost': cost
        })
        po_line_id += 1
        
    po_tax = po_total * 0.18
    po_grand = po_total + po_tax
    
    purchase_orders.append({
        'id': po_idx,
        'orderNumber': po_number,
        'vendorId': vendor_id,
        'orderDate': order_date.strftime('%Y-%m-%d'),
        'expectedDate': expected_date.strftime('%Y-%m-%d'),
        'status': status,
        'totalAmount': round(po_grand, 2),
        'orderTotal': round(po_total, 2),
        'taxTotal': round(po_tax, 2),
        'grandTotal': round(po_grand, 2),
        'receivedQty': {str(p['product_id']): p['quantity'] for p in purchase_order_lines if p['purchase_order_id'] == po_idx} if status == 'fully_received' else {},
        'receipts': [{
            'date': (order_date + timedelta(days=random.randint(4, 7))).strftime('%Y-%m-%d'),
            'items': [{'productId': p['product_id'], 'quantity': p['quantity']} for p in purchase_order_lines if p['purchase_order_id'] == po_idx],
            'user': 'System Administrator',
            'remarks': 'Full delivery received.'
        }] if status == 'fully_received' else []
    })

# Generate 25 Bill of Materials (BOM)
mfg_products = [p for p in products if p['procurement_type'] == 'MANUFACTURING']
raw_products = [p for p in products if p['procurement_type'] == 'PURCHASE']

if len(mfg_products) < 25:
    for i in range(25 - len(mfg_products)):
        prod = products[i * 4]
        prod['procurement_type'] = 'MANUFACTURING'
        prod['procurement_strategy'] = 'MTO'
        prod['procure_on_demand'] = 1
    mfg_products = [p for p in products if p['procurement_type'] == 'MANUFACTURING']

boms = []
bom_line_id = 1
bom_items = []

work_centers = [
    {'id': 'wc-cutting', 'name': 'Cutting Shop', 'code': 'WC-CUT', 'capacity': 4, 'costPerHour': 40.00, 'status': 'ACTIVE'},
    {'id': 'wc-assembly', 'name': 'Assembly Line', 'code': 'WC-ASSY', 'capacity': 8, 'costPerHour': 50.00, 'status': 'ACTIVE'},
    {'id': 'wc-painting', 'name': 'Painting Booth', 'code': 'WC-PAINT', 'capacity': 2, 'costPerHour': 60.00, 'status': 'ACTIVE'},
    {'id': 'wc-qc', 'name': 'Quality Control Station', 'code': 'WC-QC', 'capacity': 3, 'costPerHour': 45.00, 'status': 'ACTIVE'},
    {'id': 'wc-packing', 'name': 'Packing Station', 'code': 'WC-PACK', 'capacity': 5, 'costPerHour': 30.00, 'status': 'ACTIVE'},
]

for b_idx in range(1, 26):
    prod = mfg_products[b_idx - 1]
    bom_id = f"bom-{300 + b_idx}"
    bom_name = f"{prod['name']} Standard BOM"
    
    raw_components = random.sample(raw_products, random.randint(2, 4))
    
    items = []
    for raw in raw_components:
        items.append({
            'productId': raw['id'],
            'quantity': random.randint(1, 5),
            'unit': 'pcs',
            'wastePercent': random.randint(0, 10)
        })
        bom_items.append({
            'id': bom_line_id,
            'bom_id': b_idx,
            'product_id': raw['id'],
            'quantity': items[-1]['quantity'],
            'unit': 'pcs',
            'waste_percent': items[-1]['wastePercent']
        })
        bom_line_id += 1
        
    ops = [
        {'name': 'Material Preparation', 'workCenterId': 'wc-cutting', 'durationMinutes': 15, 'sequence': 10},
        {'name': 'Core Assembly', 'workCenterId': 'wc-assembly', 'durationMinutes': 30, 'sequence': 20},
        {'name': 'Testing & QC', 'workCenterId': 'wc-qc', 'durationMinutes': 10, 'sequence': 30},
        {'name': 'Packaging', 'workCenterId': 'wc-packing', 'durationMinutes': 5, 'sequence': 40}
    ]
    
    boms.append({
        'id': bom_id,
        'productId': prod['id'],
        'name': bom_name,
        'version': '1.0',
        'status': 'ACTIVE',
        'items': items,
        'operations': ops
    })
    
    prod['bomId'] = bom_id

# Generate 25 Manufacturing Orders
manufacturing_orders = []
mo_statuses = ['PLANNED'] * 5 + ['IN_PROGRESS'] * 8 + ['COMPLETED'] * 12
random.shuffle(mo_statuses)

for mo_idx in range(1, 26):
    bom = boms[mo_idx - 1]
    mo_number = f"MO-00{mo_idx + 400}"
    qty = random.randint(10, 200)
    status = mo_statuses[mo_idx - 1]
    
    planned_days_ago = random.randint(5, 50)
    planned_start = datetime.now() - timedelta(days=planned_days_ago)
    actual_end = planned_start + timedelta(days=random.randint(1, 3))
    
    manufacturing_orders.append({
        'id': f"mo-{400 + mo_idx}",
        'moNumber': mo_number,
        'bomId': bom['id'],
        'productId': bom['productId'],
        'quantity': qty,
        'status': status,
        'plannedStartDate': planned_start.strftime('%Y-%m-%d'),
        'actualEndDate': actual_end.strftime('%Y-%m-%d') if status == 'COMPLETED' else '',
        'assignee': f"u{random.choice([5, 15, 25])}"
    })

# Generate Inventory Ledger
inventory_ledger = []
for idx in range(1, 30):
    prod = random.choice(products)
    mov_type = random.choice(['Purchase Receipt', 'Sales Delivery', 'Manufacturing Production', 'Adjustment'])
    qty = random.randint(5, 50)
    ref = f"REF-{1000 + idx}"
    if mov_type == 'Purchase Receipt':
        ref = f"PO-00{random.randint(201, 250)}"
    elif mov_type == 'Sales Delivery':
        ref = f"SO-2026-{random.randint(1, 50):05d}"
    elif mov_type == 'Manufacturing Production':
        ref = f"MO-00{random.randint(401, 425)}"
        
    inventory_ledger.append({
        'id': f"il{idx}",
        'productId': prod['id'],
        'movementType': mov_type,
        'quantity': qty,
        'reference': ref,
        'timestamp': (datetime.now() - timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'balanceAfterMovement': prod['on_hand_qty']
    })

# Helper function to escape single quotes for MySQL
def esc(val):
    if isinstance(val, str):
        return val.replace("'", "''")
    return val

# Output seed.sql
with open('/Users/harshavardhan/flowERP/seed.sql', 'w') as f:
    f.write("""-- =========================================================================
-- FlowERP Database Seeding Script
-- Generated COMPLETE DEMO DATA SOLUTION for Hackathon
-- Target: MySQL 8.x
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- 1. AUTH SERVICE DATABASE (flowerp_auth)
-- -------------------------------------------------------------------------
USE flowerp_auth;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE users;

INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at) VALUES
""")
    user_lines = []
    for u in users:
        user_lines.append(f"({u['id']}, '{esc(u['username'])}', '{esc(u['email'])}', '{esc(u['password'])}', '{esc(u['role'])}', {u['is_active']}, '{u['created_at']}', '{u['updated_at']}')")
    f.write(",\n".join(user_lines) + ";\n\n")
    
    f.write("""-- -------------------------------------------------------------------------
-- 2. PRODUCT SERVICE DATABASE (flowerp_product)
-- -------------------------------------------------------------------------
USE flowerp_product;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;

INSERT INTO categories (id, name, description, is_active, created_at, updated_at) VALUES
""")
    cat_lines = []
    for c in categories:
        cat_lines.append(f"({c['id']}, '{esc(c['name'])}', '{esc(c['description'])}', {c['is_active']}, '{c['created_at']}', '{c['updated_at']}')")
    f.write(",\n".join(cat_lines) + ";\n\n")

    f.write("""INSERT INTO products (id, name, description, sales_price, cost_price, on_hand_qty, reserved_qty, free_to_use_qty, procurement_type, procurement_strategy, procure_on_demand, category_id, is_active, created_at, updated_at) VALUES
""")
    prod_lines = []
    for p in products:
        prod_lines.append(f"({p['id']}, '{esc(p['name'])}', '{esc(p['description'])}', {p['sales_price']}, {p['cost_price']}, {p['on_hand_qty']}, {p['reserved_qty']}, {p['free_to_use_qty']}, '{p['procurement_type']}', '{p['procurement_strategy']}', {p['procure_on_demand']}, {p['category_id']}, {p['is_active']}, '{p['created_at']}', '{p['updated_at']}')")
    f.write(",\n".join(prod_lines) + ";\n\n")

    f.write("""-- -------------------------------------------------------------------------
-- 3. SALES SERVICE DATABASE (flowerp_sales)
-- -------------------------------------------------------------------------
USE flowerp_sales;
TRUNCATE TABLE deliveries;
TRUNCATE TABLE sales_order_lines;
TRUNCATE TABLE sales_orders;
TRUNCATE TABLE customers;

INSERT INTO customers (id, name, email, phone, address, created_at, updated_at) VALUES
""")
    cust_lines = []
    for c in customers:
        cust_lines.append(f"({c['id']}, '{esc(c['name'])}', '{esc(c['email'])}', '{esc(c['phone'])}', '{esc(c['address'])}', '{c['created_at']}', '{c['updated_at']}')")
    f.write(",\n".join(cust_lines) + ";\n\n")

    f.write("""INSERT INTO sales_orders (id, order_number, customer_id, order_date, status, total_amount, created_at, updated_at) VALUES
""")
    so_lines = []
    for so in sales_orders:
        so_lines.append(f"({so['id']}, '{esc(so['order_number'])}', {so['customer_id']}, '{so['order_date']}', '{esc(so['status'])}', {so['total_amount']}, '{so['created_at']}', '{so['updated_at']}')")
    f.write(",\n".join(so_lines) + ";\n\n")

    f.write("""INSERT INTO sales_order_lines (id, sales_order_id, product_id, ordered_qty, reserved_qty, delivered_qty, unit_price) VALUES
""")
    sol_lines = []
    for sol in sales_order_lines:
        sol_lines.append(f"({sol['id']}, {sol['sales_order_id']}, {sol['product_id']}, {sol['ordered_qty']}, {sol['reserved_qty']}, {sol['delivered_qty']}, {sol['unit_price']})")
    f.write(",\n".join(sol_lines) + ";\n\n")

    f.write("""INSERT INTO deliveries (id, sales_order_id, delivery_date, status, notes) VALUES
""")
    del_lines = []
    for dl in deliveries:
        del_lines.append(f"({dl['id']}, {dl['sales_order_id']}, '{dl['delivery_date']}', '{esc(dl['status'])}', '{esc(dl['notes'])}')")
    f.write(",\n".join(del_lines) + ";\n\n")

    f.write("""-- -------------------------------------------------------------------------
-- 4. SIMULATED MICROSERVICES DATABASE & SCHEMAS
-- -------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS flowerp_purchase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowerp_purchase;

CREATE TABLE IF NOT EXISTS vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    contact_name VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(30),
    gst_number VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    expected_date DATE,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_lines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

TRUNCATE TABLE purchase_order_lines;
TRUNCATE TABLE purchase_orders;
TRUNCATE TABLE vendors;

INSERT INTO vendors (id, name, code, contact_name, email, phone, gst_number, address, city, state, country, status) VALUES
""")
    v_lines = []
    for v in vendors:
        v_lines.append(f"({v['id']}, '{esc(v['name'])}', '{esc(v['code'])}', '{esc(v['contactName'])}', '{esc(v['email'])}', '{esc(v['phone'])}', '{esc(v['gstNumber'])}', '{esc(v['address'])}', '{esc(v['city'])}', '{esc(v['state'])}', '{esc(v['country'])}', '{esc(v['status'])}')")
    f.write(",\n".join(v_lines) + ";\n\n")

    f.write("""INSERT INTO purchase_orders (id, order_number, vendor_id, order_date, expected_date, total_amount, status) VALUES
""")
    po_lines = []
    for po in purchase_orders:
        po_lines.append(f"({po['id']}, '{esc(po['orderNumber'])}', {po['vendorId']}, '{po['orderDate']}', '{po['expectedDate']}', {po['totalAmount']}, '{esc(po['status']).upper()}')")
    f.write(",\n".join(po_lines) + ";\n\n")

    f.write("""INSERT INTO purchase_order_lines (id, purchase_order_id, product_id, quantity, unit_cost) VALUES
""")
    pol_lines = []
    for pol in purchase_order_lines:
        pol_lines.append(f"({pol['id']}, {pol['purchase_order_id']}, {pol['product_id']}, {pol['quantity']}, {pol['unitCost']})")
    f.write(",\n".join(pol_lines) + ";\n\n")

    f.write("""CREATE DATABASE IF NOT EXISTS flowerp_manufacturing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowerp_manufacturing;

CREATE TABLE IF NOT EXISTS boms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    version VARCHAR(10) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS bom_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bom_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'pcs',
    waste_percent DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (bom_id) REFERENCES boms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS work_centers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    capacity INT DEFAULT 1,
    cost_per_hour DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS manufacturing_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mo_number VARCHAR(30) UNIQUE NOT NULL,
    bom_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    planned_start_date DATE NOT NULL,
    actual_end_date DATE,
    assignee_id VARCHAR(50),
    FOREIGN KEY (bom_id) REFERENCES boms(id)
);

TRUNCATE TABLE manufacturing_orders;
TRUNCATE TABLE work_centers;
TRUNCATE TABLE bom_items;
TRUNCATE TABLE boms;

INSERT INTO boms (id, product_id, name, version, status) VALUES
""")
    b_lines = []
    for b in boms:
        b_lines.append(f"({b['id'].split('-')[1]}, {b['productId']}, '{esc(b['name'])}', '{esc(b['version'])}', '{esc(b['status'])}')")
    f.write(",\n".join(b_lines) + ";\n\n")

    f.write("""INSERT INTO bom_items (id, bom_id, product_id, quantity, unit, waste_percent) VALUES
""")
    bi_lines = []
    for bi in bom_items:
        bi_lines.append(f"({bi['id']}, {bi['bom_id']}, {bi['product_id']}, {bi['quantity']}, '{esc(bi['unit'])}', {bi['waste_percent']})")
    f.write(",\n".join(bi_lines) + ";\n\n")

    f.write("""INSERT INTO work_centers (id, name, code, capacity, cost_per_hour, status) VALUES
""")
    wc_lines = []
    for wc in work_centers:
        wc_lines.append(f"('{wc['id']}', '{esc(wc['name'])}', '{esc(wc['code'])}', {wc['capacity']}, {wc['costPerHour']}, '{esc(wc['status'])}')")
    f.write(",\n".join(wc_lines) + ";\n\n")

    f.write("""INSERT INTO manufacturing_orders (id, mo_number, bom_id, product_id, quantity, status, planned_start_date, actual_end_date, assignee_id) VALUES
""")
    mo_lines = []
    for mo in manufacturing_orders:
        actual_end_val = f"'{mo['actualEndDate']}'" if mo['actualEndDate'] else "NULL"
        f_bom_id = mo['bomId'].split('-')[1]
        mo_lines.append(f"({mo['id'].split('-')[1]}, '{esc(mo['moNumber'])}', {f_bom_id}, {mo['productId']}, {mo['quantity']}, '{esc(mo['status'])}', '{mo['plannedStartDate']}', {actual_end_val}, '{esc(mo['assignee'])}')")
    f.write(",\n".join(mo_lines) + ";\n\n")

    f.write("""CREATE DATABASE IF NOT EXISTS flowerp_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowerp_inventory;

CREATE TABLE IF NOT EXISTS inventory_ledger (
    id VARCHAR(50) PRIMARY KEY,
    product_id BIGINT NOT NULL,
    movement_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reference VARCHAR(50),
    timestamp DATETIME NOT NULL,
    balance_after_movement DECIMAL(10,2) NOT NULL
);

TRUNCATE TABLE inventory_ledger;

INSERT INTO inventory_ledger (id, product_id, movement_type, quantity, reference, timestamp, balance_after_movement) VALUES
""")
    il_lines = []
    for il in inventory_ledger:
        il_lines.append(f"('{il['id']}', {il['productId']}, '{esc(il['movementType'])}', {il['quantity']}, '{esc(il['reference'])}', '{il['timestamp'].replace('T', ' ').replace('Z', '')}', {il['balanceAfterMovement']})")
    f.write(",\n".join(il_lines) + ";\n\n")

    f.write("SET FOREIGN_KEY_CHECKS = 1;\n-- Completed Seeding successfully\n")

# Process js initial data to be copied into mockDb.js
mock_data = {
    'users': [
        {'id': f"u{u['id']}", 'name': u['username'].replace('_', ' ').title(), 'email': u['email'], 'role': u['role'], 'phone': '555-0100', 'active': True} for u in users[:6]
    ],
    'categories': [
        {'id': f"cat{c['id']}", 'name': c['name'], 'code': c['name'][:3].upper()} for c in categories
    ],
    'products': [
        {
            'id': f"p{p['id']}",
            'name': p['name'],
            'code': f"PRD-{p['id']:03d}",
            'categoryId': f"cat{p['category_id']}",
            'price': float(p['sales_price']),
            'cost': float(p['cost_price']),
            'stock': float(p['on_hand_qty']),
            'reservedQty': float(p['reserved_qty']),
            'freeToUseQty': float(p['free_to_use_qty']),
            'minStock': 10,
            'uom': 'pcs',
            'procurementType': p['procurement_type'],
            'procurementStrategy': p['procurement_strategy'],
            'vendorId': f"v{random.randint(1, 50)}" if p['procurement_type'] == 'PURCHASE' else None,
            'bomId': p['bomId'],
            'status': 'active',
            'description': p['description']
        } for p in products
    ],
    'vendors': vendors,
    'customers': [
        {
            'id': f"c{c['id']}",
            'name': c['name'],
            'contactName': c['name'].split(' & ')[0] if '&' in c['name'] else c['name'].split(' ')[0],
            'email': c['email'],
            'phone': c['phone'],
            'gstNumber': f"27AAAAA{c['id']:04d}A1Z1",
            'address': c['address'],
            'city': 'City',
            'state': 'State',
            'country': 'India'
        } for c in customers
    ],
    'sales': [
        {
            'id': f"so-{so['id']}",
            'orderNumber': so['order_number'],
            'customerId': f"c{so['customer_id']}",
            'orderDate': so['order_date'].split(' ')[0],
            'totalAmount': float(so['total_amount']),
            'status': so['status'].lower(),
            'items': [
                {'productId': f"p{l['product_id']}", 'quantity': l['ordered_qty'], 'price': float(l['unit_price'])} for l in sales_order_lines if l['sales_order_id'] == so['id']
            ],
            'deliveredQty': {f"p{l['product_id']}": l['delivered_qty'] for l in sales_order_lines if l['sales_order_id'] == so['id']} if so['status'] == 'FULLY_DELIVERED' else {},
            'deliveries': [
                {
                    'date': d['delivery_date'].split(' ')[0],
                    'items': [{'productId': f"p{l['product_id']}", 'quantity': l['delivered_qty']} for l in sales_order_lines if l['sales_order_id'] == so['id']],
                    'remarks': d['notes']
                } for d in deliveries if d['sales_order_id'] == so['id']
            ]
        } for so in sales_orders
    ],
    'purchases': purchase_orders,
    'boms': boms,
    'work_centers': work_centers,
    'manufacturing': manufacturing_orders,
    'work_orders': [
        [
            {'id': f"wo-{mo['id'].split('-')[1]}01", 'moId': mo['id'], 'workCenterId': 'wc-cutting', 'name': 'Material Preparation', 'operationOrder': 10, 'durationPlanned': 15 * mo['quantity'], 'status': 'DONE' if mo['status'] == 'COMPLETED' else 'IN_PROGRESS' if mo['status'] == 'IN_PROGRESS' else 'PENDING'},
            {'id': f"wo-{mo['id'].split('-')[1]}02", 'moId': mo['id'], 'workCenterId': 'wc-assembly', 'name': 'Core Assembly', 'operationOrder': 20, 'durationPlanned': 30 * mo['quantity'], 'status': 'DONE' if mo['status'] == 'COMPLETED' else 'PENDING'},
            {'id': f"wo-{mo['id'].split('-')[1]}03", 'moId': mo['id'], 'workCenterId': 'wc-qc', 'name': 'Testing & QC', 'operationOrder': 30, 'durationPlanned': 10 * mo['quantity'], 'status': 'DONE' if mo['status'] == 'COMPLETED' else 'PENDING'},
            {'id': f"wo-{mo['id'].split('-')[1]}04", 'moId': mo['id'], 'workCenterId': 'wc-packing', 'name': 'Packaging', 'operationOrder': 40, 'durationPlanned': 5 * mo['quantity'], 'status': 'DONE' if mo['status'] == 'COMPLETED' else 'PENDING'}
        ] for mo in manufacturing_orders
    ],
    'inventory_ledger': inventory_ledger,
    'audit_logs': [
        {'id': 'al1', 'userName': 'System Administrator', 'module': 'Authentication', 'action': 'User Login', 'referenceNumber': '-', 'description': 'User admin@flowerp.com authenticated successfully (Standalone mode).', 'timestamp': '2026-06-20T09:20:00Z'}
    ]
}

# Flatten work_orders
flat_work_orders = []
for wos in mock_data['work_orders']:
    flat_work_orders.extend(wos)
mock_data['work_orders'] = flat_work_orders

with open('/Users/harshavardhan/flowERP/scratch/mock_data.json', 'w') as f:
    json.dump(mock_data, f, indent=2)

print("Generation completed successfully!")
