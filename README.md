# 🚀 AgentBoost: Enterprise Multi-Agent Orchestration Platform

AgentBoost is an enterprise-grade AI operating ecosystem designed to automate complex, repetitive business workflows safely. By deploying a hybrid cross-platform architecture, AgentBoost lets organizations choose between lightning-fast cloud power or 100% private, offline, on-device computing across Web, Desktop, and Mobile.

---

## 🏗️ Unified Cross-Platform Architecture

```text
┌──────────────────────────────┐
│   AGENTBOOST CLOUD CONSOLE   │
│     (Next.js / Supabase)     │
└──────────────┬───────────────┘
               │
   [ Real-Time Sync Registry ]
               │
┌──────────────┼──────────────┐
▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  VERCEL WEB  │ │    TAURI     │ │  ON-DEVICE   │
│    PORTAL    │ │   DESKTOP    │ │    MOBILE    │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 💻 1. Tauri Desktop Companion Workspace (Windows, macOS, Linux)
* **Multi-Agent Canvas Panel:** Visually chain and step-execute complex, multi-tiered business automation pipelines sequentially.
* **Floating Utility Widgets:** Spawn lightweight, specialized micro-overlays (`always-on-top`) configured to execute specific task structures right next to your active work apps.
* **System Tray Persistence:** Runs quietly in the OS taskbar footprint, managing active multi-step automation chains without stealing active monitor space.

### 📱 2. On-Device Mobile App Engine (Next-Gen Native Upgrade)
* **Local Edge Gallery Integration:** Runs specialized business skills **100% offline and privately** using local model parameters right on your team's hardware.
* **Zero-Trust Corporate Security:** Confidential data never leaves the mobile processor—eliminating corporate data breach liabilities completely.
* **On-the-Go Automation:** Execute lead scoring, contract review alerts, and quick CRM sync steps via an ultra-low latency mobile layout.

### 🌐 3. Centralized Web Console (Vercel Cloud Hub)
* **Semantic Skill Routing Matrix:** Manages and indexes massive skill libraries instantly via a Supabase `pgvector` index cluster (<45ms retrieval latency).
* **Cryptographic Token Minting:** Generates secure workspace access keys (`sk_live_...`) to easily authenticate downloadable desktop and mobile client endpoints.
* **Compute Savings Ledger:** A real-time executive dashboard calculating precise dollar amounts saved by processing text payloads on-device vs. cloud APIs.

---

## ⚡ Cross-Platform Setup & Local Development

### 1. Environment Variables Configuration
Ensure your targeting environment variables are successfully active before starting compilation:
```bash
export OPENAI_API_KEY="sk_your_key"
export NEXT_PUBLIC_SUPABASE_URL="https://supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_secret_service_key"
```

### 2. Synchronize Your Skill Registry
Before spinning up the clients, generate your 1536-dimension vector embeddings using the automated pipeline:
```bash
python agentboost_tool.py
```

### 3. Compilation Framework Triggers

* **To run the Web Portal locally:**
  ```bash
  npm run dev
  ```
* **To launch the Desktop Application Container:**
  ```bash
  npm run build
  npm run tauri dev
  ```
* **To initialize Mobile Native Build Environment:**
  *(Follow the upcoming mobile workspace deployment guide inside `/apps/mobile`)*
