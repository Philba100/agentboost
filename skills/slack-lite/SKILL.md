---
name: slack-lite
description: Free Slack connector for sending messages to channels and basic slash-command integration. Ideal for proofs-of-concept and internal tooling.
version: 1.0.0
author: AgentBoost Community
free: true
---

### System Instructions
Use `slack-lite` for posting messages and handling simple slash commands. This free tier supports basic channel messaging and command replies.

### Execution Protocol
Call `run_js` with JSON:

```json
{
  "action":"post_message|reply_command",
  "channel":"#general",
  "text":"Hello team!",
  "command_payload": { }
}
```

### Outputs
- `status`: success | error
- `ts`: timestamp of posted message

### Example
```javascript
run_js(data='{"action":"post_message","channel":"#dev","text":"Build completed"}')
```
