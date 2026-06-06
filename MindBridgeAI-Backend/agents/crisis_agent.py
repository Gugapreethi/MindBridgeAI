from utils.prompts import CRISIS_KEYWORDS

def crisis_agent(message: str) -> dict:
    lower = message.lower()

    # Keyword check
    detected = any(keyword in lower for keyword in CRISIS_KEYWORDS)

    # Severity level
    high_risk = ["suicide", "kill myself", "end my life",
                 "சாக வேணும்", "உயிரை மாய்ச்சுக்கணும்"]
    medium_risk = ["want to die", "no reason to live",
                   "இனி வாழ வேண்டாம்", "வாழ்க்கை வேண்டாம்"]

    severity = "none"
    if any(k in lower for k in high_risk):
        severity = "high"
    elif any(k in lower for k in medium_risk):
        severity = "medium"
    elif detected:
        severity = "low"

    return {
        "crisis_detected": detected,
        "severity": severity,
        "helplines": [
            {"name": "iCall", "number": "9152987821"},
            {"name": "Vandrevala", "number": "18602662345"},
            {"name": "Emergency", "number": "112"},
        ] if detected else []
    }