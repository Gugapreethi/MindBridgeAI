from fastapi import APIRouter, HTTPException
from auth.user_db import get_all_users
from auth.jwt_handler import verify_token
from utils.memory import load_moods, load_history
from agents.analytics_agent import calculate_burnout_score

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users")
def get_users(token: str):
    payload = verify_token(token)
    if not payload or not payload.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only!")
    return get_all_users()

@router.get("/analytics")
def get_analytics(token: str):
    payload = verify_token(token)
    if not payload or not payload.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only!")

    users = get_all_users()
    analytics = []

    for user in users:
        uid = user["user_id"]
        moods = load_moods(uid)
        burnout = calculate_burnout_score(uid, user["user_type"])
        analytics.append({
            "user_id": uid,
            "name": user["name"],
            "user_type": user["user_type"],
            "mood_count": len(moods),
            "burnout": burnout,
        })

    return analytics

@router.get("/crisis-alerts")
def get_crisis_alerts(token: str):
    payload = verify_token(token)
    if not payload or not payload.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only!")

    import os, json
    alerts = []
    alert_dir = "data/alerts"
    if os.path.exists(alert_dir):
        for file in os.listdir(alert_dir):
            with open(f"{alert_dir}/{file}") as f:
                alerts.extend(json.load(f))
    return alerts