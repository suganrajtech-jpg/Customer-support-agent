# ShopAssist AI frontend

## Outcome
Build the complete mock-data frontend described in the uploaded brief: a warm, premium ShopAssist AI landing page plus a fully interactive support workspace.

## User-facing work
- Create a responsive landing page with the specified sections, architecture explanation, CTA, and navigation.
- Create an assistant workspace with sidebar navigation, chat, quick actions, mock tool-call activity, memory indicators, order timeline, product cards, and return flow.
- Add Products, Orders, Returns, and Settings/About views with working search, filtering, order details, and form submission states.
- Add client-side mock data and a replaceable `aiService` layer; no database, authentication, payments, or external API keys.

## Technical details
- Use the existing TanStack Router route structure and keep `/` as the landing page.
- Add a single app route with client-side view state so the sidebar and CTAs work without unnecessary route sprawl.
- Define the ivory/sand/charcoal/olive design tokens in `src/styles.css`, load the selected typography from the root head, and use Lucide icons with semantic button styles.
- Validate the result with the project build signal and a live browser check for primary flows.
