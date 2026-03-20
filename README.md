# SwarmShield X — Phase 1 Idea Document

**Project:** SwarmShield X  
**Target Event:** Guidewire DEVTrails 2026

SwarmShield X is a micro-parametric, predictive income protection system designed specifically for gig workers. It shifts insurance from reactive indemnity to proactive **income protection** using swarm intelligence.

---

## 1. Requirement, Persona Scenarios, and Workflow

### The Requirement
Gig workers trade active time for money. Traditional insurance protects their physical health or vehicle but completely ignores their most perishable asset: **Time**. When unexpected, localized disruptions happen, gig workers lose their daily profit margin instantly.

### Persona & Scenario
* **Persona:** Swiggy/Zomato Delivery Partners in Chennai.
* **Scenario:** A delivery partner operates in Velachery. During peak dinner hours (7 PM - 9 PM), a severe localized flash flood occurs, or an unplanned VIP gridlock traps them on Mount Road. They are safe, but they lose 2 hours of active earning time (approx. ₹350 loss). Traditional insurance does not cover this micro-disruption.

### System Workflow (Predict -> Prevent -> Protect)
1. **Onboarding:** Worker links their Swiggy/Zomato ID (via Account Aggregator) to establish historical baseline hourly earnings and frequent zones. The policy is registered via Guidewire PolicyCenter.
2. **Weekly micro-premium:** User subscribes to a dynamic micro-premium deducted directly from their wallet.
3. **Risk Prediction:** System maps live weather and traffic APIs over the city using Uber's H3 Hexagonal spatial index.
4. **Preventive Suggestion:** The system predicts severe waterlogging in Velachery in 60 minutes and sends an audio alert nudging the driver to a safer, high-demand zone (e.g., Adyar).
5. **Trigger Detection:** If the worker is trapped, the system uses "Swarm Intelligence." If 40+ workers in a 2 sq km grid all suddenly drop to zero speed and zero completed deliveries, it verifies a disruption.
6. **Automatic Payout:** A micro-payout is instantly triggered via Guidewire ClaimCenter smart contracts to cover the earnings gap. No manual claims needed.

---

## 2. Weekly Premium Model, Parametric Triggers, and Platform

### Weekly Premium Model
The premium is dynamic and hyper-personalized. A worker in a safe zone doesn't subsidize someone in a high-risk zone.
* **Formula:** `Premium = (Base Rate × Local Risk Multiplier × Time Exposure Factor) - Swarm Contributor Discount`
* **Example:** Base (₹10) × Risk (1.2 for flood-prone zone) × Exposure (1.5 for evening shifts) - Telemetry Discount (₹3) = **₹15 per week**.

### Parametric Triggers
Payouts are automatic based on undeniable mathematical consensus (the "Swarm").
1. **Flash Floods:** Rainfall > 30mm/hr (OpenWeather API) + 70% drop in active deliveries across the local swarm.
2. **Localized Gridlock:** Average swarm mobility speed in a micro-zone drops below 5 km/h for >40 minutes (Google Traffic API + GPS Telemetry).
3. **Restaurant Hub/Tech Outage:** High concentration of workers (>30) clustered at a major commercial hub with zero outgoing trips for >45 minutes.

### Platform Justification: Mobile App
Gig workers operate entirely from budget smartphones mounted on scooters in direct sunlight or heavy rain.
* **Why Mobile?:** A React Native Mobile App allows us to utilize high-contrast Dark Mode (battery saving), large tappable elements, background GPS telemetry, and Bluetooth audio-first alerts to ensure safety without requiring screen interaction. A web platform is insufficient for hardware-level telemetry and quick glances while driving.

---

## 3. AI/ML Integration Plan

* **Premium Calculation (Dynamic Pricing):** AI models analyze worker behavioral patterns to dynamically adjust the underlying "Risk Multiplier" in the premium formula every week based on the zones they frequent most.
* **Risk Prediction (Time-Series Forecasting):** We use Prophet or LSTMs to ingest historical weather data, traffic density, and municipal alerts to forecast disruptions 1-2 hours in advance.
* **Fraud Detection (Anomaly Detection):** The system relies on absolute consensus, eliminating fake manual claims. We use Isolation Forests targeting spatial anomalies to prevent GPS spoofing. If one worker's telemetry places them in a flooded zone, but 50 nearby workers are moving normally and completing trips, the outlier is mathematically flagged and payout is denied.

---

## 4. Tech Stack & Development Plan

### Tech Stack
* **Frontend:** React Native (Mobile Prototype)
* **Backend:** Node.js / Express (for handling high-frequency telemetry websockets)
* **Database:** TimescaleDB (PostgreSQL optimized for time-series geospatial data) + Redis (Real-time caching)
* **Core Systems:** Guidewire Cloud APIs (PolicyCenter/ClaimCenter simulation)
* **APIs:** OpenWeatherMap, Google Maps Mobility, Uber H3 Spatial Index

### Development Plan
* **Week 1:** UI/UX scaffolding for the mobile app (Dashboard, Active Policy, Alert System).
* **Week 2:** Backend API integration (mocking weather, traffic, and swarm telemetry data into the database).
* **Week 3:** Smart contract/Parametric logic implementation (Trigger > Threshold > Payout) with Guidewire API simulation.
* **Week 4:** Integration testing, UX refinement, demo video recording, and final documentation submission.

---

## 5. Video Prototype Strategy (Demo Flow)
For the 2-minute prototype video, the flow will clearly outline our core strategy:
1. **Prediction:** UI Map shows a pulsing red radius over Velachery. Audio alert: *"High risk of flash flooding in 1 hour."*
2. **Suggestion:** A notification pops up: *"Surge demand in Guindy. Reroute now."*
3. **Disruption:** The map hex turns dark red as the localized event hits. A counter shows 'Swarm Speed' rapidly dropping. 
4. **Payout:** The system registers "Swarm Consensus Reached". An instant parametric payout triggers automatically, protecting the worker's income.
