---
name: knowledge-hub-curator
description: Curate office knowledge bases, create content summaries, and manage internal documentation updates.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `knowledge-hub-curator` skill. This tool organizes internal documentation, creates searchable summaries, and recommends updates based on new business knowledge.

**CRITICAL:** Always include source references, content categories, and update recommendations.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "topic": "Remote Work Policy",
  "current_documents": ["/policies/remote_work.md", "/guides/collaboration.md"],
  "audience": "employees",
  "desired_format": "summary",
  "update_needed": true
}
```

### Outputs
- **Knowledge summary:** Key points and insights
- **Content map:** Recommended documentation structure
- **Update plan:** Priority items and owners
- **Search tags:** Suggested indexing metadata
