# ShopAssist AI

### AI-powered e-commerce customer support for product discovery, order assistance, and returns

[![Live demo](https://img.shields.io/badge/Live%20demo-Open%20ShopAssist%20AI-0ea5e9?style=for-the-badge)](https://customer-support-agent-288ryhzil-itxsugan-2735s-projects.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TanStack-111827?style=flat-square)](./)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-059669?style=flat-square)](./shopassist-backend)

ShopAssist AI is an agentic customer-support application for modern e-commerce. It combines a polished web interface with an API-driven AI support agent that can understand customer intent, select a business tool, use conversation context, and return a clear response.

> **Try the live application:** [customer-support-agent-288ryhzil-itxsugan-2735s-projects.vercel.app](https://customer-support-agent-288ryhzil-itxsugan-2735s-projects.vercel.app/)

## Overview

Traditional chatbots only generate text. ShopAssist AI demonstrates a more useful workflow:

1. A customer describes what they need in natural language.
2. The agent identifies the intent and relevant context.
3. It selects a specialised support tool.
4. The tool searches the catalog, checks an order, processes a return, or creates recommendations.
5. The agent turns the result into a concise customer-facing response.
6. Session memory makes follow-up questions possible without repeating all details.

This project is intentionally designed as an understandable, end-to-end reference implementation. It uses a small in-memory catalog and order dataset so the workflow can be run locally without a database or commerce-platform credentials.

## What the live demo can do

Open the [live demo](https://customer-support-agent-288ryhzil-itxsugan-2735s-projects.vercel.app/) and try prompts such as:

- `Show me wireless headphones under $100.`
- `Where is order #1024?`
- `Can I return order #1025?`
- `Recommend an accessory under $60.`
- `I want headphones under $90.` followed by `Which one would you recommend?`

The interface includes:

- A landing page explaining the support experience
- An AI assistant workspace with visible tool activity
- Product browsing
- Order status views
- Return workflows
- Responsive layouts for desktop and mobile

## Core capabilities

| Capability | Description |
| --- | --- |
| Product search | Finds products by name, category, description, features, and optional price limit |
| Order tracking | Returns the status, item, price, delivery information, and return eligibility |
| Returns | Validates return eligibility and creates a return reference for eligible orders |
| Recommendations | Suggests products by category and budget |
| Conversation memory | Retains recent messages and remembered category/budget preferences per session |
| Agentic tool calling | Routes supported requests to the appropriate business function |
| Deterministic fallback | Keeps the demo usable when no LLM API key is configured |
| Health and API endpoints | Provides simple service discovery and deployment health checks |

## Architecture

```text
┌──────────────────────────────┐
│ Customer                      │
│ Web browser                   │
└──────────────┬───────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────┐
│ React + TanStack Start        │
│ Vite frontend                 │
│ Product, order, return views  │
└──────────────┬───────────────┘
               │ POST /chat
               ▼
┌──────────────────────────────┐
│ FastAPI backend               │
│ Validation, CORS, health API  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ ShopAssist agent             │
│ Intent routing + session data │
└───────┬────────┬─────────────┘
        │        │
        ▼        ▼
┌────────────┐ ┌─────────────────┐
│ Support     │ │ Optional        │
│ tools       │ │ OpenAI/LangChain│
│ catalog and │ │ agent           │
│ order data  │ │                 │
└────────────┘ └─────────────────┘
```

### Support tools

The backend exposes four LangChain-compatible tools:

- `search_products(query, category, max_price)`
- `get_order_status(order_id)`
- `process_return(order_id)`
- `recommend_products(category, budget)`

When an OpenAI key is not available, the deterministic support router handles the common demo intents locally. If an LLM request fails, the backend logs a warning and returns the deterministic fallback instead of exposing an implementation error to the customer.

## Technology stack

### Frontend

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Radix UI primitives
- Lucide icons

### Backend

- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic
- LangChain and LangChain OpenAI
- python-dotenv

### Deployment

- Frontend: Vercel
- Backend: Render
- Default production API: `https://shopassist-backend-c2v9.onrender.com`

## Repository structure

```text
Customer-support-agent/
├── src/
│   ├── components/              # Shared UI and AI interaction components
│   ├── data/                    # Frontend product and order display data
│   ├── routes/                  # TanStack routes and application views
│   ├── services/                # Backend API client
│   └── start.ts                 # TanStack Start middleware configuration
├── shopassist-backend/
│   ├── main.py                  # FastAPI application and API endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── src/agents/              # Agent, memory, and deterministic routing
│   ├── src/data/                # Backend mock catalog and orders
│   └── src/tools/               # Search, order, return, and recommendation tools
├── .env.example                 # Frontend environment template
├── package.json                 # Frontend scripts and dependencies
└── README.md
```

## Run locally

### Prerequisites

- Node.js 18+ and Bun (recommended) or a compatible Node package manager
- Python 3.10+
- An OpenAI API key only if you want to enable the optional LLM agent

### 1. Start the backend

```bash
cd shopassist-backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

The API starts at `http://localhost:8000`.

To enable LangChain tool calling, set `OPENAI_API_KEY` in `shopassist-backend/.env`. The application remains runnable without a key by using its deterministic local support flow.

### 2. Start the frontend

In a second terminal:

```bash
# Run this from the repository root in a second terminal.
bun install
cp .env.example .env
bun run dev
```

The frontend starts at the local Vite URL shown in the terminal, normally `http://localhost:5173`. The default development backend is `http://localhost:8000`.

To use another backend:

```dotenv
VITE_BACKEND_URL=https://your-backend.example.com
```

## API reference

### `GET /`

Returns basic service metadata and available endpoints.

### `GET /health`

Returns:

```json
{
  "status": "ok"
}
```

### `POST /chat`

Request:

```json
{
  "message": "Where is order #1024?",
  "session_id": "demo-customer-1"
}
```

Response:

```json
{
  "response": "Order #1024 ...",
  "tool_used": "get_order_status",
  "memory_used": false
}
```

`session_id` identifies the in-memory conversation. Use the same value for follow-up messages.

## Demo data and limitations

This is a demonstration application, not a production order-management system.

- Catalog and order records are in memory and reset when the backend restarts.
- The return flow simulates an approval and generates a reference; it does not connect to a payment or fulfilment provider.
- No authentication, persistent database, payment processing, or real shipment carrier integration is included.
- Do not submit confidential customer or payment information to the public demo.
- Production deployment should add authentication, durable storage, observability, rate limiting, validation against real commerce APIs, and appropriate privacy controls.

## Development commands

From the frontend directory:

```bash
bun run dev       # Start the development server
bun run build     # Create a production build
bun run preview   # Preview the production build
bun run lint      # Run ESLint
```

From the backend directory:

```bash
python main.py    # Start FastAPI with Uvicorn
```

## Contributing

1. Create a focused branch for your change.
2. Keep frontend and backend contracts in sync.
3. Run the relevant lint/build checks before opening a pull request.
4. Describe user-visible changes and any environment variables required.

## License

No license has been declared yet. Add a `LICENSE` file before distributing or reusing this project outside the repository.
