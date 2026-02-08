# Specification

## Summary
**Goal:** Switch the crypto dashboard market data provider from CoinCap to CoinPaprika, including API key configuration, while keeping the dashboard behavior and data shape unchanged.

**Planned changes:**
- Update `frontend/src/features/crypto/useCryptoMarketData.ts` to fetch the top 50 assets from CoinPaprika (EUR pricing) and keep React Query auto-refresh at 5 seconds.
- Add configurable CoinPaprika API key support and fail fast with a clear developer-facing error when the key is missing/empty (no fallback provider).
- Maintain the existing `CryptoAsset` return shape for `CryptoDashboard`, including robust mapping and a safe fallback for missing/broken asset images to prevent layout breaks or crashes.

**User-visible outcome:** The crypto dashboard continues to show a EUR-priced table of the top 50 assets (#1–#50) refreshing every 5 seconds, now powered by CoinPaprika, with stable rendering even when some assets have missing logos.
