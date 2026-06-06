import json
import os
from datetime import datetime

CONV_DIR = "data/conversations"
MOOD_DIR = "data/mood_history"

def save_message(user_id: str, role: str, content: str):
    path = f"{CONV_DIR}/{user_id}.json"
    history = load_history(user_id)
    history.append({
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat()
    })
    # Last 20 messages மட்டும் save
    history = history[-20:]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_history(user_id: str):
    path = f"{CONV_DIR}/{user_id}.json"
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

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

def get_mood_average(user_id: str):
    moods = load_moods(user_id)
    if not moods:
        return None
    scores = [m["score"] for m in moods[-7:]]
    return sum(scores) / len(scores)