# @noelclaw/research

[![npm version](https://img.shields.io/npm/v/@noelclaw/research.svg)](https://www.npmjs.com/package/@noelclaw/research) ![version](https://img.shields.io/badge/version-1.9.0-blue)

Noelclaw as an MCP skill — market intelligence, autonomous research, DeFi execution, and multi-agent swarm coordination. Gives Claude, Cursor, Hermes, and any MCP-compatible AI client access to live crypto signals, whale tracking, on-chain DeFi, and a self-improving agent swarm.

```bash
npx @noelclaw/research@latest
```

---

## Tools

### Market & Signals

| Tool | Description |
|------|-------------|
| `get_market_data` | Live top-20 coins by market cap, trending coins, and key prices for BTC/ETH/SOL |
| `get_token_data` | Price, 24h change, market cap, and volume for any token |
| `get_latest_signal` | Latest BTC and/or ETH 1H trading signals — entry, TP targets, stop loss, confidence score |
| `get_signal_history` | Signal history with win/loss record and winrate stats |
| `get_smart_money_alerts` | Smart money and insider wallet movements for micro-cap tokens on Base, Solana, and ETH |
| `get_daily_recap` | Today's trading performance recap with winrate, PnL stats, and AI review |

### Research & AI

| Tool | Description |
|------|-------------|
| `research` | On-demand crypto research — like Perplexity but for crypto. Returns structured analysis: overview, key findings, market impact, affected tokens, sentiment, and what to watch |
| `ask_noel` | Ask Noel AI for DeFi analysis, trade ideas, market outlook, and crypto research — with live market context |
| `get_insight` | Noel's on-demand crypto + macro briefing — what's happening right now in crypto, macro, and X/Twitter narratives |

### Wallet & DeFi

| Tool | Description |
|------|-------------|
| `get_portfolio` | Full token portfolio on Base mainnet with ETH and ERC-20 balances and USD values |
| `swap_tokens` | Swap ETH, USDC, USDT, DAI, WETH on Base mainnet via 0x Permit2 — human-readable amounts |
| `send_token` | Send ETH or any ERC-20 token to any address on Base mainnet |

### Automations

| Tool | Description |
|------|-------------|
| `create_automation` | Create an automation in plain English — DCA, price alerts, conditional buys/sells, recurring updates |
| `list_automations` | List all your automations with status, run counts, and next scheduled run |
| `pause_automation` | Pause or resume an automation by ID |
| `delete_automation` | Permanently delete an automation |

### Swarm

| Tool | Description |
|------|-------------|
| `start_swarm` | Start the multi-agent swarm for autonomous market monitoring, sentiment tracking, and workflow execution |
| `stop_swarm` | Stop the active swarm session |
| `get_swarm_status` | See active agents, shared memory snapshot, execution scores, and recent runs |
| `write_swarm_memory` | Write a key-value entry to the swarm's shared memory (with optional TTL) |
| `get_swarm_memory` | Read a value from the swarm's shared memory by key |
| `get_execution_scores` | See which workflows are improving — success rate, win/loss, avg duration, last adapted |

---

## Quick Install

### Recommended: npx (no install required)

```bash
npx @noelclaw/research@latest
```

### Claude Code

```bash
claude mcp add noelclaw -- npx @noelclaw/research@latest
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research@latest"]
    }
  }
}
```

Restart Claude Desktop. Tools appear automatically.

### Cursor / Windsurf

Open **Settings → MCP** or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research@latest"]
    }
  }
}
```

### Hermes Agent

```bash
hermes mcp add noelclaw --command npx --args @noelclaw/research@latest
```

Or in your Hermes config:

```yaml
mcp_servers:
  noelclaw:
    command: npx
    args:
      - "@noelclaw/research@latest"
```

### OpenClaw / custom MCP client

```json
{
  "servers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research@latest"]
    }
  }
}
```

---

## Environment Variables

No env vars are required. These are available if needed:

### Auth & Session

| Var | Description |
|-----|-------------|
| `NOELCLAW_API_KEY` | Link to your noelclaw.xyz account (`noel_sk_xxx` from Settings → API Keys) |
| `NOELCLAW_SESSION_TOKEN` | Alternative session token from noelclaw.xyz |

### DeFi

| Var | Description |
|-----|-------------|
| `ALCHEMY_API_KEY` | Alchemy key for faster/more reliable swap and portfolio queries on Base |

### BYOK (Bring Your Own Key)

Forward your own API keys to the server — used instead of platform defaults when present:

| Var | Forwarded as | Used for |
|-----|-------------|---------|
| `GROK_API_KEY` | `X-User-Grok-Key` | X.AI Grok — `get_insight`, signal generation |
| `BANKR_API_KEY` | `X-User-Bankr-Key` | Bankr Agent — swarm agents, research |
| `TELEGRAM_BOT_TOKEN` | `X-User-Telegram-Token` | Your personal Telegram bot |
| `TELEGRAM_CHAT_ID` | `X-User-Telegram-Chat` | Your Telegram chat ID |

Example with BYOK keys in Claude Desktop config:

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research@latest"],
      "env": {
        "NOELCLAW_API_KEY": "noel_sk_xxx",
        "GROK_API_KEY": "xai-xxx",
        "ALCHEMY_API_KEY": "your-alchemy-key"
      }
    }
  }
}
```

### Advanced

| Var | Default | Description |
|-----|---------|-------------|
| `NOELCLAW_CONVEX_URL` | `https://api.noelclaw.xyz` | Override to point at a self-hosted deployment |
| `NOELCLAW_PAYMENT_HEADER` | — | Payment proof header for x402 micropayments (single-use) |

---

## Usage Examples

**Get live market data:**
```
get_market_data
```

**Get a fresh crypto + macro briefing:**
```
get_insight
```

**Ask Noel a question:**
```
ask_noel(question: "Is ETH forming a breakout on the 1H chart?")
```

**Get the latest BTC signal:**
```
get_latest_signal(token: "BTC")
```

**Check smart money activity in the last 6 hours:**
```
get_smart_money_alerts(hours: 6)
```

**Research a topic:**
```
research(query: "What is happening with the Base ecosystem this week?")
```

**Check your portfolio and swap 0.01 ETH to USDC:**
```
get_portfolio
swap_tokens(fromToken: "ETH", toToken: "USDC", amount: "0.01")
```

**Create a DCA automation:**
```
create_automation(rawInput: "Buy 50 USDC of ETH every day. Stop after spending 500 USDC.")
```

**Start the agent swarm:**
```
start_swarm
get_swarm_status
```

---

## Agent Swarm

The swarm is a system of 5 coordinated agents that run autonomously and improve over time. Each agent has a specific role, but they all share a common memory layer — so a price fetched by the market monitor is immediately available to the workflow executor when deciding whether to trigger an automation.

**The 5 agents:**

| Agent | Role |
|-------|------|
| `market-monitor` | Fetches live prices and detects significant price moves. Writes market data to shared memory with a 5-minute TTL |
| `sentiment-tracker` | Analyses token sentiment from on-chain signals. Caches results for 15 minutes. Fires alerts when score crosses ±0.5 |
| `workflow-executor` | Finds due automations and executes them — swaps, sends, and alerts |
| `memory-manager` | Watches shared memory size. When entries exceed 50, compresses the oldest 20 into a summary and deletes the originals |
| `risk-verifier` | Gates high-value actions with a fast risk check. Rejected actions trigger a 10-minute cooldown |

**How agents coordinate:**

- All agents read and write to a shared `swarmMemory` key-value store
- Every run is logged and scored in `executionScores`
- The coordinator tracks win rate and average duration per skill, then adapts thresholds automatically every 30 minutes
- The swarm heartbeat runs every 5 minutes — stale jobs are auto-paused

**Example workflow:**

```
start_swarm
→ starts all 5 agents

get_swarm_status
→ active agents, shared memory snapshot, top execution scores

get_execution_scores
→ which workflows are improving over time

stop_swarm
→ stops cleanly
```

**BYOK:**

Heavy swarm usage calls the Bankr LLM gateway. Set `BANKR_API_KEY` in your MCP env to use your own key instead of the platform default:

```
start_swarm(config: { byok: true, enabledAgents: ["market-monitor", "risk-verifier"] })
```

---

## Authentication

### Wallet-native auth (automatic — no config needed)

The MCP server auto-generates a wallet on first run and signs every request automatically. Your wallet address is your identity — no account, no API key, no setup required.

The wallet is stored encrypted at `~/.noelclaw/wallet.json`. It is derived from a machine key and never leaves your device.

### API key (optional — for account features)

Link to your noelclaw.xyz account for access to your saved automations, settings, and linked wallets:

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research@latest"],
      "env": {
        "NOELCLAW_API_KEY": "noel_sk_xxx"
      }
    }
  }
}
```

Get your API key from noelclaw.xyz → Settings → API Keys.

### Per-call USDC payment (x402)

Paid tools can also be accessed via a single USDC micropayment on Base mainnet without any account:

1. Call any paid tool — you'll get a 402 response with the amount, wallet address, and request ID
2. Send the exact USDC amount to the wallet on Base mainnet
3. Build the payment header: `base64("<txHash>:<requestId>")`
4. Set `NOELCLAW_PAYMENT_HEADER` in your MCP config env and retry

```json
{
  "env": {
    "NOELCLAW_PAYMENT_HEADER": "<base64(txHash:requestId)>"
  }
}
```

Each payment header is single-use. Clear it after the tool call succeeds.

### Tool prices

| Tool | Price (USDC) |
|------|-------------|
| `get_market_data`, `get_token_data`, `get_latest_signal`, `get_signal_history` | Free |
| `get_swarm_status`, `get_execution_scores`, `write_swarm_memory`, `get_swarm_memory` | Free |
| `list_automations`, `pause_automation`, `delete_automation`, `stop_swarm` | Free |
| `get_portfolio` | $0.002 |
| `get_smart_money_alerts`, `get_daily_recap`, `ask_noel`, `get_insight` | $0.005 |
| `swap_tokens`, `send_token` | $0.005 |
| `create_automation` | $0.01 |
| `research`, `start_swarm` | $0.02 |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `BANKR_API_KEY not set` | Set via `npx convex env set BANKR_API_KEY "..."` in your Convex project |
| Tools not appearing | Restart your MCP client after adding the config |
| `Noelclaw API error: 404` | Wrong `NOELCLAW_CONVEX_URL` or Convex functions not deployed |
| Server starts but no response | Expected — it waits for MCP stdin, not HTTP |
| Swarm not starting | Make sure Convex is deployed with the swarm files |
| `get_swarm_status` returns empty | Start the swarm first with `start_swarm` |
| High token usage in swarm | Set `BANKR_API_KEY` in your MCP env to use your own key |
| `Payment required` on every call | Set `NOELCLAW_API_KEY` — wallet auth is automatic but an API key gives full access |
| `Payment already used` error | Each `NOELCLAW_PAYMENT_HEADER` is single-use — clear it after a successful call |
| `No matching USDC transfer found` | Send to the exact address and amount shown in the 402 response |

---

## Links

- npm: [npmjs.com/package/@noelclaw/research](https://npmjs.com/package/@noelclaw/research)
- Docs: [docs.noelclaw.xyz](https://docs.noelclaw.xyz)
- Telegram: [@noelclaw](https://t.me/noelclaw)
