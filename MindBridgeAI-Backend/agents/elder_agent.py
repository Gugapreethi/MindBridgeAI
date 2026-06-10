from groq import Groq
from utils.memory import save_message, get_recent_context, save_mood
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MEDICATIONS = [
    {"id": 1, "name": "Morning Medicine", "time": "08:00", "taken": False},
    {"id": 2, "name": "Afternoon Medicine", "time": "14:00", "taken": False},
    {"id": 3, "name": "Night Medicine", "time": "21:00", "taken": False},
]

MEMORY_GAMES = [
    {"id": 1, "words_tamil": ["வீடு", "மரம்", "பூ", "நீர்", "மலை"],
               "words_english": ["House", "Tree", "Flower", "Water", "Mountain"]},
    {"id": 2, "words_tamil": ["சூரியன்", "நிலா", "நட்சத்திரம்", "மேகம்", "மழை"],
               "words_english": ["Sun", "Moon", "Star", "Cloud", "Rain"]},
    {"id": 3, "words_tamil": ["அன்பு", "நம்பிக்கை", "மகிழ்ச்சி", "அமைதி", "கருணை"],
               "words_english": ["Love", "Trust", "Joy", "Peace", "Kindness"]},
]

# ============ MEDICATION TRACKER ============

def get_medications(user_id: str) -> dict:
    return {
        "medications": MEDICATIONS,
        "taken_count": sum(1 for m in MEDICATIONS if m["taken"]),
        "total": len(MEDICATIONS),
        "message": "இன்றைய மருந்துகள்" if True else "Today's medications"
    }

def mark_medication_taken(user_id: str, med_id: int, language: str) -> dict:
    for med in MEDICATIONS:
        if med["id"] == med_id:
            med["taken"] = True
            msg = (
                f"{med['name']} எடுத்துவிட்டீர்கள்! ✅"
                if language == "tamil"
                else f"{med['name']} marked as taken! ✅"
            )
            save_message(user_id, "system", f"Medication taken: {med['name']}")
            return {"success": True, "message": msg, "medication": med}
    return {"success": False, "message": "Medication not found"}

# ============ MEMORY GAME ============

def get_memory_game(user_id: str, language: str) -> dict:
    import random
    game = random.choice(MEMORY_GAMES)
    words = game["words_tamil"] if language == "tamil" else game["words_english"]
    return {
        "game_id": game["id"],
        "words": words,
        "language": language,
        "duration_seconds": 8,
        "instruction": (
            "இந்த வார்த்தைகளை நினைவில் வையுங்கள்!"
            if language == "tamil"
            else "Remember these words for 8 seconds!"
        )
    }

def check_memory_game(
    user_id: str, game_id: int,
    user_answers: list, language: str
) -> dict:
    game = next((g for g in MEMORY_GAMES if g["id"] == game_id), None)
    if not game:
        return {"error": "Game not found"}

    correct_words = (
        game["words_tamil"] if language == "tamil"
        else game["words_english"]
    )
    correct = [w for w in user_answers if w in correct_words]
    score = len(correct)
    total = len(correct_words)
    percentage = round((score / total) * 100)

    if percentage >= 80:
        result = "மிகவும் நல்லது! 🎉" if language == "tamil" else "Excellent! 🎉"
    elif percentage >= 60:
        result = "நல்ல முயற்சி! 👍" if language == "tamil" else "Good try! 👍"
    else:
        result = "மீண்டும் முயற்சி! 💪" if language == "tamil" else "Try again! 💪"

    save_message(user_id, "system", f"Memory game score: {score}/{total}")

    return {
        "score": score,
        "total": total,
        "percentage": percentage,
        "result": result,
        "correct_words": correct_words,
    }

# ============ ELDER AI CHAT ============

def elder_chat(user_id: str, message: str, language: str) -> dict:
    context = get_recent_context(user_id, 5)

    lang_instruction = (
        "Respond ONLY in Tamil. Use simple, clear Tamil words."
        if language == "tamil"
        else "Respond in simple English. Be very clear and warm."
    )

    system_prompt = f"""You are a caring AI companion for elderly users.
{lang_instruction}
Be very patient, warm, and speak slowly and clearly.
Use large concept thinking — simple words only.
If they mention health issues, suggest seeing a doctor.
Keep responses short — max 2-3 sentences.
Always be encouraging and positive."""

    messages = [{"role": "system", "content": system_prompt}]
    for ctx in context[-5:]:
        messages.append({"role": ctx["role"], "content": ctx["content"]})
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            max_tokens=150,
        )
        reply = response.choices[0].message.content
        save_message(user_id, "user", message)
        save_message(user_id, "assistant", reply)
        return {"reply": reply, "success": True}
    except Exception as e:
        return {"reply": "மன்னிக்கவும், மீண்டும் முயற்சிக்கவும்.", "success": False}

# ============ FAMILY SUMMARY ============

def generate_family_summary(user_id: str, language: str) -> dict:
    context = get_recent_context(user_id, 10)
    meds_taken = sum(1 for m in MEDICATIONS if m["taken"])

    if not context:
        summary = (
            "இன்று எந்த activity-யும் இல்லை."
            if language == "tamil"
            else "No activity recorded today."
        )
        return {"summary": summary, "medications_taken": meds_taken}

    messages_text = "\n".join(
        [f"{c['role']}: {c['content']}" for c in context[-5:]]
    )

    prompt = f"""Generate a brief family summary for an elderly user's day.
Language: {'Tamil' if language == 'tamil' else 'English'}
Medications taken: {meds_taken}/3
Recent conversations: {messages_text}

Write a warm, 2-sentence summary for the family.
Example: "அம்மா இன்னைக்கு happy-ஆ இருந்தாங்க 😊 3 மருந்தும் எடுத்தாங்க."
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
        )
        summary = response.choices[0].message.content
        return {
            "summary": summary,
            "medications_taken": meds_taken,
            "total_medications": 3,
            "generated_at": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "summary": "இன்று நல்லா இருந்தாங்க.",
            "medications_taken": meds_taken
        }