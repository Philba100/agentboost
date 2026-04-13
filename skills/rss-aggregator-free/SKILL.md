---
name: rss-aggregator-free
description: Free RSS feed aggregator and notifier. Subscribe to feeds, fetch latest items, and send summaries to channels or email.
version: 1.0.0
author: AgentBoost Community
free: true
---

### System Instructions
Use `rss-aggregator-free` to pull RSS/Atom feeds, deduplicate items, and produce short summaries. Suited for internal monitoring and lightweight notifications.

### Execution Protocol
Call `run_js` with JSON:

```json
{
  "action":"fetch|summary",
  "feed_url":"https://example.com/rss",
  "max_items": 5
}
```

### Outputs
- `items`: array of feed items
- `summary`: short aggregated summary

### Example
```javascript
run_js(data='{"action":"fetch","feed_url":"https://techcrunch.com/feed/","max_items":5}')
```
