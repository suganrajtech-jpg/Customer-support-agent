"""SHOPASSIST AI Agent implementation with tool calling and memory."""

import os
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.memory import ConversationBufferMemory
from ..tools import search_products, get_order_status, process_return, recommend_products


def create_shopassist_agent(
    provider: str = "openai",
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    session_id: str = "default"
) -> AgentExecutor:
    """Create a SHOPASSIST AI agent with tool calling and memory.

    Args:
        provider: LLM provider ("openai" or "anthropic")
        model: Model name (uses default if not specified)
        api_key: API key (uses environment variable if not specified)
        session_id: Session ID for memory management

    Returns:
        Configured AgentExecutor with tools and memory
    """
    # Initialize LLM based on provider
    if provider.lower() == "openai":
        api_key = api_key or os.getenv("OPENAI_API_KEY")
        model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        llm = ChatOpenAI(model=model, api_key=api_key, temperature=0)
    elif provider.lower() == "anthropic":
        api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        model = model or os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
        llm = ChatAnthropic(model=model, api_key=api_key, temperature=0)
    else:
        raise ValueError(f"Unsupported provider: {provider}. Use 'openai' or 'anthropic'")

    # Define the tools
    tools = [search_products, get_order_status, process_return, recommend_products]

    # Create the system prompt
    system_prompt = """You are SHOPASSIST AI, a helpful e-commerce customer support agent.

Your role is to assist customers with:
- Finding and searching for products
- Checking order status and delivery information
- Processing returns and refunds
- Providing product recommendations

Guidelines:
- Be friendly, professional, and helpful
- Ask clarifying questions if the customer's request is unclear
- Use the available tools to get accurate information
- Provide detailed and helpful responses
- If you cannot find information, let the customer know and suggest alternatives
- Always be honest about product availability and limitations

Available tools:
- search_products: Search for products by name, category, or price range
- get_order_status: Check the status of an order using the order ID
- process_return: Process return requests for delivered orders
- recommend_products: Get product recommendations based on category and budget

Remember to use the tools to get accurate information before responding to the customer."""

    # Create the prompt template with memory
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad")
    ])

    # Create the agent with tool calling
    agent = create_tool_calling_agent(llm, tools, prompt)

    # Create memory for conversation history
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        session_id=session_id
    )

    # Create the agent executor
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        memory=memory,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5
    )

    return agent_executor


async def chat_with_agent(
    agent: AgentExecutor,
    message: str,
    session_id: str = "default"
) -> str:
    """Send a message to the agent and get a response.

    Args:
        agent: The agent executor
        message: The user's message
        session_id: Session ID for memory management

    Returns:
        The agent's response
    """
    try:
        response = await agent.ainvoke({"input": message})
        return response["output"]
    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}"