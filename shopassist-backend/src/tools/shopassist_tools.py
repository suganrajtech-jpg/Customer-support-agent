"""LangChain tools backed by the in-memory ShopAssist data."""

import re
from typing import Optional
from uuid import uuid4

from langchain_core.tools import tool

from ..data.mock_data import MOCK_ORDERS, MOCK_PRODUCTS


def _clean_order_id(order_id: str) -> str:
    return re.sub(r"[^0-9]", "", order_id)


def _find_order(order_id: str):
    clean_id = _clean_order_id(order_id)
    return next((order for order in MOCK_ORDERS if order["order_id"] == clean_id), None)


@tool
def search_products(query: str, category: Optional[str] = None, max_price: Optional[float] = None) -> str:
    """Search products by words in their name, description, category, or features."""
    words = [word for word in re.findall(r"[a-z0-9]+", query.lower()) if word not in {"do", "you", "have", "any"}]
    category_lower = category.lower() if category else None
    results = []
    for product in MOCK_PRODUCTS:
        text = " ".join([product["name"], product["category"], product["description"], *product["features"]]).lower()
        if category_lower and category_lower not in product["category"].lower():
            continue
        if max_price is not None and product["price"] > max_price:
            continue
        if not words or any(word in text for word in words):
            results.append(product)
    if not results:
        return f"No products found for '{query}'."
    return "\n".join(
        f"{p['name']} - ${p['price']:.0f} ({p['category']}): {p['description']}" for p in results
    )


@tool
def get_order_status(order_id: str) -> str:
    """Return product, price, status, delivery, and return information for an order."""
    order = _find_order(order_id)
    if not order:
        return f"Order {order_id} was not found."
    delivery = order["expected_delivery"] or "Not available yet"
    eligible = "Yes" if order["return_eligible"] else "No"
    return (
        f"Order #{order['order_id']}: {order['product']} (${order['price']:.0f}); "
        f"Status: {order['status']}; Expected delivery: {delivery}; Return eligible: {eligible}."
    )


@tool
def process_return(order_id: str) -> str:
    """Check return eligibility and create a reference for an eligible order."""
    order = _find_order(order_id)
    if not order:
        return f"Order {order_id} was not found, so a return cannot be processed."
    if not order["return_eligible"]:
        return f"Order #{order['order_id']} is not eligible for return."
    reference = f"RET-{order['order_id']}-{uuid4().hex[:6].upper()}"
    return f"Return approved for {order['product']} (order #{order['order_id']}). Return reference: {reference}."


@tool
def recommend_products(category: Optional[str] = None, budget: Optional[float] = None) -> str:
    """Recommend in-budget products for a category."""
    category_lower = category.lower() if category else None
    products = [
        product for product in MOCK_PRODUCTS
        if (not category_lower or category_lower in product["category"].lower())
        and (budget is None or product["price"] <= budget)
    ]
    if not products:
        return "No products match those category and budget requirements."
    products.sort(key=lambda product: product["price"])
    return "\n".join(
        f"{p['name']} - ${p['price']:.0f}: {p['description']}" for p in products
    )
