from groq import Groq
from utils.memory import load_moods, get_mood_average
from utils.prompts import PATTERN_PROMPT
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def pattern_agent(user_id: str, user_type: str, language: str) -> dict:
    moods = load_moods(user_id)

    if len(moods) < 3:
        return {
            "insight": None,
            "average": None,
            "trend": "insufficient_data"
        }

    scores = [m["score"] for m in moods[-7:]]
    average = sum(scores) / len(scores)

    # Trend detect
    if len(scores) >= 3:
        recent = scores[-3:]
        if all(recent[i] <= recent[i-1] for i in range(1, len(recent))):
            trend = "declining"
        elif all(recent[i] >= recent[i-1] for i in range(1, len(recent))):
            trend = "improving"
        else:
            trend = "stable"
    else:
        trend = "stable"

    # Language mapping
    lang_map = {"tamil": "Tamil", "english": "English", "hindi": "Hindi"}
    lang = lang_map.get(language, "English")

    # LLM insight
    prompt = PATTERN_PROMPT.format(
        mood_history=scores,
        user_type=user_type,
        language=lang
    )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100
    )

    insight = response.choices[0].message.content

    return {
        "insight": insight,
        "average": round(average, 1),
        "trend": trend,
        "scores": scores
    }