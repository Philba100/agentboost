---
name: public-announcer-free
description: Free broadcaster for public channels (Telegram, Mastodon, public feeds). Designed for announcements and public notifications.
version: 1.0.0
author: AgentBoost Community
free: true
---

### System Instructions
Use `public-announcer-free` to publish announcements to public channels. This free tier supports single-channel broadcasts and basic scheduling.

### Execution Protocol
Call `run_js` with JSON:

```json
{
  "action":"broadcast",
  "channel_type":"telegram|mastodon",
  "message":"We are live!",
  "scheduled_time":"2026-04-11T10:00:00Z"
}
```

### Outputs
- `status`: success | error
- `broadcast_id`: identifier

### Example
```javascript
run_js(data='{"action":"broadcast","channel_type":"telegram","message":"Launch!"}')
```
