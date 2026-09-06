import { orders } from "@/data/orders";
import { products, type Product } from "@/data/products";

export type MemoryState = {
  budget?: number;
  category?: string;
};

export type AgentResponse = {
  text: string;
  tool: string;
  products?: Product[];
  orderId?: string;
  showReturnForm?: boolean;
  memoryUsed?: boolean;
  memory?: MemoryState;
};

const headphoneProducts = products.filter((product) => product.category === "Headphones");

export function getMockAgentResponse(message: string, memory: MemoryState): AgentResponse {
  const normalized = message.toLowerCase();
  const orderId = normalized.match(/#?(1024|1025|1026)/)?.[1];
  const budgetMatch = normalized.match(/(?:under|below|less than)\s*\$?(\d+)/);
  const budget = budgetMatch ? Number(budgetMatch[1]) : undefined;

  if (normalized.includes("return") || normalized.includes("send back")) {
    const selectedOrder = orderId ?? "1024";
    return {
      text: `Order #${selectedOrder} is eligible for return. I’ve opened a guided request so you can finish it here.`,
      tool: "Return Handler",
      orderId: selectedOrder,
      showReturnForm: true,
    };
  }

  if (orderId || normalized.includes("where is my order") || normalized.includes("track")) {
    const selectedOrder = orders.find((order) => order.id === (orderId ?? "1024")) ?? orders[0];
    return {
      text: `I found order #${selectedOrder.id}. It’s ${selectedOrder.status.toLowerCase()} and expected to arrive ${selectedOrder.expectedDelivery}.`,
      tool: "Order Status Tool",
      orderId: selectedOrder.id,
    };
  }

  if (
    normalized.includes("recommend") ||
    normalized.includes("which one") ||
    normalized.includes("best for me")
  ) {
    const rememberedBudget = budget ?? memory.budget;
    const matches = headphoneProducts.filter((product) => !rememberedBudget || product.price <= rememberedBudget);
    return {
      text: rememberedBudget
        ? `Based on your earlier budget of $${rememberedBudget}, I recommend SoundMax Pro as the strongest match.`
        : "Tell me what matters most — budget, comfort, sound, or battery — and I’ll narrow it down.",
      tool: "Recommendation Tool",
      products: matches.slice(0, 3),
      memoryUsed: Boolean(memory.budget && !budget),
      memory: budget ? { budget, category: "Headphones" } : undefined,
    };
  }

  if (
    normalized.includes("headphone") ||
    normalized.includes("product") ||
    normalized.includes("wireless") ||
    normalized.includes("find")
  ) {
    const matches = budget ? headphoneProducts.filter((product) => product.price <= budget) : headphoneProducts;
    return {
      text: `Yes. I found ${matches.length} wireless headphones that match your request.`,
      tool: "Product Search Tool",
      products: matches,
      memory: budget ? { budget, category: "Headphones" } : undefined,
    };
  }

  return {
    text: "I can help you find a product, check an order, start a return, or recommend something based on your needs.",
    tool: "Conversation Router",
  };
}