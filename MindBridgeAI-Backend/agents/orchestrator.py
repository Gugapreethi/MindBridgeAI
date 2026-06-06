from agents.listener_agent import listener_agent
from agents.pattern_agent import pattern_agent
from agents.crisis_agent import crisis_agent
from agents.care_network_agent import care_network_agent

def orchestrator(
    user_id: str,
    message: str,
    user_type: str,
    language: str,
    contact_phone: str = None
) -> dict:

    # Step 1 — Crisis check
    crisis_result = crisis_agent(message)

    # Step 2 — Listener Agent
    reply = listener_agent(user_id, message, user_type, language)

    # Step 3 — Pattern Agent
    pattern_result = pattern_agent(user_id, user_type, language)

    # Step 4 — Care Network (crisis இருந்தா மட்டும்)
    care_result = None
    if crisis_result["crisis_detected"] and contact_phone:
        care_result = care_network_agent(
            user_id,
            crisis_result["severity"],
            contact_phone
        )

    return {
        "reply": reply,
        "crisis": crisis_result,
        "pattern": pattern_result,
        "care_alert": care_result
    }