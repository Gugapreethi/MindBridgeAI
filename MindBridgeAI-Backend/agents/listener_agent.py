from groq import Groq
from utils.memory import save_message, load_history
from utils.prompts import LISTENER_PROMPT
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def listener_agent(user_id: str, message: str, user_type: str, language: str) -> str:
    # Save user message
    save_message(user_id, "user", message)

    # Load history
    history = load_history(user_id)
    history_text = "\n".join([
        f"{h['role']}: {h['content']}"
        for h in history[-10:]
    ])

    # Language mapping
    lang_map = {
        "tamil": "Tamil",
        "english": "English",
        "hindi": "Hindi"
    }
    lang = lang_map.get(language, "English")

    # LLM call
    prompt = LISTENER_PROMPT.format(
        user_type=user_type,
        language=lang,
        history=history_text
    )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": message}
        ],
        max_tokens=300
    )

    reply = response.choices[0].message.content

    # Save AI reply
    save_message(user_id, "assistant", reply)

    return reply