from groq import Groq
from utils.memory import (
    load_moods, get_mood_average,
    load_history, save_weekly_summary
)
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def calculate_burnout_score(user_id: str, user_type: str) -> dict:
    moods = load_moods(user_id)
    if len(moods) < 3:
        return {"score": None, "level": "insufficient_data"}

    recent = moods[-7:]
    scores = [m["score"] for m in recent]
    avg = sum(scores) / len(scores)

    # Low mood days count
    low_days = sum(1 for s in scores if s <= 2)
    declining = all(
        scores[i] <= scores[i-1]
        for i in range(1, min(3, len(scores)))
    )

    # Burnout score (0-100, higher = more risk)
    burnout = 100 - (avg / 5 * 100)
    if low_days >= 3:
        burnout += 10
    if declining:
        burnout += 10
    burnout = min(100, round(burnout))

    if burnout >= 70:
        level = "high"
    elif burnout >= 40:
        level = "medium"
    else:
        level = "low"

    return {
        "score": burnout,
        "level": level,
        "low_days": low_days,
        "average_mood": round(avg, 1),
        "declining": declining
    }

def generate_weekly_report(
    user_id: str, user_type: str, language: str
) -> dict:
    moods = load_moods(user_id)
    history = load_history(user_id)
    burnout = calculate_burnout_score(user_id, user_type)
    avg = get_mood_average(user_id, 7)

    if not moods:
        return {"report": None, "reason": "No data"}

    scores = [m["score"] for m in moods[-7:]]

    lang_map = {"tamil": "Tamil", "english": "English", "hindi": "Hindi"}
    lang = lang_map.get(language, "English")

    prompt = f"""Generate a brief weekly mental health summary.
User type: {user_type}
Language: {lang} — respond in {lang} only
Mood scores this week (1-5): {scores}
Average mood: {avg}
Burnout level: {burnout['level']}
Total conversations: {len(history)}

Give a warm, supportive 2-3 sentence summary.
Include one actionable suggestion."""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )

    report = response.choices[0].message.content

    summary = {
        "report": report,
        "avg_mood": avg,
        "burnout": burnout,
        "mood_scores": scores,
        "total_chats": len(history),
        "week": datetime.now().strftime("%Y-W%U")
    }

    save_weekly_summary(user_id, summary)
    return summary

def get_proactive_alert(
    user_id: str, user_type: str, language: str
) -> dict:
    moods = load_moods(user_id)
    if len(moods) < 3:
        return {"alert": False}

    recent_scores = [m["score"] for m in moods[-3:]]
    avg_recent = sum(recent_scores) / len(recent_scores)

    # 3 days low mood check
    if avg_recent <= 2:
        lang_map = {
            "tamil": "கடந்த 3 நாட்களாக உன் mood low-ஆ இருக்கு. பேசலாமா? 💙",
            "english": "Your mood has been low for 3 days. Want to talk? 💙",
            "hindi": "पिछले 3 दिनों से मूड कम है। बात करें? 💙"
        }
        return {
            "alert": True,
            "message": lang_map.get(language, lang_map["english"]),
            "severity": "medium"
        }

    # Declining trend check
    declining = all(
        recent_scores[i] < recent_scores[i-1]
        for i in range(1, len(recent_scores))
    )
    if declining:
        lang_map = {
            "tamil": "உன் mood கொஞ்சமா குறைஞ்சு வருது. ஏதாவது பேசணுமா? 💙",
            "english": "Your mood seems to be declining. Everything okay? 💙",
            "hindi": "मूड घट रहा है। सब ठीक है? 💙"
        }
        return {
            "alert": True,
            "message": lang_map.get(language, lang_map["english"]),
            "severity": "low"
        }

    return {"alert": False}