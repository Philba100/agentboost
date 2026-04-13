import { NextResponse } from 'next/server';

/**
 * MCP GET HANDLER
 * This endpoint tells the Desktop AI (Claude/Cursor) what tools are available.
 */
export async function GET() {
  return NextResponse.json({
    mcp_version: "1.0",
    tools: [
      {
        name: "agentboost_crypto",
        description: "Institutional-grade crypto options strategies and implied volatility analysis. Returns exact strikes for Iron Condors and premium selling strategies.",
        input_schema: {
          type: "object",
          properties: {
            asset: { type: "string", description: "The ticker symbol (e.g., BTC, ETH, SOL)" },
            timeframe: { type: "string", description: "Analysis duration (e.g., 7D, 30D)" }
          },
          required: ["asset"]
        }
      },
      {
        name: "agentboost_real_estate",
        description: "Calculates Cap Rate, Cash-on-Cash ROI, and Investment Verdict for any property based on purchase price and estimated rent.",
        input_schema: {
          type: "object",
          properties: {
            address: { type: "string" },
            purchase_price: { type: "number" },
            estimated_rent: { type: "number" }
          },
          required: ["address", "purchase_price", "estimated_rent"]
        }
      },
      {
        name: "agentboost_leads",
        description: "Scrapes and verifies decision-maker emails for B2B sales. Provides direct contact data and LinkedIn company links.",
        input_schema: {
          type: "object",
          properties: {
            domain: { type: "string", description: "Company website domain (e.g., apple.com)" },
            role: { type: "string", description: "Target job title (e.g., CTO, VP Sales)" }
          },
          required: ["domain", "role"]
        }
      },
      {
        name: "agentboost_github",
        description: "Performs an automated security audit on a GitHub Pull Request. Detects SQL injection, hardcoded keys, and provides shell fix commands.",
        input_schema: {
          type: "object",
          properties: {
            repo_name: { type: "string", description: "owner/repo format" },
            pr_number: { type: "number" }
          },
          required: ["repo_name", "pr_number"]
        }
      },
      {
        name: "agentboost_seo",
        description: "Technical SEO crawler that analyzes a URL for LCP performance, missing meta tags, and ranking opportunities.",
        input_schema: {
          type: "object",
          properties: {
            target_url: { type: "string" }
          },
          required: ["target_url"]
        }
      },
      {
        name: "agentboost_yt_predictor",
        description: "Predicts YouTube CTR using Vision AI heatmap simulation. Analyzes thumbnail concepts and video titles for engagement potential.",
        input_schema: {
          type: "object",
          properties: {
            video_title: { type: "string" },
            visual_concept: { type: "string", description: "Detailed description of the thumbnail image" }
          },
          required: ["video_title", "visual_concept"]
        }
      },
      {
        name: "agentboost_whatsapp",
        description: "B2B CRM scheduler. Generates high-converting marketing copy and prepares automated mass-broadcast metadata.",
        input_schema: {
          type: "object",
          properties: {
            campaign_name: { type: "string" },
            audience: { type: "string" },
            message: { type: "string" },
            schedule_time: { type: "string" }
          },
          required: ["campaign_name", "message"]
        }
      },
      {
        name: "agentboost_legal",
        description: "A high-liability risk scorer for legal documents. Identifies predatory non-compete clauses and IP assignment traps.",
        input_schema: {
          type: "object",
          properties: {
            contract_text: { type: "string", description: "Paragraphs or clauses to analyze" }
          },
          required: ["contract_text"]
        }
      }
    ]
  });
}

/**
 * MCP POST HANDLER
 * This endpoint executes the tool when the user asks the AI to perform the task.
 * It routes the request to our unified /api/v1/execute endpoint.
 */
export async function POST(req: Request) {
  try {
    const { tool_name, arguments: args } = await req.json();

    // 1. Get the base URL (e.g. https://agentboost-seven.vercel.app)
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    // 2. Forward to our Unified Execution Engine
    // The user's API Key must be provided in the Authorization header of the initial MCP call
    const executionResponse = await fetch(`${baseUrl}/api/v1/execute`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skill: tool_name.replace('agentboost_', ''),
        data: args
      })
    });

    const result = await executionResponse.json();

    // 3. Handle errors (e.g. Unpaid subscription)
    if (!executionResponse.ok) {
      return NextResponse.json({
        content: [{ type: "text", text: `⚠️ AgentBoost Error: ${result.error}` }]
      });
    }

    // 4. Return data back to Claude/Cursor as clean text/JSON
    return NextResponse.json({
      content: [{ 
        type: "text", 
        text: JSON.stringify(result.data, null, 2) 
      }]
    });

  } catch (err: any) {
    return NextResponse.json({
      content: [{ type: "text", text: `Critical Failure: ${err.message}` }]
    });
  }
}