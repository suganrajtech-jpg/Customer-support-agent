"""ShopAssist agent with LangChain tool calling and simple session memory."""

import os
import re
from typing import Any, Optional

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

from ..tools import get_order_status, process_return, recommend_products, search_products

TOOLS = [search_products, get_order_status, process_return, recommend_products]
_SESSIONS: dict[str, dict[str, Any]] = {}


def _session(session_id: str) -> dict[str, Any]:
    return _SESSIONS.setdefault(session_id, {"messages": [], "category": None, "budget": None})


def _remember(session: dict[str, Any], message: str) -> None:
    lower = message.lower()
    for category in ("headphones", "watch", "wearables", "accessories"):
        if category in lower:
            session["category"] = "Wearables" if category in {"watch", "wearables"} else category.title()
    budget = re.search(r"(?:under|below|less than|budget(?: of)?)\s*\$?\s*(\d+(?:\.\d+)?)", lower)
    if budget:
        session["budget"] = float(budget.group(1))


def create_shopassist_agent(provider: str = "openai", model: Optional[str] = None,
                            api_key: Optional[str] = None, session_id: str = "default"):
    """Create the current LangChain agent when an API key is configured."""
    if provider.lower() != "openai":
        raise ValueError("This project uses OpenAI. Set LLM_PROVIDER=openai.")
    key = api_key or os.getenv("OPENAI_API_KEY")
    if not key or key.startswith("your_"):
        return None
    return create_agent(
        ChatOpenAI(model=model or os.getenv("OPENAI_MODEL", "gpt-4o-mini"), api_key=key, temperature=0),
        TOOLS,
        system_prompt=(
            "You are ShopAssist AI. Use the tools for product, order, return, and recommendation "
            "questions. Be concise and friendly. Use conversation context when the user follows up."
        ),
    )


def _local_response(message: str, session: dict[str, Any]) -> tuple[str, str]:
    lower = message.lower()
    order_match = re.search(r"#?\s*(1024|1025|1026)\b", lower)
    if any(word in lower for word in ("return", "refund")):
        return process_return.invoke({"order_id": order_match.group(1) if order_match else ""}), "process_return"
    if any(word in lower for word in ("where", "status", "delivery")) and order_match:
        return get_order_status.invoke({"order_id": order_match.group(1)}), "get_order_status"
    if "recommend" in lower or "which one" in lower or "suggest" in lower:
        category = session["category"]
        budget = session["budget"]
        return recommend_products.invoke({"category": category, "budget": budget}), "recommend_products"
    budget = session["budget"]
    category = session["category"]
    if category and budget is not None:
        return recommend_products.invoke({"category": category, "budget": budget}), "recommend_products"
    if any(word in lower for word in ("headphone", "watch", "accessor", "product", "have")):
        return search_products.invoke({"query": message, "category": category, "max_price": budget}), "search_products"
    return "I can help find products, check an order, process a return, or make recommendations.", "none"


async def chat_with_agent(agent, message: str, session_id: str = "default") -> dict[str, Any]:
    session = _session(session_id)
    had_memory = bool(session["messages"] or session["category"] or session["budget"] is not None)
    _remember(session, message)
    if agent is None:
        response, tool_used = _local_response(message, session)
    else:
        history = session["messages"][-10:]
        result = await agent.ainvoke({"messages": history + [{"role": "user", "content": message}]})
        response = result["messages"][-1].content
        tool_used = "langchain_agent"
    session["messages"].append({"role": "user", "content": message})
    session["messages"].append({"role": "assistant", "content": response})
    return {"response": response, "tool_used": tool_used, "memory_used": had_memory}
