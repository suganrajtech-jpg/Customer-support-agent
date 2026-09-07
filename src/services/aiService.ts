export type MemoryState = {
  budget?: number;
  category?: string;
};

export type AgentResponse = {
  text: string;
  tool: string;
  memoryUsed?: boolean;
};

type BackendResponse = {
  response: string;
  tool_used: string;
  memory_used: boolean;
};

const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");

const toolLabels: Record<string, string> = {
  search_products: "Product Search Tool",
  get_order_status: "Order Status Tool",
  process_return: "Return Tool",
  recommend_products: "Recommendation Tool",
  langchain_agent: "AI Agent",
  none: "Conversation Router",
};

export async function sendMessageToAgent(message: string, sessionId: string): Promise<AgentResponse> {
  const response = await fetch(`${backendUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok) {
    throw new Error(`The support agent returned an error (${response.status}).`);
  }

  const result = (await response.json()) as BackendResponse;
  return {
    text: result.response,
    tool: toolLabels[result.tool_used] ?? result.tool_used,
    memoryUsed: result.memory_used,
  };
}
