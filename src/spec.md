# Specification

## Summary
**Goal:** Swap out the CoinGecko market data provider for a no-API-key public REST API while keeping the dashboard behavior unchanged, and add a persistent Dark Mode toggle.

**Planned changes:**
- Replace the CoinGecko `/coins/markets` fetch with an alternative public crypto market data REST API that requires no API key, maintaining: top 50 by market cap, EUR pricing, and auto-refresh every 5 seconds.
- Update the data-mapping layer so the hook continues to return the existing `CryptoAsset` shape used by `CryptoDashboard` (id, symbol, name, current_price, market_cap, market_cap_rank, price_change_percentage_24h, total_volume, image).
- Improve error handling so non-2xx responses throw a descriptive error (status code + statusText) that surfaces in the existing error UI.
- Add a user-facing theme toggle (English labels) and implement Tailwind class-based dark mode by toggling the `dark` class on the document root.
- Persist the user’s theme preference across reloads (e.g., localStorage) and keep the dashboard readable/consistent using existing CSS variables in `frontend/src/index.css`.

**User-visible outcome:** The dashboard continues to show the top 50 cryptocurrencies in EUR with 5-second refreshes using a non-CoinGecko public API, and users can switch between Light/Dark mode with their choice remembered after reload.
