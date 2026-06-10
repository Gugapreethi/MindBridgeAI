import json
import os
from datetime import datetime, timedelta

CONV_DIR = "data/conversations"
MOOD_DIR = "data/mood_history"
SUMMARY_DIR = "data/summaries"

for dir_path in [CONV_DIR, MOOD_DIR, SUMMARY_DIR]:
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

# ============ CONVERSATION MEMORY ============

def save_message(user_id: str, role: str, content: str):
    path = f"{CONV_DIR}/{user_id}.json"
    history = load_history(user_id)
    history.append({
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat()
    })
    history = history[-30:]  # Last 30 messages
    with open(path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_history(user_id: str):
    path = f"{CONV_DIR}/{user_id}.json"
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_recent_context(user_id: str, limit: int = 10):
    history = load_history(user_id)
    return history[-limit:]

def search_history(user_id: str, keyword: str):
    history = load_history(user_id)
    return [h for h in history if keyword.lower() in h["content"].lower()]

# ============ MOOD MEMORY ============

def save_mood(user_id: str, mood_score: int):
    path = f"{MOOD_DIR}/{user_id}.json"
    moods = load_moods(user_id)
    moods.append({
        "score": mood_score,
        "date": datetime.now().isoformat()
    })
    moods = moods[-30:]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(moods, f, ensure_ascii=False, indent=2)

def load_moods(user_id: str):
    path = f"{MOOD_DIR}/{user_id}.json"
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_mood_average(user_id: str, days: int = 7):
    moods = load_moods(user_id)
    if not moods:
        return None
    recent = moods[-days:]
    scores = [m["score"] for m in recent]
    return round(sum(scores) / len(scores), 1)

def get_mood_by_date(user_id: str, days: int = 7):
    moods = load_moods(user_id)
    cutoff = datetime.now() - timedelta(days=days)
    return [
        m for m in moods
        if datetime.fromisoformat(m["date"]) > cutoff
    ]

# ============ WEEKLY SUMMARY ============

def save_weekly_summary(user_id: str, summary: dict):
    path = f"{SUMMARY_DIR}/{user_id}.json"
    summaries = []
    if os.path.exists(path):
        with open(path) as f:
            summaries = json.load(f)
    summaries.append({
        **summary,
        "created_at": datetime.now().isoformat()
    })
    summaries = summaries[-4:]  # Last 4 weeks
    with open(path, "w") as f:
        json.dump(summaries, f, indent=2)

def load_weekly_summary(user_id: str):
    path = f"{SUMMARY_DIR}/{user_id}.json"
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return json.load(f)