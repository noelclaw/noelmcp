#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const CONVEX_SITE = process.env.NOELCLAW_CONVEX_URL ?? "https://befitting-porcupine-276.convex.site";

async function callConvex(path: string, method: string, body?: unknown): Promise<any> {
  const url = `${CONVEX_SITE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Noelclaw API error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<any>;
}

const TOOLS: Tool[] = [
  {
    name: "get_market_data",
    description:
      "Get live crypto market data: top 20 coins by market cap, trending coins, and key prices for BTC/ETH/SOL. Data sourced from CoinGecko.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "ask_noel",
    description:
      "Ask Noel, a crypto AI agent with DeFi trading intelligence and live market context. Best for analysis, trade ideas, and DeFi questions.",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "Your question or request for Noel",
        },
        messages: {
          type: "array",
          description: "Previous conversation messages for context (optional)",
          items: {
            type: "object",
            properties: {
              role: { type: "string", enum: ["user", "assistant"] },
              content: { type: "string" },
            },
            required: ["role", "content"],
          },
        },
      },
      required: ["question"],
    },
  },
  {
    name: "get_token_data",
    description:
      "Get market data for specific tokens using CoinGecko agent. Returns price, 24h change, market cap, and volume in a clean list.",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "Describe which tokens to look up, e.g. 'show me data for ETH, SOL, and ARB'",
        },
      },
      required: ["question"],
    },
  },
  {
    name: "run_research",
    description:
      "Trigger Noel's autonomous research cycle on demand. Noel fetches live market data, analyzes trends, and returns structured findings with confidence scores.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "Optional user ID to associate research with (defaults to anonymous)",
        },
      },
      required: [],
    },
  },
  {
    name: "start_research",
    description:
      "Start Noel's 8-hour autonomous research shift. Noel collects market data every 30 minutes, sends interim reports at 2.5h and 5h, and a final comprehensive report at 8h — all via Telegram.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID to associate the research shift with",
        },
        telegramChatId: {
          type: "string",
          description: "Telegram chat ID to send reports to (optional, uses default if not provided)",
        },
        token: {
          type: "string",
          description: "Specific token symbol to focus on e.g. 'ETH', 'SOL' (optional, tracks whole market if not set)",
        },
      },
      required: [],
    },
  },
  {
    name: "stop_research",
    description:
      "Stop Noel's active research shift. Terminates data collection and report scheduling for the given user.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID whose active shift should be stopped",
        },
      },
      required: [],
    },
  },
  {
    name: "get_research_status",
    description:
      "Get the status of Noel's research shift: active job details (elapsed time, remaining time, report count) and the last 3 reports.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID to check research status for",
        },
      },
      required: [],
    },
  },
  {
    name: "get_research_report",
    description:
      "Get the latest research report for a specific token (e.g. 'ETH', 'SOL'). Returns the most recent report generated during a shift that was tracking that token.",
    inputSchema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "Token symbol to get the report for, e.g. 'ETH'",
        },
      },
      required: ["token"],
    },
  },
  {
    name: "create_wallet",
    description:
      "Create a Base mainnet wallet for a user (MCP/agent context). Returns the wallet address. If the user already has a wallet, returns the existing one.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID to create the wallet for",
        },
      },
      required: ["userId"],
    },
  },
  {
    name: "get_wallet_balance",
    description:
      "Get the ETH and USDC balance for a user's Base mainnet wallet created via MCP.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID to get wallet balance for",
        },
      },
      required: ["userId"],
    },
  },
  {
    name: "set_telegram",
    description:
      "Configure a user's personal Telegram bot token and chat ID for receiving Noel research reports. Users must set this up before starting a research shift to receive Telegram notifications.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "User ID to configure Telegram for",
        },
        telegramBotToken: {
          type: "string",
          description: "Telegram bot token (get from @BotFather)",
        },
        telegramChatId: {
          type: "string",
          description: "Telegram chat ID to send messages to (your personal chat ID or a group)",
        },
      },
      required: ["userId"],
    },
  },
];

const server = new Server(
  { name: "noelclaw", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_market_data": {
        const data = await callConvex("/mcp/market", "GET");
        const lines: string[] = [`**Market Data** — ${data.fetchedAt ?? new Date().toISOString()}`, ""];

        if (data.keyPrices) {
          lines.push("**Key Prices**");
          for (const [coin, info] of Object.entries(data.keyPrices as Record<string, any>)) {
            const price = info.usd?.toLocaleString("en-US", { style: "currency", currency: "USD" });
            const change = info.usd_24h_change?.toFixed(2);
            const sign = (info.usd_24h_change ?? 0) >= 0 ? "+" : "";
            lines.push(`• ${coin.toUpperCase()}: ${price} (${sign}${change}%)`);
          }
          lines.push("");
        }

        if (data.trending?.length) {
          lines.push("**Trending** (top 10)");
          for (const c of data.trending) {
            const ch = c.change24h?.toFixed(2);
            const sign = (c.change24h ?? 0) >= 0 ? "+" : "";
            lines.push(`• ${c.name} (${c.symbol?.toUpperCase()}) — rank #${c.rank ?? "?"} ${ch != null ? `${sign}${ch}%` : ""}`);
          }
          lines.push("");
        }

        if (data.top20?.length) {
          lines.push("**Top 20 by Market Cap**");
          lines.push("| # | Name | Price | 24h% |");
          lines.push("|---|------|-------|------|");
          for (const c of data.top20) {
            const price = c.price?.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 });
            const ch = c.change24h?.toFixed(2);
            const sign = (c.change24h ?? 0) >= 0 ? "+" : "";
            lines.push(`| ${c.rank} | ${c.name} (${c.symbol?.toUpperCase()}) | ${price} | ${sign}${ch}% |`);
          }
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      }

      case "ask_noel": {
        const a = args as { question: string; messages?: unknown[] };
        const data = await callConvex("/mcp/chat", "POST", {
          question: a.question,
          agentId: "noel-default",
          messages: a.messages ?? [],
        });
        return { content: [{ type: "text", text: data.answer ?? JSON.stringify(data) }] };
      }

      case "get_token_data": {
        const a = args as { question: string };
        const data = await callConvex("/mcp/chat", "POST", {
          question: a.question,
          agentId: "coingecko-default",
          messages: [],
        });
        return { content: [{ type: "text", text: data.answer ?? JSON.stringify(data) }] };
      }

      case "run_research": {
        const a = (args ?? {}) as { userId?: string };
        const data = await callConvex("/mcp/research", "POST", {
          userId: a.userId ?? "mcp-anonymous",
        });

        if (!data.success) {
          return { content: [{ type: "text", text: `Research failed: ${data.error ?? "unknown error"}` }] };
        }

        const r = data.result;
        const summary = r?.shortSummary ?? r?.summary ?? "No summary available";
        const lines: string[] = [
          `**Noel Research** — ${r?.generatedAt ?? new Date().toISOString()}`,
          "",
          `**Outlook:** ${r?.marketOutlook ?? "neutral"}`,
          "",
          `**Summary:** ${summary}`,
        ];

        if (r?.fullAnalysis && r.fullAnalysis !== summary) {
          lines.push("", r.fullAnalysis);
        }

        const impacts = r?.impacts ?? r?.findings ?? [];
        if (impacts.length) {
          lines.push("", "**Key Impacts:**");
          for (const f of impacts) {
            const label = f.title ?? `${f.token} (${f.symbol})`;
            const detail = f.detail ?? f.rationale ?? "";
            const conf = ((f.confidence ?? f.confidenceScore ?? 0) * 100).toFixed(0);
            const emoji = f.sentiment === "bullish" ? "🟢" : f.sentiment === "bearish" ? "🔴" : "🟡";
            lines.push(`${emoji} **${label}** _(${conf}% conf)_`);
            if (detail) lines.push(`   ${detail}`);
          }
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      }

      case "start_research": {
        const a = (args ?? {}) as { userId?: string; telegramChatId?: string; token?: string };
        const data = await callConvex("/mcp/research/start", "POST", {
          userId: a.userId ?? "mcp-anonymous",
          telegramChatId: a.telegramChatId,
          token: a.token,
        });
        if (!data.success) {
          return { content: [{ type: "text", text: `Failed to start shift: ${data.error ?? "unknown error"}` }], isError: true };
        }
        const startedAt = data.startedAt ? new Date(data.startedAt).toUTCString() : "now";
        const stopsAt = data.stopsAt ? new Date(data.stopsAt).toUTCString() : "in 8 hours";
        const tokenLine = a.token ? `**Tracking:** ${a.token.toUpperCase()}` : `**Tracking:** whole market`;
        return {
          content: [{
            type: "text",
            text: [
              `🚀 **Noel Research Shift Started**`,
              ``,
              `**Job ID:** ${data.jobId}`,
              tokenLine,
              `**Started:** ${startedAt}`,
              `**Ends:** ${stopsAt}`,
              ``,
              `Noel will collect market data every 30 minutes.`,
              `Interim reports sent via Telegram at 2.5h and 5h.`,
              `Final report at 8h.`,
            ].join("\n"),
          }],
        };
      }

      case "stop_research": {
        const a = (args ?? {}) as { userId?: string };
        const data = await callConvex("/mcp/research/stop", "POST", {
          userId: a.userId ?? "mcp-anonymous",
        });
        if (!data.success) {
          return { content: [{ type: "text", text: `Failed to stop shift: ${data.error ?? "unknown error"}` }], isError: true };
        }
        return {
          content: [{
            type: "text",
            text: data.stopped > 0
              ? `✅ Research shift stopped (${data.stopped} job${data.stopped > 1 ? "s" : ""} terminated).`
              : `ℹ️ No active research shift found.`,
          }],
        };
      }

      case "get_research_status": {
        const a = (args ?? {}) as { userId?: string };
        const data = await callConvex(
          `/mcp/research/status?userId=${encodeURIComponent(a.userId ?? "mcp-anonymous")}`,
          "GET"
        );
        const lines: string[] = ["**Noel Research Status**", ""];

        if (data.activeJob) {
          const j = data.activeJob;
          lines.push(`**Active Shift**`);
          lines.push(`• Status: running`);
          lines.push(`• Elapsed: ${j.elapsedMinutes} min`);
          lines.push(`• Remaining: ${j.remainingMinutes} min`);
          lines.push(`• Interim reports sent: ${j.interimReportsCount}/2`);
          lines.push(`• Final report sent: ${j.finalReportSent ? "yes" : "no"}`);
        } else {
          lines.push(`**No active shift.** Use \`start_research\` to begin.`);
        }

        if (data.recentReports?.length) {
          lines.push("", "**Recent Reports**");
          for (const r of data.recentReports) {
            const emoji = r.outlook === "bullish" ? "🟢" : r.outlook === "bearish" ? "🔴" : "🟡";
            lines.push(`${emoji} [${r.type.toUpperCase()}] ${r.generatedAt}`);
            if (r.summary) lines.push(`   ${r.summary}`);
          }
        }

        return { content: [{ type: "text", text: lines.join("\n") }] };
      }

      case "get_research_report": {
        const a = args as { token: string };
        const data = await callConvex(
          `/mcp/research/report?token=${encodeURIComponent(a.token)}`,
          "GET"
        );
        if (!data || data.error) {
          return { content: [{ type: "text", text: `No report found for ${a.token}` }] };
        }
        const r = data.result ?? {};
        const lines: string[] = [
          `**Latest Research Report — ${a.token.toUpperCase()}**`,
          `Generated: ${data.generatedAt ? new Date(data.generatedAt).toUTCString() : "unknown"}`,
          `Type: ${data.type ?? "unknown"} | Outlook: ${r.marketOutlook ?? "neutral"}`,
          "",
          r.shortSummary ?? "",
        ];
        if (r.fullAnalysis) {
          lines.push("", "**Analysis:**", r.fullAnalysis.slice(0, 1000));
        }
        const impacts: any[] = r.impacts ?? [];
        if (impacts.length) {
          lines.push("", "**Key Signals:**");
          for (const f of impacts.slice(0, 4)) {
            const e = f.sentiment === "bullish" ? "🟢" : f.sentiment === "bearish" ? "🔴" : "🟡";
            lines.push(`${e} ${f.title} — ${f.detail ?? ""}`);
          }
        }
        return { content: [{ type: "text", text: lines.join("\n") }] };
      }

      case "create_wallet": {
        const a = args as { userId: string };
        const data = await callConvex("/mcp/wallet/create", "POST", { userId: a.userId });
        return {
          content: [{
            type: "text",
            text: data.existing
              ? `Wallet already exists:\n**Address:** \`${data.address}\`\nNetwork: Base Mainnet`
              : `✅ Wallet created!\n**Address:** \`${data.address}\`\nNetwork: Base Mainnet\n\nFund with ETH and USDC to start trading.`,
          }],
        };
      }

      case "get_wallet_balance": {
        const a = args as { userId: string };
        const data = await callConvex(
          `/mcp/wallet/balance?userId=${encodeURIComponent(a.userId)}`,
          "GET"
        );
        if (!data || data.error) {
          return { content: [{ type: "text", text: `No wallet found. Use create_wallet first.` }] };
        }
        return {
          content: [{
            type: "text",
            text: [
              `**Wallet Balance** (${data.network})`,
              `Address: \`${data.address}\``,
              ``,
              `ETH: ${data.eth}`,
              `USDC: $${data.usdc}`,
            ].join("\n"),
          }],
        };
      }

      case "set_telegram": {
        const a = args as { userId: string; telegramBotToken?: string; telegramChatId?: string };
        await callConvex("/user/telegram", "POST", {
          userId: a.userId,
          telegramBotToken: a.telegramBotToken,
          telegramChatId: a.telegramChatId,
        });
        return {
          content: [{
            type: "text",
            text: [
              `✅ Telegram config saved for user ${a.userId}.`,
              a.telegramBotToken ? `Bot token: set` : ``,
              a.telegramChatId ? `Chat ID: ${a.telegramChatId}` : ``,
              ``,
              `Noel will now send research reports to your Telegram bot.`,
            ].filter(Boolean).join("\n"),
          }],
        };
      }

      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (err: any) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
