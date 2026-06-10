from groq import Groq
from utils.memory import save_message, get_recent_context, save_mood, load_moods
import os
from dotenv import load_dotenv
from datetime import datetime, date

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CAMPUS_RESOURCES = [
    {"name": "iCall", "number": "9152987821", "type": "Mental Health"},
    {"name": "SAHAS", "number": "1800-599-0019", "type": "Counseling"},
    {"name": "Vandrevala Foundation", "number": "18602662345", "type": "24/7 Support"},
    {"name": "NIMHANS", "number": "080-46110007", "type": "Psychiatry"},
]

STUDY_TIPS = [
    {"title": "Pomodoro", "desc": "25 min study + 5 min break", "icon": "⏱"},
    {"title": "Deep Breathing", "desc": "4-4-4 breathing reduces stress", "icon": "🌬"},
    {"title": "Body Scan", "desc": "Relax muscles from head to toe", "icon": "🧘"},
    {"title": "Take a Walk", "desc": "10 min walk boosts memory 20%", "icon": "🚶"},
    {"title": "Stay Hydrated", "desc": "Drink water every 30 minutes", "icon": "💧"},
]

AFFIRMATIONS = [
    {"en": "You are capable of more than you know! 💪",
     "ta": "உனக்கு தெரிஞ்சதை விட அதிகமா நீ capable! 💪"},
    {"en": "One step at a time — you've got this! 🌟",
     "ta": "ஒவ்வொரு step-ஆ போ — நீ செய்வே! 🌟"},
    {"en": "Your efforts today shape your tomorrow! 🔥",
     "ta": "இன்னைக்கு பண்ற effort நாளைக்கு result தரும்! 🔥"},
    {"en": "It's okay to ask for help — that's strength! 💙",
     "ta": "உதவி கேக்குறது தைரியம் — பலவீனம் இல்ல! 💙"},
    {"en": "You are enough, exactly as you are! ✨",
     "ta": "நீ இருக்கற மாதிரியே போதும்! ✨"},
]

# ============ EXAM SEASON DETECT ============

def detect_exam_season(user_id: str) -> dict:
    today = date.today()
    month = today.month

    # Common exam months in India
    exam_months = [3, 4, 10, 11]
    is_exam_season = month in exam_months

    if is_exam_season:
        return {
            "is_exam_season": True,
            "message": "Exam season detected! Extra support activated 📚",
            "month": today.strftime("%B"),
            "stress_tips": STUDY_TIPS[:3]
        }
    return {
        "is_exam_season": False,
        "message": "Regular mode",
        "month": today.strftime("%B")
    }

# ============ STRESS TRACKER ============

def log_stress(user_id: str, stress_level: int, language: str) -> dict:
    # Save as mood (inverse — high stress = low mood)
    mood_score = max(1, 6 - stress_level)
    save_mood(user_id, mood_score)
    save_message(user_id, "system", f"Stress level logged: {stress_level}/5")

    if stress_level >= 4:
        msg = (
            "Stress அதிகமா இருக்கு — கீழே உள்ள tips try பண்ணு! 💙"
            if language == "tamil"
            else "High stress detected — try the tips below! 💙"
        )
        return {
            "saved": True,
            "level": "high",
            "message": msg,
            "tips": STUDY_TIPS,
            "resources": CAMPUS_RESOURCES[:2]
        }
    elif stress_level == 3:
        msg = (
            "Moderate stress — break எடு! ☕"
            if language == "tamil"
            else "Moderate stress — take a break! ☕"
        )
        return {
            "saved": True,
            "level": "medium",
            "message": msg,
            "tips": STUDY_TIPS[:2]
        }
    else:
        msg = (
            "நீ நல்லா இருக்க! தொடர்ந்து போ! 🌟"
            if language == "tamil"
            else "You're doing great! Keep going! 🌟"
        )
        return {"saved": True, "level": "low", "message": msg}

# ============ STUDY SESSION TRACKER ============

def log_study_session(
    user_id: str, duration_minutes: int, language: str
) -> dict:
    save_message(
        user_id, "system",
        f"Study session: {duration_minutes} minutes"
    )

    if duration_minutes >= 25:
        msg = (
            f"{duration_minutes} நிமிடம் படிச்சே! Break எடு! ☕"
            if language == "tamil"
            else f"{duration_minutes} min study done! Take a break! ☕"
        )
        return {
            "logged": True,
            "message": msg,
            "break_suggested": True,
            "break_duration": 5
        }
    return {
        "logged": True,
        "message": f"Session logged: {duration_minutes} min",
        "break_suggested": False
    }

# ============ DAILY AFFIRMATION ============

def get_affirmation(language: str) -> dict:
    import random
    affirmation = random.choice(AFFIRMATIONS)
    return {
        "affirmation": (
            affirmation["ta"] if language == "tamil"
            else affirmation["en"]
        ),
        "date": date.today().isoformat()
    }

# ============ CAMPUS RESOURCES ============

def get_campus_resources(language: str) -> dict:
    return {
        "resources": CAMPUS_RESOURCES,
        "message": (
            "இந்த numbers free மற்றும் confidential 💙"
            if language == "tamil"
            else "These helplines are free & confidential 💙"
        )
    }

# ============ STUDENT AI CHAT ============

def student_chat(
    user_id: str, message: str,
    language: str, is_anonymous: bool = False
) -> dict:
    context = get_recent_context(user_id, 5)
    exam_info = detect_exam_season(user_id)
    moods = load_moods(user_id)
    recent_stress = (
        f"Recent mood scores: {[m['score'] for m in moods[-3:]]}"
        if moods else "No mood history"
    )

    lang_instruction = (
        "Respond ONLY in Tamil. Use casual, friendly Tamil."
        if language == "tamil"
        else "Respond in casual, friendly English."
    )

    anonymous_note = (
        "User is in anonymous mode — extra privacy. Don't ask personal details."
        if is_anonymous else ""
    )

    system_prompt = f"""You are MindBridge AI, a mental health companion for students.
{lang_instruction}
{anonymous_note}
Exam season: {'Yes — be extra supportive' if exam_info['is_exam_season'] else 'No'}
{recent_stress}

Be friendly, understanding, and non-judgmental.
If stress/anxiety mentioned — suggest breathing exercises.
If academic pressure — validate feelings first, then suggest tips.
Keep responses short — max 2-3 sentences.
Never reveal user data to anyone."""

    messages_list = [{"role": "system", "content": system_prompt}]
    for ctx in context[-5:]:
        messages_list.append({
            "role": ctx["role"],
            "content": ctx["content"]
        })
    messages_list.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages_list,
            max_tokens=200,
        )
        reply = response.choices[0].message.content

        if not is_anonymous:
            save_message(user_id, "user", message)
            save_message(user_id, "assistant", reply)

        return {
            "reply": reply,
            "success": True,
            "anonymous": is_anonymous,
            "exam_season": exam_info["is_exam_season"]
        }
    except Exception as e:
        err = (
            "மன்னிக்கவும், மீண்டும் முயற்சிக்கவும்."
            if language == "tamil"
            else "Sorry, please try again."
        )
        return {"reply": err, "success": False}