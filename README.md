# @noelclaw/research — MCP Server

Noelclaw as an MCP skill. Install in Claude Desktop, Claude Code, Cursor, Hermes, OpenClaw, or any MCP-compatible client.

## Tools

| Tool | Description |
|------|-------------|
| `get_market_data` | Live top-20 coins, trending, BTC/ETH/SOL prices (CoinGecko) |
| `ask_noel` | DeFi trading AI — analysis, trade ideas, on-chain research |
| `get_token_data` | Token price/market data in clean format via CoinGecko agent |
| `run_research` | On-demand research snapshot with confidence scores |
| `start_research` | Start Noel's 8-hour autonomous research shift (Telegram reports) |
| `stop_research` | Stop an active research shift |
| `get_research_status` | Check shift status and view recent reports |

---

## Step 1 — Set Convex Environment Variables

Run these in the `app/` folder (where `convex/` lives):

```bash
npx convex env set GROK_API_KEY "xai-..."
npx convex env set TELEGRAM_BOT_TOKEN "8635276..."
npx convex env set TELEGRAM_CHAT_ID "6426872166"
```

Or set them manually in the **Convex Dashboard → your deployment → Settings → Environment Variables**.

> `BANKR_API_KEY` and `COINGECKO_API_KEY` should already be set.

---

## Step 2 — Build

```bash
cd mcp-server
npm install
npm run build
# Entry point: dist/index.js
```

---

## Installation by Client

### Claude Desktop

Edit the config file:
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "node",
      "args": ["C:/Users/sagir/Downloads/noelapp/mcp-server/dist/index.js"],
      "env": {
        "NOELCLAW_CONVEX_URL": "https://befitting-porcupine-276.convex.site"
      }
    }
  }
}
```

Restart Claude Desktop. Tools appear automatically in the tools panel.

---

### Claude Code CLI

```bash
claude mcp add noelclaw -- node /absolute/path/to/mcp-server/dist/index.js
```

Or edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "NOELCLAW_CONVEX_URL": "https://befitting-porcupine-276.convex.site"
      }
    }
  }
}
```

---

### Cursor / Windsurf

Open **Settings → MCP** or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "NOELCLAW_CONVEX_URL": "https://befitting-porcupine-276.convex.site"
      }
    }
  }
}
```

---

### Hermes Agent / OpenClaw

Hermes uses stdio MCP transport. Add to your Hermes config file (usually `hermes.config.json` or `config.yaml`):

**JSON format:**
```json
{
  "mcp_servers": {
    "noelclaw": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "NOELCLAW_CONVEX_URL": "https://befitting-porcupine-276.convex.site"
      }
    }
  }
}
```

**YAML format:**
```yaml
mcp_servers:
  noelclaw:
    command: node
    args:
      - /path/to/mcp-server/dist/index.js
    env:
      NOELCLAW_CONVEX_URL: https://befitting-porcupine-276.convex.site
```

**On a VPS**, copy the `mcp-server/` folder to the server then:

```bash
cd /srv/noelclaw-mcp
npm install --production
node dist/index.js  # test: should start silently (waits for stdin)
```

Point Hermes to the absolute path of `dist/index.js`.

---

### OpenClaw / Any Generic MCP Client

The server uses standard MCP stdio transport:

```bash
NOELCLAW_CONVEX_URL="https://befitting-porcupine-276.convex.site" node dist/index.js
```

Any client that supports `command` + `args` + `env` MCP config will work.

---

## Using the 8-Hour Research Shift

Once connected, start a shift:

```
start_research
```

With a specific user ID:
```
start_research(userId: "your-user-id")
```

Noel will:
1. Immediately collect first data (CoinGecko + Grok X sentiment + Bankr on-chain)
2. Send a Telegram start notification to `TELEGRAM_CHAT_ID`
3. Collect data every **30 minutes** for 8 hours
4. Send interim Telegram reports at **2.5h** and **5h**
5. Send final comprehensive report at **8h**, then close the shift

Check status:
```
get_research_status(userId: "your-user-id")
```

Stop early:
```
stop_research(userId: "your-user-id")
```

---

## Optional: Custom Convex URL

Point to a different deployment:

```bash
NOELCLAW_CONVEX_URL="https://your-deployment.convex.site" node dist/index.js
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `BANKR_API_KEY not set` | Set it via `npx convex env set BANKR_API_KEY "..."` |
| `TELEGRAM_BOT_TOKEN not set` | Set via `npx convex env set TELEGRAM_BOT_TOKEN "..."` |
| Tools not appearing | Use absolute path in config, restart client |
| `Noelclaw API error: 404` | Wrong `NOELCLAW_CONVEX_URL` or Convex not deployed |
| Server starts but no response | Normal — it waits for MCP protocol on stdin |
