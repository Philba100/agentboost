import { NextResponse } from 'next/server';
import skills from '@/app/lib/skillsData';
import { executeSkill } from '@/lib/executor';

const formattedTools = skills.map((skill) => ({
  name: skill.id.replace(/-/g, '_'),
  description: `${skill.name}: ${skill.desc}`,
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: `Task instructions or input parameters for ${skill.name}`
      },
      strict_mode: {
        type: 'boolean',
        description: 'Enforce deterministic verification'
      }
    },
    required: ['prompt']
  }
}));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-AgentBoost-Key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    {
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'agentboost-mcp-registry', version: '2.4.0' },
        tools: formattedTools
      }
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isJsonRpc = typeof body.method === 'string';
    const requestId = body.id ?? null;
    const method = body.method;

    // Handle MCP protocol notifications (no response required)
    if (isJsonRpc && method?.startsWith('notifications/')) {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    if (isJsonRpc && method === 'initialize') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'agentboost-mcp-registry', version: '2.4.0' }
          }
        },
        { headers: corsHeaders }
      );
    }

    if (isJsonRpc && method === 'ping') {
      return NextResponse.json({ jsonrpc: '2.0', id: requestId, result: {} }, { headers: corsHeaders });
    }

    if (isJsonRpc && method === 'tools/list') {
      return NextResponse.json(
        { jsonrpc: '2.0', id: requestId, result: { tools: formattedTools } },
        { headers: corsHeaders }
      );
    }

    if ((isJsonRpc && method === 'tools/call') || body.tool_name) {
      const toolName = isJsonRpc ? body.params?.name : body.tool_name;
      const args = isJsonRpc ? body.params?.arguments : body.arguments;

      if (!toolName) {
        return NextResponse.json(
          { jsonrpc: '2.0', id: requestId, error: { code: -32602, message: 'Missing tool name' } },
          { status: 400, headers: corsHeaders }
        );
      }

      // Execute in-process: zero network latency, no serverless loopback
      const executionResult = await executeSkill(toolName, args);

      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(executionResult.data, null, 2)
              }
            ]
          }
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { jsonrpc: '2.0', id: requestId, error: { code: -32601, message: `Method "${method}" not recognized` } },
      { status: 404, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: err.message || 'JSON parse error' } },
      { status: 500, headers: corsHeaders }
    );
  }
}