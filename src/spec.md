# Specification

## Summary
**Goal:** Add a second dashboard tab that shows a compact “Prices only” view for the top 50 crypto assets while keeping the existing full market table as the default view.

**Planned changes:**
- Add a tab control to the crypto dashboard with two English-labeled tabs (e.g., “Overview” and “Prices”), defaulting to the existing table view.
- Reuse the existing `useCryptoMarketData` query result for both tabs so switching tabs does not trigger a separate network request.
- Keep the refresh interval selector and loading spinner available and behaving the same on both tabs.
- Implement the “Prices” tab content as a compact list for the top 50 assets showing only: rank, coin icon (with existing placeholder behavior on failure), name, symbol, and current price in EUR.
- Ensure existing error handling (including “Failed to load market data”) is shown consistently for both tabs.

**User-visible outcome:** Users can switch between the existing market overview table and a new “Prices” tab that displays a compact list of the top 50 coins with just rank, icon, name/symbol, and EUR price, without changing refresh/loading/error behavior.
