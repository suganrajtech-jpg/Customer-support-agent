"""ShopAssist agent with LangChain tool calling and simple session memory."""

import logging
import os
import re
from typing import Any, Optional

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

from .deterministic_support import FALLBACK_RESPONSE, deterministic_response
from ..tools import get_order_status, process_return, recommend_products, search_products

TOOLS = [search_products, get_order_status, process_return, recommend_products]
_SESSIONS: dict[str, dict[str, Any]] = {}
logger = logging.getLogger(__name__)


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


async def chat_with_agent(agent, message: str, session_id: str = "default") -> dict[str, Any]:
    session = _session(session_id)
    had_memory = bool(session["messages"] or session["category"] or session["budget"] is not None)
    _remember(session, message)
    deterministic = deterministic_response(message, session)
    if deterministic is not None:
        response, tool_used = deterministic
    elif agent is None:
        response, tool_used = FALLBACK_RESPONSE, "fallback"
    else:
        history = session["messages"][-10:]
        try:
            result = await agent.ainvoke({"messages": history + [{"role": "user", "content": message}]})
            response = result["messages"][-1].content
            tool_used = "langchain_agent"
        except Exception:
            logger.warning("LLM request failed; returning deterministic support fallback.")
            response, tool_used = FALLBACK_RESPONSE, "fallback"
    session["messages"].append({"role": "user", "content": message})
    session["messages"].append({"role": "assistant", "content": response})
    return {"response": response, "tool_used": tool_used, "memory_used": had_memory}
