"""Main FastAPI application for ShopAssist AI."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from src.agents import create_shopassist_agent, chat_with_agent

# Load environment variables
load_dotenv()

# Request models
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    tool_used: str
    memory_used: bool

agent_executor = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Initialize the optional LLM agent; local tools remain available without a key."""
    global agent_executor
    agent_executor = create_shopassist_agent(provider=os.getenv("LLM_PROVIDER", "openai"))
    yield


# Initialize FastAPI app
app = FastAPI(
    title="ShopAssist AI",
    description="AI E-Commerce Customer Support Agent",
    version="1.0.0",
    lifespan=lifespan,
)

frontend_origins = {
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
}
frontend_origins.add("https://customer-support-agent-rho-sable.vercel.app")
frontend_origins.add("https://customer-support-agent-5cirwq63h-itxsugan-2735s-projects.vercel.app")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(frontend_origins),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "ShopAssist AI - E-Commerce Customer Support Agent",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/chat",
            "health": "/health"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint for interacting with the AI agent."""
    result = await chat_with_agent(
        agent=agent_executor,
        message=request.message,
        session_id=request.session_id
    )
    return ChatResponse(**result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
