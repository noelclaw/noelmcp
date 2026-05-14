# @noelclaw/research

Noelclaw as an MCP skill. Gives Claude, Cursor, Hermes, and any MCP-compatible AI client access to live crypto market data, AI trading signals, whale alerts, DeFi wallets, and an 8-hour autonomous research agent — all backed by real-time on-chain intelligence.

```bash
npx @noelclaw/research
```

---

## Tools

### Market & Data
| Tool | Description |
|------|-------------|
| `get_market_data` | Live top-20 coins by market cap, trending, BTC/ETH/SOL prices |
| `get_token_data` | Price, 24h change, market cap, volume for any token |
| `ask_noel` | Chat with Noel — DeFi AI with live market context |

### Trading Signals
| Tool | Description |
|------|-------------|
| `get_latest_signal` | Latest BTC and/or ETH 1H trading signals (entry, TP, SL, confidence) |
| `get_signal_history` | Signal history with win/loss record and winrate stats |
| `get_daily_recap` | Today's trading performance recap with AI review |

### Whale Tracking
| Tool | Description |
|------|-------------|
| `get_whale_alerts` | Recent large wallet movements and CEX inflow/outflow alerts |

### Autonomous Research
| Tool | Description |
|------|-------------|
| `run_research` | On-demand research snapshot with confidence scores |
| `start_research` | Start an 8-hour autonomous research shift (Telegram reports at 2.5h, 5h, 8h) |
| `stop_research` | Stop an active research shift |
| `get_research_status` | Check shift status and view recent reports |
| `get_research_report` | Get the latest research report for a specific token |

### DeFi Wallet
| Tool | Description |
|------|-------------|
| `connect_wallet` | Create or retrieve a Base mainnet wallet (Privy Server Wallet) |
| `swap_tokens` | Swap ETH, USDC, USDT, DAI, WETH on Base via 0x Permit2 |
| `send_token` | Send ETH or ERC-20 tokens to any address on Base |
| `get_portfolio` | Get wallet token balances and total USD value |

### Configuration
| Tool | Description |
|------|-------------|
| `create_wallet` | Create a Base wallet for MCP/agent use |
| `get_wallet_balance` | Get ETH and USDC balance for a wallet |
| `set_telegram` | Configure personal Telegram bot for receiving results and reports |

---

## Quick Install

### Claude Code
```bash
claude mcp add noelclaw -- npx @noelclaw/research
```

### Claude Desktop
Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research"]
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
      "args": ["@noelclaw/research"]
    }
  }
}
```

### Hermes Agent
```bash
hermes mcp add noelclaw --command npx --args @noelclaw/research
```

Or in your Hermes config:
```yaml
mcp_servers:
  noelclaw:
    command: npx
    args:
      - "@noelclaw/research"
```

---

## Usage Examples

**Get live market data:**
```
get_market_data
```

**Ask Noel a question:**
```
ask_noel(question: "Is ETH forming a breakout on the 1H chart?")
```

**Get the latest BTC signal:**
```
get_latest_signal(token: "BTC")
```

**Check recent whale activity:**
```
get_whale_alerts(hours: 6)
```

**Start an 8-hour research shift:**
```
start_research(userId: "your-id")
```

**Create a DeFi wallet and swap:**
```
connect_wallet(userId: "your-id")
swap_tokens(userId: "your-id", fromToken: "ETH", toToken: "USDC", amount: "100000000000000000")
```

**Set up Telegram delivery:**
```
set_telegram(userId: "your-id", telegramBotToken: "...", telegramChatId: "...")
```

---

## Optional: Point to a Custom Deployment

By default the MCP server uses Noelclaw's hosted backend. To use your own Convex deployment:

```bash
NOELCLAW_CONVEX_URL="https://your-deployment.convex.site" npx @noelclaw/research
```

Or set it in your MCP config's `env`:
```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research"],
      "env": {
        "NOELCLAW_CONVEX_URL": "https://your-deployment.convex.site"
      }
    }
  }
}
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `BANKR_API_KEY not set` | Set via `npx convex env set BANKR_API_KEY "..."` in the Convex project |
| `TELEGRAM_BOT_TOKEN not set` | Set via `npx convex env set TELEGRAM_BOT_TOKEN "..."` |
| Tools not appearing | Restart your MCP client after adding config |
| `Noelclaw API error: 404` | Wrong `NOELCLAW_CONVEX_URL` or Convex not deployed |
| Server starts but no response | Normal — it waits for MCP stdin, not HTTP |

---

## Links

- npm: [npmjs.com/package/@noelclaw/research](https://npmjs.com/package/@noelclaw/research)
- Docs: [docs.noelclaw.xyz](https://docs.noelclaw.xyz)
- Telegram: [@noelclaw](https://t.me/noelclaw)
