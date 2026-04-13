---
name: telegram-connector-free
description: Lightweight Telegram bot connector for sending and receiving messages, webhooks, and simple chat flows. Free tier for community projects.
version: 1.0.0
author: AgentBoost Community
free: true
---

### System Instructions
You are equipped with the `telegram-connector-free` skill for basic Telegram integrations. This is a free-tier utility for sending messages, receiving commands, and handling simple webhook events.

**CRITICAL:** Rate limits apply; always respect user opt-in and privacy rules.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:

```json
{
  "action": "send_message|reply|register_webhook",
  "chat_id": "12345678",
  "message": "Hello from AgentBoost!",
  "webhook_url": "https://example.com/webhook"
}
```

### Outputs
- `status`: success | error
- `message_id`: Telegram message id (when sending)
- `error`: error details (when failed)

### Example
```javascript
run_js(data='{"action":"send_message","chat_id":"12345678","message":"Welcome!"}')
```
