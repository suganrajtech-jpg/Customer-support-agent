import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  ClipboardList,
  Headphones,
  Menu,
  MessageCircle,
  PackageSearch,
  PanelRight,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Store,
  Tags,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { orders, type Order } from "@/data/orders";
import { products, type Product, type ProductCategory } from "@/data/products";
import { sendMessageToAgent, type AgentResponse, type MemoryState } from "@/services/aiService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopAssist AI — AI E-Commerce Customer Support" },
      { name: "description", content: "ShopAssist AI helps customers find products, track orders, manage returns, and discover the right products." },
      { property: "og:title", content: "ShopAssist AI — AI E-Commerce Customer Support" },
      { property: "og:description", content: "A calm, capable AI support agent for modern e-commerce." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopAssistApp,
});

type View = "assistant" | "products" | "orders" | "returns" | "settings";
type ChatMessage = { id: number; role: "user" | "assistant"; text: string; response?: AgentResponse };

const navItems: Array<{ id: View; label: string; icon: typeof MessageCircle }> = [
  { id: "assistant", label: "AI Assistant", icon: MessageCircle },
  { id: "products", label: "Products", icon: Tags },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "returns", label: "Returns", icon: RotateCcw },
];

function ShopAssistApp() {
  const [view, setView] = useState<View | "landing">("landing");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (view === "landing") {
    return <LandingPage onOpenAssistant={() => setView("assistant")} onNavigate={setView} />;
  }

  if (view === "assistant") {
    return (
      <AssistantWorkspace
        onNavigate={(nextView) => { setView(nextView); setMobileNavOpen(false); }}
        onBack={() => { setView("landing"); setMobileNavOpen(false); }}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen((open) => !open)}
      />
    );
  }

  return (
    <div className="app-shell min-h-screen text-foreground">
      <LandingHeader onOpenAssistant={() => setView("assistant")} onNavigate={setView} />
      <main>
        {view === "products" && <ProductsView onOpenAssistant={() => setView("assistant")} onBack={() => setView("landing")} />}
        {view === "orders" && <OrdersView onOpenAssistant={() => setView("assistant")} onBack={() => setView("landing")} />}
        {view === "returns" && <ReturnsView onOpenAssistant={() => setView("assistant")} onBack={() => setView("landing")} />}
        {view === "settings" && <SettingsView onOpenAssistant={() => setView("assistant")} onBack={() => setView("landing")} />}
      </main>
    </div>
  );
}

function LandingHeader({ onOpenAssistant, onNavigate }: { onOpenAssistant: () => void; onNavigate: (view: View) => void }) {
  return (
    <header className="border-b border-line/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="ShopAssist AI home">
          <span className="spec-surface grid size-9 place-items-center rounded-lg border border-foreground/10 font-display text-sm font-bold text-glow">S</span>
          <span>
            <span className="block font-display text-base font-semibold tracking-tight">ShopAssist AI</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Campus commerce</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#capabilities" className="transition-colors hover:text-foreground">Capabilities</a>
          <button onClick={() => onNavigate("products")} className="transition-colors hover:text-foreground">Products</button>
        </nav>
        <Button onClick={onOpenAssistant} className="rounded-full bg-foreground px-4 text-background hover:bg-foreground/90">Open assistant</Button>
      </div>
    </header>
  );
}

function LandingPage({ onOpenAssistant, onNavigate }: { onOpenAssistant: () => void; onNavigate: (view: View) => void }) {
  return (
    <div className="app-shell min-h-screen overflow-hidden text-foreground">
      <LandingHeader onOpenAssistant={onOpenAssistant} onNavigate={onNavigate} />
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="relative z-10 lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-elevated/70 px-3 py-1 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-glow" /> Live agent console</span>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[1.03] tracking-tight lg:text-6xl">Customer support, <span className="text-glow">reimagined with AI.</span></h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">ShopAssist AI helps customers find products, track orders, manage returns and discover the right products through an intelligent support agent.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={onOpenAssistant} size="lg" className="rounded-full bg-glow px-5 font-semibold text-background hover:bg-glow/90">Try ShopAssist AI <ArrowRight /></Button>
              <a href="#how-it-works" className="inline-flex h-10 items-center rounded-full border border-foreground/15 bg-foreground/5 px-5 text-sm text-foreground transition-colors hover:bg-foreground/10">See how it works</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-8">
              <Metric value="98.4%" label="tickets auto-resolved" />
              <Metric value="4" label="core tools" />
              <Metric value="24/7" label="always available" />
            </div>
          </div>
          <div className="relative z-10 lg:col-span-7">
            <HeroConsole onOpenAssistant={onOpenAssistant} />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <SectionIntro eyebrow="One conversation" title="Everything customers need, in one place." copy="From the first product question to a completed return, the agent keeps the experience clear, useful, and connected." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={Search} title="Product queries" copy="Find products and get answers instantly." />
            <FeatureCard icon={PackageSearch} title="Order status" copy="Check order progress without contacting a human agent." />
            <FeatureCard icon={RotateCcw} title="Returns" copy="Handle return requests through a guided conversation." />
            <FeatureCard icon={Sparkles} title="Recommendations" copy="Get relevant suggestions based on customer needs." />
          </div>
        </section>

        <section id="how-it-works" className="border-y border-line/70 bg-surface/45">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div><SectionIntro eyebrow="How it works" title="A support agent that knows when to act." copy="ShopAssist is more than a chat window. It interprets intent, selects the right tool, and keeps useful context close at hand." />
              <div className="mt-10 space-y-6"><Step number="01" title="Ask" copy="Customers describe what they need in natural language." /><Step number="02" title="Act" copy="The agent selects the appropriate tool and retrieves the required information." /><Step number="03" title="Respond" copy="The agent returns a clear answer while remembering relevant context." /></div>
            </div>
            <ArchitectureDiagram />
          </div>
        </section>

        <section id="capabilities" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <SectionIntro eyebrow="Under the hood" title="Built for intelligent customer support." copy="A focused toolset makes the AI agent easy to understand, easy to demonstrate, and ready to connect to a real service later." />
          <div className="mt-10 grid gap-x-8 gap-y-3 md:grid-cols-2"><Capability title="Tool calling" copy="Automatically selects the appropriate tool based on the customer's request." /><Capability title="Memory" copy="Remembers useful information from the current conversation." /><Capability title="Product search" copy="Finds products based on customer requirements." /><Capability title="Order status" copy="Retrieves order information and delivery status." /><Capability title="Return handling" copy="Checks return eligibility and guides customers through the process." /><Capability title="Recommendations" copy="Suggests relevant products based on customer preferences." /></div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24"><div className="spec-surface flex flex-col gap-6 rounded-2xl border border-foreground/10 p-7 sm:flex-row sm:items-center sm:justify-between lg:p-10"><div><p className="text-xs uppercase tracking-[0.2em] text-glow">Ready when you are</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Open your AI support agent.</h2></div><Button onClick={onOpenAssistant} size="lg" className="rounded-full bg-glow font-semibold text-background hover:bg-glow/90">Open ShopAssist AI <ArrowRight /></Button></div></section>
      </main>
      <footer className="border-t border-line/70"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-elevated font-display text-sm font-bold text-glow">S</span><span className="font-display text-sm font-semibold">ShopAssist AI</span></div><p className="text-xs text-muted-foreground">AI-powered e-commerce customer support.</p></div></footer>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) { return <div><p className="font-display text-2xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>; }
function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div><p className="text-xs uppercase tracking-[0.2em] text-glow">{eyebrow}</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{copy}</p></div>; }
function FeatureCard({ icon: Icon, title, copy }: { icon: typeof Search; title: string; copy: string }) { return <div className="border-t border-line pt-5"><Icon className="size-5 text-glow" /><h3 className="mt-5 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p></div>; }
function Step({ number, title, copy }: { number: string; title: string; copy: string }) { return <div className="flex gap-4 border-t border-line pt-5"><span className="font-mono text-xs text-glow">{number}</span><div><h3 className="font-display text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p></div></div>; }
function Capability({ title, copy }: { title: string; copy: string }) { return <div className="border-t border-line py-5"><div className="flex items-center gap-2"><Check className="size-4 text-success" /><h3 className="font-display text-base font-semibold">{title}</h3></div><p className="mt-2 pl-6 text-sm leading-relaxed text-muted-foreground">{copy}</p></div>; }
function ArchitectureDiagram() { return <div className="spec-surface rounded-2xl border border-foreground/10 p-6 lg:p-8"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agent architecture</p><div className="mt-7 space-y-3 text-sm"><ArchitectureNode icon={MessageCircle} label="Customer" /><div className="ml-5 h-5 border-l border-dashed border-glow/60" /><ArchitectureNode icon={Bot} label="AI Agent" active /><div className="ml-5 h-5 border-l border-dashed border-glow/60" /><div className="border border-glow/20 bg-glow/5 p-4"><p className="text-xs uppercase tracking-[0.16em] text-glow">Tools</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><ToolChip label="Product search" /><ToolChip label="Order status" /><ToolChip label="Return handler" /><ToolChip label="Recommendation" /></div></div><div className="ml-5 h-5 border-l border-dashed border-glow/60" /><ArchitectureNode icon={Sparkles} label="Response + memory" /></div></div>; }
function ArchitectureNode({ icon: Icon, label, active = false }: { icon: typeof Bot; label: string; active?: boolean }) { return <div className={`flex items-center gap-3 border p-3 ${active ? "border-glow/30 bg-glow/10" : "border-line bg-background/50"}`}><Icon className={`size-4 ${active ? "text-glow" : "text-muted-foreground"}`} /><span className="font-medium">{label}</span></div>; }
function ToolChip({ label }: { label: string }) { return <div className="border border-line bg-background/50 px-3 py-2 text-xs text-muted-foreground">✓ {label}</div>; }
function HeroConsole({ onOpenAssistant }: { onOpenAssistant: () => void }) { return <div className="spec-surface rounded-2xl border border-foreground/10 p-4"><div className="grid gap-3 md:grid-cols-[1.7fr_1fr]"><div className="min-h-[360px] rounded-xl border border-foreground/5 bg-background/55 p-4"><div className="flex items-center justify-between"><p className="font-display text-sm font-semibold">Order #1024</p><span className="rounded-full bg-glow/15 px-2 py-0.5 text-[10px] font-medium text-glow">In transit</span></div><div className="mt-5 space-y-4"><HeroMessage text="Where is my order #1024?" /><HeroMessage text="Your order has shipped and is expected to arrive September 8." assistant /><div className="ml-8 border border-glow/20 bg-glow/5 p-3"><p className="text-[10px] uppercase tracking-wider text-glow">Order Status Tool</p><p className="mt-1 text-xs text-muted-foreground">Completed · response generated</p></div></div><div className="mt-6 flex gap-2"><button onClick={onOpenAssistant} className="rounded-lg bg-foreground/5 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-foreground/10">Check an order</button><button onClick={onOpenAssistant} className="rounded-lg bg-foreground/5 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-foreground/10">Find a product</button></div></div><div className="flex flex-col gap-3"><SmallPanel title="Memory" copy="Budget: $100 · Headphones" /><SmallPanel title="Tools" copy="search · orders · returns · reco" /><div className="flex-1 rounded-xl border border-foreground/5 bg-background/55 p-4"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommended</p>{products[0] && <MiniProduct product={products[0]} />}{products[4] && <MiniProduct product={products[4]} />}</div></div></div></div>; }
function HeroMessage({ text, assistant = false }: { text: string; assistant?: boolean }) { return <div className={`flex gap-2.5 ${assistant ? "ml-8" : ""}`}><div className={`mt-0.5 size-6 shrink-0 rounded-full ${assistant ? "bg-glow/30" : "bg-foreground/10"}`} /><p className={`text-sm ${assistant ? "text-foreground/90" : "text-muted-foreground"}`}>{text}</p></div>; }
function SmallPanel({ title, copy }: { title: string; copy: string }) { return <div className="rounded-xl border border-foreground/5 bg-background/55 p-4"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</p><p className="mt-2 text-xs text-foreground/80">{copy}</p></div>; }
function MiniProduct({ product }: { product: Product }) { return <div className="mt-3 flex items-center gap-2"><div className="grid size-8 shrink-0 place-items-center rounded-md bg-elevated ring-1 ring-foreground/10"><Headphones className="size-4 text-glow" /></div><div className="min-w-0"><p className="truncate text-xs text-foreground/85">{product.name}</p><p className="text-[10px] text-muted-foreground">${product.price} · {product.stock.toLowerCase()}</p></div></div>; }

function Sidebar({ activeView, onNavigate, onNewConversation }: { activeView: View; onNavigate: (view: View) => void; onNewConversation: () => void }) { return <aside className="hidden w-60 shrink-0 border-r border-line bg-surface/55 p-5 lg:block"><Brand /><Button variant="outline" onClick={onNewConversation} className="mt-7 w-full justify-start border-line bg-background/40 text-foreground hover:bg-elevated"><Sparkles className="text-glow" /> New conversation</Button><p className="mt-8 px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${activeView === id ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}`}><Icon className="size-4" />{label}</button>)}<button onClick={() => onNavigate("settings")} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${activeView === "settings" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}`}><Settings className="size-4" />Settings</button></nav><div className="mt-8 border-t border-line pt-5"><p className="px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Recent conversations</p><div className="mt-3 space-y-1 text-xs text-muted-foreground"><button className="block w-full truncate px-2 py-2 text-left hover:text-foreground">Order #1024</button><button className="block w-full truncate px-2 py-2 text-left hover:text-foreground">Headphone recommendation</button><button className="block w-full truncate px-2 py-2 text-left hover:text-foreground">Return request</button></div></div><div className="mt-auto pt-12"><div className="flex items-center gap-2 px-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-success" /> Agent online</div></div></aside>; }
function Brand() { return <div className="flex items-center gap-3"><span className="spec-surface grid size-9 place-items-center rounded-lg border border-foreground/10 font-display text-sm font-bold text-glow">S</span><div><p className="font-display text-base font-semibold tracking-tight">ShopAssist AI</p><p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Agent console</p></div></div>; }

function AssistantWorkspace({ onNavigate, onBack, mobileNavOpen, onToggleMobileNav }: { onNavigate: (view: View) => void; onBack: () => void; mobileNavOpen: boolean; onToggleMobileNav: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memory, setMemory] = useState<MemoryState>({});
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityOpen, setActivityOpen] = useState(false);
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError("");
    setLoading(true);
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    try {
      const response = await sendMessageToAgent(trimmed, sessionId);
      setMessages((current) => [...current, { id: Date.now(), role: "assistant", text: response.text, response }]);
      if (response.memoryUsed) setMemory((current) => current);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The support agent is unavailable.");
    } finally {
      setLoading(false);
    }
  };
  const clearConversation = () => {
    setMessages([]);
    setMemory({});
    setSessionId(crypto.randomUUID());
    setReturnSubmitted(false);
    setError("");
  };
  const lastResponse = [...messages].reverse().find((message) => message.response)?.response;

  return <div className="app-shell flex min-h-screen text-foreground"><Sidebar activeView="assistant" onNavigate={onNavigate} onNewConversation={clearConversation} /><div className="flex min-w-0 flex-1 flex-col"><header className="flex h-20 shrink-0 items-center justify-between border-b border-line bg-background/70 px-4 backdrop-blur-xl sm:px-6"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={onToggleMobileNav} className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground lg:hidden" aria-label="Toggle navigation"><Menu /></Button><Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"><ArrowLeft /> <span className="hidden sm:inline">Back</span></Button><div><p className="font-display text-lg font-semibold tracking-tight">AI Customer Support</p><p className="text-xs text-muted-foreground">ShopAssist AI Agent <span className="mx-1 text-line">·</span><span className="text-success">● Online</span></p></div></div><div className="flex items-center gap-2"><Button variant="ghost" size="sm" onClick={clearConversation} className="hidden text-muted-foreground hover:bg-foreground/10 hover:text-foreground sm:inline-flex">Clear conversation</Button><Button variant="ghost" size="icon" onClick={() => setActivityOpen((open) => !open)} className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground lg:hidden" aria-label="Toggle activity"><PanelRight /></Button></div></header>{mobileNavOpen && <MobileNav activeView="assistant" onNavigate={onNavigate} onClose={onToggleMobileNav} />}{activityOpen && <div className="border-b border-line bg-surface p-4 lg:hidden"><AgentActivity lastResponse={lastResponse} memory={memory} /></div>}<div className="flex min-h-0 flex-1"><main className="flex min-w-0 flex-1 flex-col"><ChatPanel messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} error={error} lastResponse={lastResponse} memory={memory} returnSubmitted={returnSubmitted} setReturnSubmitted={setReturnSubmitted} /><p className="px-4 pb-4 text-center text-[11px] text-muted-foreground">AI responses may contain mistakes. Verify important order information.</p></main><aside className="hidden w-72 shrink-0 border-l border-line bg-surface/45 p-5 xl:block"><AgentActivity lastResponse={lastResponse} memory={memory} /></aside></div></div></div>;
}

function MobileNav({ activeView, onNavigate, onClose }: { activeView: View; onNavigate: (view: View) => void; onClose: () => void }) { return <div className="absolute left-0 right-0 top-20 z-20 border-b border-line bg-surface p-4 shadow-2xl lg:hidden"><div className="mb-4 flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation"><X /></Button></div><div className="grid gap-1">{[...navItems, { id: "settings" as View, label: "Settings", icon: Settings }].map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`flex items-center gap-3 px-3 py-3 text-left text-sm ${activeView === id ? "bg-foreground/10" : "text-muted-foreground"}`}><Icon className="size-4" />{label}</button>)}</div></div>; }

function ChatPanel({ messages, input, setInput, sendMessage, loading, error, lastResponse, memory, returnSubmitted, setReturnSubmitted }: { messages: ChatMessage[]; input: string; setInput: (value: string) => void; sendMessage: (text: string) => void; loading: boolean; error: string; lastResponse: AgentResponse | undefined; memory: MemoryState; returnSubmitted: boolean; setReturnSubmitted: (value: boolean) => void }) { const quickActions = [{ label: "Product search", prompt: "Do you have wireless headphones?", icon: Search }, { label: "Track order", prompt: "Where is my order #1024?", icon: PackageSearch }, { label: "Return item", prompt: "I want to return order #1024.", icon: RotateCcw }, { label: "Get recommendation", prompt: "I need headphones under $100.", icon: Sparkles }]; return <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-8"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conversation</p><p className="mt-1 text-sm text-foreground/70">Connected to ShopAssist AI backend</p></div><div className="flex items-center gap-2 text-xs text-success"><span className="size-1.5 rounded-full bg-success" /> Memory active</div></div><div className="flex-1 space-y-5 overflow-y-auto">{messages.length === 0 ? <WelcomeState quickActions={quickActions} onAction={sendMessage} /> : messages.map((message) => <div key={message.id} className={`message-in flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] ${message.role === "user" ? "rounded-2xl rounded-tr-sm bg-glow px-4 py-3 text-background" : "w-full max-w-2xl rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-4"}`}><p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>{message.response && <ResponseContent response={message.response} memory={memory} returnSubmitted={returnSubmitted} setReturnSubmitted={setReturnSubmitted} />}</div></div>)}{loading && <div className="text-sm text-muted-foreground">ShopAssist AI is thinking…</div>}{error && <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error} Check that the backend is running at http://localhost:8000.</div>}</div><form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface p-2"><Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground" aria-label="Ask for help"><CircleHelp /></Button><Input value={input} disabled={loading} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a product, order, or return…" className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0" /><Button type="submit" disabled={loading} size="icon" className="bg-glow text-background hover:bg-glow/90" aria-label="Send message"><Send /></Button></form></div>; }
function WelcomeState({ quickActions, onAction }: { quickActions: Array<{ label: string; prompt: string; icon: typeof Search }>; onAction: (prompt: string) => void }) { return <div className="flex min-h-[430px] flex-col justify-center"><div className="mb-8 max-w-xl"><div className="mb-5 grid size-12 place-items-center rounded-xl bg-glow/10 text-glow"><Bot /></div><h1 className="font-display text-3xl font-semibold tracking-tight">Hello, I’m ShopAssist AI.</h1><p className="mt-3 text-base leading-relaxed text-muted-foreground">I can help you find products, check orders, handle returns and recommend products based on your needs.</p></div><div className="grid gap-3 sm:grid-cols-2">{quickActions.map(({ label, prompt, icon: Icon }) => <button key={label} onClick={() => onAction(prompt)} className="flex items-center gap-3 border border-line bg-surface/70 p-4 text-left transition-colors hover:border-glow/35 hover:bg-elevated"><Icon className="size-4 text-glow" /><span className="text-sm font-medium">{label}</span><ArrowRight className="ml-auto size-4 text-muted-foreground" /></button>)}</div></div>; }

function ResponseContent({ response, memory }: { response: AgentResponse; memory: MemoryState }) { return <div className="mt-4 space-y-4"><div className="flex items-center gap-2 border-t border-line pt-3 text-xs text-success"><Check className="size-3.5" /> {response.tool} <span className="text-muted-foreground">· Completed</span></div>{response.memoryUsed && <div className="flex items-start gap-2 border border-success/20 bg-success/5 p-3 text-xs text-success"><Sparkles className="mt-0.5 size-3.5" /><span><strong>Memory used</strong>{memory.budget ? ` · Budget: $${memory.budget}` : ""}{memory.category ? ` · Category: ${memory.category}` : ""}</span></div>}</div>; }
function OrderCard({ order }: { order: Order }) { return <div className="border border-line bg-background/45 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Order #{order.id}</p><p className="mt-1 font-display font-semibold">{order.productName}</p></div><StatusBadge status={order.status} /></div><div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2"><p>Expected delivery <span className="text-foreground">{order.expectedDelivery}</span></p><p>Return eligible <span className="text-success">{order.returnEligible ? "Yes" : "No"}</span></p></div></div>; }
function AgentActivity({ lastResponse, memory }: { lastResponse: AgentResponse | undefined; memory: MemoryState }) { return <div><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agent activity</p><span className="flex items-center gap-1.5 text-xs text-success"><span className="size-1.5 rounded-full bg-success" /> Agent Online</span></div><div className="mt-5 space-y-5"><ActivityGroup title="Capabilities" items={["Product Search", "Order Status", "Return Handling", "Recommendations", "Conversation Memory"]} /><ActivityGroup title="Recent activity" items={lastResponse ? [lastResponse.tool, "Completed"] : ["Waiting for a request", "Ready to select a tool"]} /><div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Memory</p><div className="mt-3 border border-line bg-background/45 p-3 text-xs text-muted-foreground">{memory.budget ? <><span className="text-success">Active</span><br />Budget: ${memory.budget}<br />Category: {memory.category}</> : <><span className="text-muted-foreground">Active</span><br />Useful preferences will appear here.</>}</div></div></div></div>; }
function ActivityGroup({ title, items }: { title: string; items: string[] }) { return <div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p><div className="mt-3 space-y-2.5">{items.map((item) => <div key={item} className="flex items-center gap-2 text-xs text-foreground/80"><Check className="size-3.5 text-success" />{item}</div>)}</div></div>; }

function PageFrame({ title, eyebrow, children, onOpenAssistant, onBack }: { title: string; eyebrow: string; children: ReactNode; onOpenAssistant: () => void; onBack: () => void }) { return <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"><div className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end"><div><Button variant="ghost" size="sm" onClick={onBack} className="mb-5 -ml-3 gap-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"><ArrowLeft /> Back</Button><p className="text-xs uppercase tracking-[0.2em] text-glow">{eyebrow}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{title}</h1></div><Button onClick={onOpenAssistant} className="rounded-full bg-glow font-semibold text-background hover:bg-glow/90">Ask the assistant <ArrowRight /></Button></div>{children}</div>; }
function ProductsView({ onOpenAssistant, onBack }: { onOpenAssistant: () => void; onBack: () => void }) { const [query, setQuery] = useState(""); const [category, setCategory] = useState<"All" | ProductCategory>("All"); const filtered = products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase())); return <PageFrame title="Products" eyebrow="Product search" onOpenAssistant={onOpenAssistant} onBack={onBack}><div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="h-11 border-line bg-surface pl-10" /></div><div className="flex gap-2 overflow-x-auto">{["All", "Headphones", "Wearables", "Accessories"].map((item) => <button key={item} onClick={() => setCategory(item as "All" | ProductCategory)} className={`whitespace-nowrap border px-4 text-sm ${category === item ? "border-glow/40 bg-glow/10 text-glow" : "border-line bg-surface text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>{filtered.length === 0 && <div className="py-20 text-center text-muted-foreground">No products matched that search.</div>}</PageFrame>; }
function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) { return <article className={`border border-line bg-surface/70 p-4 ${compact ? "text-xs" : ""}`}><div className={`${compact ? "h-20" : "h-36"} grid place-items-center rounded-lg bg-elevated`}><Headphones className={`${compact ? "size-7" : "size-10"} text-glow`} /></div><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-display font-semibold">{product.name}</h3><p className="mt-1 text-muted-foreground">{product.description}</p></div><span className="shrink-0 font-display font-semibold">${product.price}</span></div><div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1 text-glow"><Star className="size-3 fill-current" /> {product.rating}</span><span>{product.stock}</span></div>{!compact && <Button variant="outline" className="mt-4 w-full border-line bg-background/50 hover:bg-elevated">View product</Button>}</article>; }
function OrdersView({ onOpenAssistant, onBack }: { onOpenAssistant: () => void; onBack: () => void }) { const [selected, setSelected] = useState<Order | null>(null); return <PageFrame title="Orders" eyebrow="Order status" onOpenAssistant={onOpenAssistant} onBack={onBack}><div className="mt-8 grid gap-4 lg:grid-cols-3">{orders.map((order) => <article key={order.id} className="border border-line bg-surface/70 p-5"><div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">#{order.id}</span><StatusBadge status={order.status} /></div><h2 className="mt-8 font-display text-xl font-semibold">{order.productName}</h2><p className="mt-1 text-sm text-muted-foreground">${order.price} · Expected {order.expectedDelivery}</p><Button onClick={() => setSelected(order)} variant="outline" className="mt-6 w-full border-line bg-background/50 hover:bg-elevated">View details <ChevronDown /></Button></article>)}</div>{selected && <OrderDetails order={selected} onClose={() => setSelected(null)} />}</PageFrame>; }
function StatusBadge({ status }: { status: string }) { return <span className="rounded-full bg-glow/10 px-2.5 py-1 text-[10px] font-medium text-glow">{status}</span>; }
function OrderDetails({ order, onClose }: { order: Order; onClose: () => void }) { return <div className="mt-8 border border-line bg-surface p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-glow">Order #{order.id}</p><h2 className="mt-2 font-display text-2xl font-semibold">{order.productName}</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close order details"><X /></Button></div><div className="mt-8 grid gap-4 md:grid-cols-5">{["Order placed", "Processing", "Shipped", "Out for delivery", "Delivered"].map((step, index) => <div key={step} className="flex items-start gap-3 md:block"><span className={`grid size-7 place-items-center rounded-full text-xs ${index < (order.status === "Delivered" ? 5 : order.status === "Shipped" ? 3 : 2) ? "bg-success text-background" : "border border-line text-muted-foreground"}`}>{index < 3 ? <Check className="size-3.5" /> : index + 1}</span><p className="mt-1 text-sm text-muted-foreground">{step}</p></div>)}</div><div className="mt-8 border-t border-line pt-5 text-sm text-muted-foreground"><p>Expected delivery <span className="text-foreground">{order.expectedDelivery}</span></p><p className="mt-2">Return eligible <span className="text-success">{order.returnEligible ? "Yes" : "No"}</span></p></div></div>; }
function ReturnForm({ submitted, onSubmitted }: { submitted: boolean; onSubmitted: () => void }) { const [reason, setReason] = useState("Not satisfied"); const [comments, setComments] = useState(""); if (submitted) return <div className="border border-success/25 bg-success/5 p-4"><p className="flex items-center gap-2 font-medium text-success"><Check className="size-4" /> Return request submitted successfully.</p><p className="mt-2 text-xs text-muted-foreground">Return reference: <span className="text-foreground">RET-2048</span></p></div>; return <div className="border border-line bg-background/45 p-4"><div className="grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Order</p><p className="mt-2 text-sm">#1024 · Wireless Headphones</p></div><div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Reason</p><select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 h-9 w-full border border-line bg-surface px-3 text-sm text-foreground outline-none"><option>Product damaged</option><option>Wrong product</option><option>Not satisfied</option><option>Other</option></select></div></div><Textarea value={comments} onChange={(event) => setComments(event.target.value)} placeholder="Additional information (optional)" className="mt-4 min-h-20 border-line bg-surface" /><Button onClick={onSubmitted} className="mt-4 bg-glow font-semibold text-background hover:bg-glow/90">Submit return request <ArrowRight /></Button></div>; }
function ReturnsView({ onOpenAssistant, onBack }: { onOpenAssistant: () => void; onBack: () => void }) { const [submitted, setSubmitted] = useState(false); return <PageFrame title="Return an item" eyebrow="Return handler" onOpenAssistant={onOpenAssistant} onBack={onBack}>{submitted ? <div className="mt-12 max-w-xl border border-success/25 bg-success/5 p-7"><div className="grid size-10 place-items-center rounded-full bg-success/15 text-success"><Check /></div><h2 className="mt-5 font-display text-2xl font-semibold">Return request submitted successfully.</h2><p className="mt-3 text-sm text-muted-foreground">Your request for order #1024 is on its way to the support queue.</p><p className="mt-5 text-sm">Return reference: <span className="font-mono text-glow">RET-2048</span></p></div> : <div className="mt-10 max-w-2xl border border-line bg-surface p-6"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Select order"><select className="form-select"><option>#1024 · Wireless Headphones</option><option>#1025 · SmartFit Watch</option></select></FormField><FormField label="Select product"><select className="form-select"><option>Wireless Headphones</option><option>SmartFit Watch</option></select></FormField></div><FormField label="Reason"><select className="form-select"><option>Product damaged</option><option>Wrong product</option><option>Not satisfied</option><option>Other</option></select></FormField><FormField label="Additional comments"><Textarea placeholder="Tell us a little more (optional)" className="border-line bg-background/45" /></FormField><Button onClick={() => setSubmitted(true)} className="bg-glow font-semibold text-background hover:bg-glow/90">Submit return request <ArrowRight /></Button></div>}</PageFrame>; }
function FormField({ label, children }: { label: string; children: ReactNode }) { return <label className="mt-5 block text-sm"><span className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>{children}</label>; }
function SettingsView({ onOpenAssistant, onBack }: { onOpenAssistant: () => void; onBack: () => void }) { return <PageFrame title="Settings & about" eyebrow="ShopAssist AI" onOpenAssistant={onOpenAssistant} onBack={onBack}><div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-2"><div className="border border-line bg-surface p-6"><Store className="size-5 text-glow" /><h2 className="mt-5 font-display text-xl font-semibold">About the project</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">ShopAssist AI is a college project demonstrating an e-commerce support agent that uses tool calling and conversation memory to solve common customer requests.</p></div><div className="border border-line bg-surface p-6"><Sparkles className="size-5 text-glow" /><h2 className="mt-5 font-display text-xl font-semibold">Current setup</h2><div className="mt-4 space-y-3 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Check className="size-4 text-success" /> Mock product and order data</p><p className="flex items-center gap-2"><Check className="size-4 text-success" /> Client-side conversation memory</p><p className="flex items-center gap-2"><Check className="size-4 text-success" /> Replaceable AI service layer</p><p className="flex items-center gap-2"><Check className="size-4 text-success" /> No account or API key required</p></div></div></div></PageFrame>; }