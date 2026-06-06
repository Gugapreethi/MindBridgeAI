from datetime import datetime
import json
import os

def care_network_agent(user_id: str, crisis_level: str, contact_phone: str = None) -> dict:
    if not contact_phone:
        return {"alert_sent": False, "reason": "No contact configured"}

    if crisis_level not in ["medium", "high"]:
        return {"alert_sent": False, "reason": "Crisis level too low"}

    # Alert log save
    alert = {
        "user_id": user_id,
        "crisis_level": crisis_level,
        "contact_phone": contact_phone,
        "timestamp": datetime.now().isoformat(),
        "message": f"Alert: Your loved one may need support. Crisis level: {crisis_level}"
    }

    os.makedirs("data/alerts", exist_ok=True)
    path = f"data/alerts/{user_id}.json"
    alerts = []
    if os.path.exists(path):
        with open(path) as f:
            alerts = json.load(f)
    alerts.append(alert)
    with open(path, "w") as f:
        json.dump(alerts, f, indent=2)

    return {
        "alert_sent": True,
        "contact": contact_phone,
        "message": alert["message"]
    }