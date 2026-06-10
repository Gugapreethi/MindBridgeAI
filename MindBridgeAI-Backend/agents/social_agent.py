from groq import Groq
from utils.memory import save_message, get_recent_context, save_mood, load_moods
import os
from dotenv import load_dotenv
from datetime import datetime, date, timedelta

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

WORK_TIPS = [
    {"title": "Set Boundaries", "desc": "Stop checking work emails after 7 PM", "icon": "🚫"},
    {"title": "5-Min Mindfulness", "desc": "Quick breathing between meetings", "icon": "🧘"},
    {"title": "Lunch Break", "desc": "Step away from desk during lunch", "icon": "🍱"},
    {"title": "Micro Breaks", "desc": "5 min break every 90 minutes", "icon": "⏸"},
    {"title": "Weekend Detox", "desc": "No work on weekends — recharge!", "icon": "🌿"},
]

# ============ WORK HOURS TRACKER ============

def log_work_hours(user_id: str, hours: float, language: str) -> dict:
    save_message(user_id, "system", f"Work hours logged: {hours}")

    if hours >= 10:
        msg = (
            "10+ மணி நேரம் வேலை — உடனே rest எடு! 😮"
            if language == "tamil"
            else "10+ hours work detected — rest immediately! 😮"
        )
        level = "critical"
    elif hours >= 8:
        msg = (
            "நீண்ட நேரம் வேலை — Balance பண்ணு! ⚠️"
            if language == "tamil"
            else "Long work hours — maintain balance! ⚠️"
        )
        level = "high"
    else:
        msg = (
            "நல்ல balance! தொடர்ந்து போ! ✅"
            if language == "tamil"
            else "Good balance! Keep it up! ✅"
        )
        level = "normal"

    return {
        "logged": True,
        "hours": hours,
        "level": level,
        "message": msg,
        "tips": WORK_TIPS[:2] if hours >= 8 else []
    }

# ============ BURNOUT CALCULATOR ============

def calculate_professional_burnout(user_id: str, language: str) -> dict:
    moods = load_moods(user_id)

    if len(moods) < 3:
        return {
            "score": None,
            "level": "insufficient_data",
            "message": "More data needed — log mood daily!"
        }

    recent = moods[-7:]
    scores = [m["score"] for m in recent]
    avg = sum(scores) / len(scores)
    low_days = sum(1 for s in scores if s <= 2)
    declining = all(
        scores[i] <= scores[i-1]
        for i in range(1, min(3, len(scores)))
    )

    burnout = round(100 - (avg / 5 * 100))
    if low_days >= 3:
        burnout = min(100, burnout + 15)
    if declining:
        burnout = min(100, burnout + 10)

    if burnout >= 70:
        level = "critical"
        msg = (
            "Burnout risk மிகவும் அதிகம்! Professional help தேடு! 🚨"
            if language == "tamil"
            else "Critical burnout risk! Please seek professional help! 🚨"
        )
        color = "#EF4444"
    elif burnout >= 50:
        level = "high"
        msg = (
            "Burnout அதிகமாகுது — இப்போவே steps எடு! ⚠️"
            if language == "tamil"
            else "High burnout — take action now! ⚠️"
        )
        color = "#F97316"
    elif burnout >= 30:
        level = "medium"
        msg = (
            "Moderate stress — self-care பண்ணு! 🌿"
            if language == "tamil"
            else "Moderate stress — practice self-care! 🌿"
        )
        color = "#EAB308"
    else:
        level = "low"
        msg = (
            "நல்லா இருக்க! Balance maintain பண்ணு! 😊"
            if language == "tamil"
            else "You're doing well! Maintain balance! 😊"
        )
        color = "#22C55E"

    return {
        "score": burnout,
        "level": level,
        "message": msg,
        "color": color,
        "avg_mood": round(avg, 1),
        "low_days": low_days,
        "tips": WORK_TIPS
    }

# ============ WORK-LIFE BALANCE SUGGESTIONS ============

def get_balance_suggestions(user_id: str, language: str) -> dict:
    moods = load_moods(user_id)
    burnout = calculate_professional_burnout(user_id, language)

    suggestions = []

    if burnout.get("score", 0) >= 70:
        suggestions = [
            {"text": "இந்த weekend-ல work email check பண்ணாதே" if language == "tamil"
             else "Don't check work emails this weekend", "priority": "high"},
            {"text": "Professional counselor கிட்ட பேசு" if language == "tamil"
             else "Talk to a professional counselor", "priority": "high"},
            {"text": "Daily 30 min walk start பண்ணு" if language == "tamil"
             else "Start a daily 30-min walk", "priority": "medium"},
        ]
    elif burnout.get("score", 0) >= 50:
        suggestions = [
            {"text": "5-min mindfulness between meetings" if language == "tamil"
             else "5-min mindfulness between meetings", "priority": "medium"},
            {"text": "Lunch break-ல desk விட்டு போ" if language == "tamil"
             else "Step away from desk during lunch", "priority": "medium"},
            {"text": "8 மணி நேரத்திற்கு மேல் work பண்ணாதே" if language == "tamil"
             else "Don't work beyond 8 hours", "priority": "high"},
        ]
    else:
        suggestions = [
            {"text": "நல்லா பண்ற — continue! 🌟" if language == "tamil"
             else "You're doing great — keep it up! 🌟", "priority": "low"},
            {"text": "Weekly hobbies time allocate பண்ணு" if language == "tamil"
             else "Allocate weekly time for hobbies", "priority": "low"},
        ]

    return {
        "suggestions": suggestions,
        "burnout_score": burnout.get("score"),
        "anonymous": True,
        "note": (
            "இந்த data உன் employer-க்கு தெரியாது 🔒"
            if language == "tamil"
            else "This data is never shared with your employer 🔒"
        )
    }

# ============ QUICK 5-MIN SESSION ============

def get_quick_session(session_type: str, language: str) -> dict:
    sessions = {
        "breathing": {
            "title": "4-4-4 Breathing" if language == "english" else "மூச்சு பயிற்சி",
            "steps": [
                "Inhale for 4 seconds" if language == "english" else "4 sec மூச்சு இழு",
                "Hold for 4 seconds" if language == "english" else "4 sec வை",
                "Exhale for 4 seconds" if language == "english" else "4 sec வெளியே விடு",
                "Repeat 4 times" if language == "english" else "4 முறை செய்",
            ],
            "duration": 5,
            "icon": "🌬"
        },
        "mindfulness": {
            "title": "Body Scan" if language == "english" else "உடல் relaxation",
            "steps": [
                "Close your eyes" if language == "english" else "கண்களை மூடு",
                "Relax your shoulders" if language == "english" else "தோள்களை relaxed பண்ணு",
                "Unclench your jaw" if language == "english" else "jaw-ஐ relax பண்ணு",
                "Take 5 deep breaths" if language == "english" else "5 ஆழ்ந்த மூச்சு எடு",
            ],
            "duration": 5,
            "icon": "🧘"
        },
        "gratitude": {
            "title": "Quick Gratitude" if language == "english" else "நன்றி பட்டியல்",
            "steps": [
                "Think of 3 good things today" if language == "english" else "இன்னைக்கு 3 நல்ல விஷயம் நினை",
                "Write them down" if language == "english" else "எழுது",
                "Feel grateful for 1 minute" if language == "english" else "1 நிமிடம் நன்றியாக இரு",
            ],
            "duration": 5,
            "icon": "🙏"
        }
    }

    return sessions.get(session_type, sessions["breathing"])

# ============ PROFESSIONAL AI CHAT ============

def professional_chat(user_id: str, message: str, language: str) -> dict:
    context = get_recent_context(user_id, 5)
    burnout = calculate_professional_burnout(user_id, language)

    lang_instruction = (
        "Respond ONLY in Tamil. Use professional but warm Tamil."
        if language == "tamil"
        else "Respond in professional but warm English."
    )

    system_prompt = f"""You are MindBridge AI, a mental health companion for professionals.
{lang_instruction}
Current burnout level: {burnout.get('level', 'unknown')}
Be empathetic, professional, and practical.
Suggest quick actionable tips — professionals are busy.
Emphasize: this chat is completely anonymous and private.
Employer will NEVER know. Keep responses to 2-3 sentences."""

    messages_list = [{"role": "system", "content": system_prompt}]
    for ctx in context[-5:]:
        messages_list.append({"role": ctx["role"], "content": ctx["content"]})
    messages_list.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages_list,
            max_tokens=200,
        )
        reply = response.choices[0].message.content
        save_message(user_id, "user", message)
        save_message(user_id, "assistant", reply)
        return {"reply": reply, "success": True, "anonymous": True}
    except Exception as e:
        err = (
            "மன்னிக்கவும், மீண்டும் முயற்சிக்கவும்."
            if language == "tamil"
            else "Sorry, please try again."
        )
        return {"reply": err, "success": False}