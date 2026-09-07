# ShopAssist AI

AI E-Commerce Customer Support Agent - College Project

## Features

- **Product Queries**: Search for products by name, category, or price range
- **Order Status**: Check order status and delivery information
- **Returns**: Process return requests for delivered orders
- **Product Recommendations**: Get recommendations based on category and budget
- **Tool Calling**: LangChain agent with tool calling capabilities
- **Conversation Memory**: Maintains conversation context across interactions

## Tech Stack

- Python
- FastAPI
- LangChain
- OpenAI GPT-4o-mini
- In-memory mock data (no database)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables. An OpenAI key enables the LangChain agent;
   without one, the local mock-tool router keeps the demo runnable:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key (optional for the local demo)
```

3. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check
- `POST /chat` - Chat with the AI agent

## Chat Endpoint

Request:
```json
{
  "message": "What products do you have under $100?",
  "session_id": "user123",
}
```

Response:
```json
{
  "response": "I found several products under $100...",
  "tool_used": "recommend_products",
  "memory_used": true
}
```

## Mock Data

### Products (5 items)
- SoundMax Pro — $79
- AudioCore X — $89
- BassWave 500 — $99
- SmartFit Watch — $129
- PowerCharge 20K — $49

### Orders (3 orders)
- #1024 — SoundMax Pro — Shipped
- #1025 — SmartFit Watch — Processing
- #1026 — PowerCharge 20K — Delivered

## Project Structure

```
shopassist-backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── README.md              # This file
└── src/
    ├── agents/           # LangChain agent implementation
    │   └── shopassist_agent.py
    ├── data/            # Mock data
    │   └── mock_data.py
    └── tools/           # LangChain tools
        └── shopassist_tools.py
```
