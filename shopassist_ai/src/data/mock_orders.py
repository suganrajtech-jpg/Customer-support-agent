"""Mock order data for SHOPASSIST AI."""

MOCK_ORDERS = [
    {
        "order_id": "ORD-1001",
        "customer_id": "CUST-001",
        "customer_name": "John Smith",
        "status": "Delivered",
        "order_date": "2024-08-15",
        "estimated_delivery": "2024-08-20",
        "actual_delivery": "2024-08-19",
        "total_amount": 279.98,
        "items": [
            {"product_id": "p001", "name": "Wireless Bluetooth Headphones", "quantity": 1, "price": 79.99},
            {"product_id": "p009", "name": "Wireless Mouse", "quantity": 2, "price": 29.99}
        ],
        "shipping_address": "123 Main St, Anytown, USA"
    },
    {
        "order_id": "ORD-1002",
        "customer_id": "CUST-002",
        "customer_name": "Sarah Johnson",
        "status": "In Transit",
        "order_date": "2024-09-01",
        "estimated_delivery": "2024-09-08",
        "actual_delivery": None,
        "total_amount": 199.99,
        "items": [
            {"product_id": "p002", "name": "Smart Watch Pro", "quantity": 1, "price": 199.99}
        ],
        "shipping_address": "456 Oak Ave, Somewhere, USA"
    },
    {
        "order_id": "ORD-1003",
        "customer_id": "CUST-003",
        "customer_name": "Michael Brown",
        "status": "Processing",
        "order_date": "2024-09-05",
        "estimated_delivery": "2024-09-12",
        "actual_delivery": None,
        "total_amount": 679.98,
        "items": [
            {"product_id": "p005", "name": "Mechanical Gaming Keyboard", "quantity": 1, "price": 129.99},
            {"product_id": "p007", "name": "4K Monitor 27-inch", "quantity": 1, "price": 449.99},
            {"product_id": "p009", "name": "Wireless Mouse", "quantity": 1, "price": 29.99}
        ],
        "shipping_address": "789 Pine Rd, Nowhere, USA"
    },
    {
        "order_id": "ORD-1004",
        "customer_id": "CUST-001",
        "customer_name": "John Smith",
        "status": "Cancelled",
        "order_date": "2024-08-28",
        "estimated_delivery": "2024-09-04",
        "actual_delivery": None,
        "total_amount": 349.99,
        "items": [
            {"product_id": "p003", "name": "Ergonomic Office Chair", "quantity": 1, "price": 349.99}
        ],
        "shipping_address": "123 Main St, Anytown, USA"
    },
    {
        "order_id": "ORD-1005",
        "customer_id": "CUST-004",
        "customer_name": "Emily Davis",
        "status": "Delivered",
        "order_date": "2024-08-20",
        "estimated_delivery": "2024-08-25",
        "actual_delivery": "2024-08-24",
        "total_amount": 64.98,
        "items": [
            {"product_id": "p006", "name": "Yoga Mat Premium", "quantity": 1, "price": 39.99},
            {"product_id": "p008", "name": "Stainless Steel Water Bottle", "quantity": 1, "price": 19.99}
        ],
        "shipping_address": "321 Elm St, Anytown, USA"
    }
]