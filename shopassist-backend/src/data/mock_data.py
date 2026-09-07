"""Small in-memory catalog and order data for the college project."""

MOCK_PRODUCTS = [
    {"id": "p001", "name": "SoundMax Pro", "price": 79, "category": "Headphones",
     "description": "Wireless headphones with active noise cancellation.", "features": ["wireless", "noise cancellation"]},
    {"id": "p002", "name": "AudioCore X", "price": 89, "category": "Headphones",
     "description": "Comfortable Bluetooth headphones for everyday use.", "features": ["wireless", "Bluetooth"]},
    {"id": "p003", "name": "BassWave 500", "price": 99, "category": "Headphones",
     "description": "Wireless headphones designed for strong bass.", "features": ["wireless", "bass"]},
    {"id": "p004", "name": "SmartFit Watch", "price": 129, "category": "Wearables",
     "description": "Smart fitness watch with health and activity tracking.", "features": ["fitness", "health tracking"]},
    {"id": "p005", "name": "PowerCharge 20K", "price": 49, "category": "Accessories",
     "description": "20,000mAh portable power bank.", "features": ["power bank", "portable"]},
]

MOCK_ORDERS = [
    {"order_id": "1024", "product": "SoundMax Pro", "price": 79, "status": "Shipped",
     "expected_delivery": "September 8, 2026", "return_eligible": True},
    {"order_id": "1025", "product": "SmartFit Watch", "price": 129, "status": "Processing",
     "expected_delivery": None, "return_eligible": True},
    {"order_id": "1026", "product": "PowerCharge 20K", "price": 49, "status": "Delivered",
     "expected_delivery": None, "return_eligible": True},
]
