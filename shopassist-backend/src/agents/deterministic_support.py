"""Deterministic support routing and responses for common customer questions."""

import re
from enum import StrEnum
from typing import Any, Optional

from ..tools import get_order_status, process_return, recommend_products, search_products


class Intent(StrEnum):
    GREETING = "greeting"
    RETURN_POLICY = "return_policy"
    SHIPPING = "shipping"
    PAYMENT = "payment"
    CANCELLATION = "cancellation"
    WARRANTY = "warranty"
    HELP = "help"
    ORDER_STATUS = "order_status"
    RETURN_REQUEST = "return_request"
    PRODUCT_SEARCH = "product_search"
    RECOMMENDATION = "recommendation"


FALLBACK_RESPONSE = (
    "I can still help with product information, shipping, returns, refunds, "
    "and common support questions. What would you like help with?"
)

_POLICY_RESPONSES = {
    Intent.RETURN_POLICY: (
        "Our return policy allows eligible items to be returned in their original "
        "condition. Share your order number and I can check its return eligibility."
    ),
    Intent.SHIPPING: (
        "We offer standard shipping, and delivery timing depends on your location "
        "and the item. Share an order number if you want me to check its status."
    ),
    Intent.PAYMENT: (
        "We accept major credit and debit cards and other payment methods shown "
        "at checkout."
    ),
    Intent.CANCELLATION: (
        "You can request a cancellation while an order is still processing. "
        "Share your order number and I can check its current status."
    ),
    Intent.WARRANTY: (
        "Warranty coverage depends on the product. Share the product or order "
        "number and I can help check the available coverage."
    ),
    Intent.HELP: (
        "I can help with products, orders, shipping, returns, refunds, payments, "
        "and recommendations."
    ),
}


def classify_intent(message: str) -> Optional[Intent]:
    """Classify common requests that can be answered without an LLM."""
    lower = message.lower().strip()
    order_match = re.search(r"#?\s*(1024|1025|1026)\b", lower)

    if re.fullmatch(r"(hi|hello|hey|good morning|good afternoon|good evening)[!. ]*", lower):
        return Intent.GREETING
    if order_match and any(word in lower for word in ("return", "refund")):
        return Intent.RETURN_REQUEST
    if order_match and any(word in lower for word in ("where", "status", "delivery", "track")):
        return Intent.ORDER_STATUS
    if any(phrase in lower for phrase in ("return policy", "refund policy", "how do i return")):
        return Intent.RETURN_POLICY
    if any(word in lower for word in ("shipping", "delivery information", "when will")):
        return Intent.SHIPPING
    if any(phrase in lower for phrase in ("payment method", "payment methods", "how can i pay")):
        return Intent.PAYMENT
    if any(word in lower for word in ("cancel", "cancellation")):
        return Intent.CANCELLATION
    if "warranty" in lower or "guarantee" in lower:
        return Intent.WARRANTY
    if any(phrase in lower for phrase in ("help", "what can you do", "support")):
        return Intent.HELP
    if any(word in lower for word in ("headphone", "watch", "accessor", "product", "available", "have")):
        return Intent.PRODUCT_SEARCH
    if any(word in lower for word in ("recommend", "suggest", "which one")):
        return Intent.RECOMMENDATION
    return None


def deterministic_response(
    message: str,
    session: dict[str, Any],
) -> Optional[tuple[str, str]]:
    """Return a deterministic response and tool label, or None for LLM routing."""
    intent = classify_intent(message)
    if intent is None:
        return None
    if intent is Intent.GREETING:
        return "Hello! I can help with products, orders, returns, shipping, and recommendations.", "greeting"
    if intent in _POLICY_RESPONSES:
        return _POLICY_RESPONSES[intent], intent.value
    order_match = re.search(r"#?\s*(1024|1025|1026)\b", message.lower())
    if intent is Intent.RETURN_REQUEST:
        return process_return.invoke({"order_id": order_match.group(1)}), "process_return"
    if intent is Intent.ORDER_STATUS:
        return get_order_status.invoke({"order_id": order_match.group(1)}), "get_order_status"
    if intent is Intent.PRODUCT_SEARCH:
        return (
            search_products.invoke(
                {
                    "query": message,
                    "category": session["category"],
                    "max_price": session["budget"],
                }
            ),
            "search_products",
        )
    if intent is Intent.RECOMMENDATION:
        category = session["category"]
        budget = session["budget"]
        if category or budget is not None:
            return recommend_products.invoke({"category": category, "budget": budget}), "recommend_products"
    return None
