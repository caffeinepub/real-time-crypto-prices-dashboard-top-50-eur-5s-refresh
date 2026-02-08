# Specification

## Summary
**Goal:** Update the crypto dashboard auto-refresh behavior to default to 5 minutes and let users choose a preset refresh interval from the UI.

**Planned changes:**
- Change the default `VITE_CRYPTO_REFRESH_INTERVAL_MS` fallback from 5 seconds to 5 minutes (300000ms) when the env var is unset or empty, while keeping the existing invalid-value error behavior.
- Add a dashboard refresh-interval preset selector with options labeled exactly: "1m", "5m", "15m", "30m", with visible selected state and keyboard accessibility.
- Make the effective interval used by `useCryptoMarketData` update immediately when a preset is selected (no reload required).
- Update the dashboard subtitle to display the effective refresh interval (in seconds) reflecting either the env/default value or the user-selected preset.
- Update `frontend/.env.example` to document the new 5-minute default and include an explicit example `VITE_CRYPTO_REFRESH_INTERVAL_MS=300000`.

**User-visible outcome:** The dashboard refreshes every 5 minutes by default, and users can switch refresh frequency to 1m/5m/15m/30m from an on-page control with the subtitle reflecting the current effective interval.
