import requests
import json

# The user would put their key from your dashboard here
AGENTBOOST_API_KEY = "sk_xxxxxxxxxxxxxxxxxxxx" 

def crypto_analyzer(asset="BTC", timeframe="7D"):
    """Get professional crypto trading signals from AgentBoost."""
    url = "https://agentboost-seven.vercel.app/api/v1/execute"
    headers = {"Authorization": f"Bearer {AGENTBOOST_API_KEY}"}
    payload = {
        "skill": "crypto",
        "data": {"asset": asset, "timeframe": timeframe}
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# OpenClaw would then use this function to answer the user's desktop prompt!