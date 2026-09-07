"""SHOPASSIST AI tool implementations."""

from typing import Optional, List
from langchain_core.tools import tool
from ..data.mock_products import MOCK_PRODUCTS
from ..data.mock_orders import MOCK_ORDERS


@tool
def search_products(query: str, category: Optional[str] = None, max_price: Optional[float] = None) -> str:
    """Search for products based on query, category, and price range.

    Args:
        query: Search query to find products (name, description, or features)
        category: Optional category filter (Electronics, Furniture, Food & Beverages, Sports & Fitness)
        max_price: Optional maximum price filter

    Returns:
        JSON string containing matching products with details
    """
    results = []

    for product in MOCK_PRODUCTS:
        # Check category filter
        if category and product["category"] != category:
            continue

        # Check price filter
        if max_price and product["price"] > max_price:
            continue

        # Check search query (case-insensitive)
        query_lower = query.lower()
        searchable_text = f"{product['name']} {product['description']} {' '.join(product['features'])}".lower()

        if query_lower in searchable_text:
            results.append(product)

    if not results:
        return f"No products found matching query: '{query}'" + (f" in category: {category}" if category else "")

    # Format results
    output = f"Found {len(results)} product(s):\n"
    for product in results:
        output += f"\n- {product['name']} (ID: {product['id']})\n"
        output += f"  Category: {product['category']}\n"
        output += f"  Price: ${product['price']:.2f}\n"
        output += f"  Description: {product['description']}\n"
        output += f"  Stock: {product['stock']} available\n"
        output += f"  Rating: {product['rating']}/5\n"
        output += f"  Features: {', '.join(product['features'])}\n"

    return output


@tool
def get_order_status(order_id: str) -> str:
    """Get the status of an order by order ID.

    Args:
        order_id: The order ID (e.g., ORD-1001)

    Returns:
        Order status and details
    """
    for order in MOCK_ORDERS:
        if order["order_id"].lower() == order_id.lower():
            output = f"Order {order['order_id']} Details:\n"
            output += f"Customer: {order['customer_name']}\n"
            output += f"Status: {order['status']}\n"
            output += f"Order Date: {order['order_date']}\n"
            output += f"Estimated Delivery: {order['estimated_delivery']}\n"

            if order['actual_delivery']:
                output += f"Actual Delivery: {order['actual_delivery']}\n"

            output += f"Total Amount: ${order['total_amount']:.2f}\n"
            output += f"Shipping Address: {order['shipping_address']}\n"
            output += f"\nItems:\n"

            for item in order['items']:
                output += f"  - {item['name']} (Qty: {item['quantity']}, Price: ${item['price']:.2f})\n"

            return output

    return f"Order {order_id} not found. Please check the order ID and try again."


@tool
def process_return(order_id: str, product_id: str, reason: str) -> str:
    """Process a return request for a product from an order.

    Args:
        order_id: The order ID (e.g., ORD-1001)
        product_id: The product ID to return (e.g., p001)
        reason: The reason for the return

    Returns:
        Return confirmation and details
    """
    # Find the order
    order = None
    for ord_data in MOCK_ORDERS:
        if ord_data["order_id"].lower() == order_id.lower():
            order = ord_data
            break

    if not order:
        return f"Order {order_id} not found. Cannot process return."

    # Check if order is eligible for return (only delivered orders)
    if order["status"] != "Delivered":
        return f"Order {order_id} is not eligible for return. Current status: {order['status']}. Only delivered orders can be returned."

    # Check if product exists in the order
    product_in_order = None
    for item in order["items"]:
        if item["product_id"] == product_id:
            product_in_order = item
            break

    if not product_in_order:
        return f"Product {product_id} not found in order {order_id}. Cannot process return."

    # Process the return (in a real system, this would update a database)
    return f"Return processed successfully!\n\nReturn Details:\n" \
           f"Order ID: {order_id}\n" \
           f"Product: {product_in_order['name']}\n" \
           f"Quantity: {product_in_order['quantity']}\n" \
           f"Refund Amount: ${product_in_order['price'] * product_in_order['quantity']:.2f}\n" \
           f"Reason: {reason}\n" \
           f"Return ID: RTN-{order_id.split('-')[1]}-{product_id}\n" \
           f"Expected Refund: 5-7 business days\n" \
           f"Return Label: Sent to {order['shipping_address']}"


@tool
def recommend_products(category: Optional[str] = None, budget: Optional[float] = None) -> str:
    """Get product recommendations based on category and budget.

    Args:
        category: Optional category filter (Electronics, Furniture, Food & Beverages, Sports & Fitness)
        budget: Optional maximum budget

    Returns:
        Recommended products with details
    """
    recommendations = []

    for product in MOCK_PRODUCTS:
        # Check category filter
        if category and product["category"] != category:
            continue

        # Check budget filter
        if budget and product["price"] > budget:
            continue

        # Only recommend products with good ratings and in stock
        if product["rating"] >= 4.0 and product["stock"] > 0:
            recommendations.append(product)

    # Sort by rating (highest first)
    recommendations.sort(key=lambda x: x["rating"], reverse=True)

    if not recommendations:
        return f"No recommendations available" + (f" for category: {category}" if category else "") + (f" under budget: ${budget}" if budget else "")

    # Format recommendations
    output = f"Top {len(recommendations)} Recommendation(s):\n"
    for i, product in enumerate(recommendations, 1):
        output += f"\n{i}. {product['name']} (ID: {product['id']})\n"
        output += f"   Category: {product['category']}\n"
        output += f"   Price: ${product['price']:.2f}\n"
        output += f"   Rating: {product['rating']}/5\n"
        output += f"   Description: {product['description']}\n"
        output += f"   {product['stock']} in stock\n"

    return output