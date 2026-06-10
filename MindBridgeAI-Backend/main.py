from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.models import ChatRequest, ChatResponse, MoodRequest
from utils.memory import save_mood, get_mood_average
from agents.analytics_agent import (
    calculate_burnout_score, generate_weekly_report, get_proactive_alert
)
from agents.elder_agent import (
    get_medications, mark_medication_taken,
    get_memory_game, check_memory_game,
    elder_chat, generate_family_summary
)
from agents.student_agent import (
    detect_exam_season, log_stress, log_study_session,
    get_affirmation, get_campus_resources, student_chat
)
from agents.professional_agent import (
    log_work_hours, calculate_professional_burnout,
    get_balance_suggestions, get_quick_session, professional_chat
)
from agents.social_agent import (
    save_journal_entry, get_journal_entries,
    get_daily_affirmation, get_user_milestones,
    check_and_unlock_milestones, update_streak,
    generate_journal_reflection
)
from graph import mindbridge_graph
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="MindBridge AI Backend v4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ REQUEST MODELS ============

class MedicationRequest(BaseModel):
    user_id: str
    med_id: int
    language: str = "english"

class MemoryGameCheckRequest(BaseModel):
    user_id: str
    game_id: int
    user_answers: List[str]
    language: str = "english"

class ElderChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "english"

class StressRequest(BaseModel):
    user_id: str
    stress_level: int
    language: str = "english"

class StudySessionRequest(BaseModel):
    user_id: str
    duration_minutes: int
    language: str = "english"

class StudentChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "english"
    is_anonymous: bool = False

class WorkHoursRequest(BaseModel):
    user_id: str
    hours: float
    language: str = "english"

class ProfessionalChatRequest(BaseModel):
    user_id: str
    message: str
    language: str = "english"

class JournalRequest(BaseModel):
    user_id: str
    entries: List[str]
    language: str = "english"

class MilestoneRequest(BaseModel):
    user_id: str
    action: str
    language: str = "english"

# ============ COMMON ROUTES ============

@app.get("/")
def root():
    return {"status": "MindBridge AI Backend Running! 🧠", "version": "4.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "version": "4.0.0",
            "modules": ["core", "analytics", "elder", "student", "professional", "social"]}

@app.post("/chat")
def chat(request: ChatRequest):
    result = mindbridge_graph.invoke({
        "user_id": request.user_id,
        "message": request.message,
        "user_type": request.user_type,
        "language": request.language,
        "contact_phone": None,
        "result": None
    })
    data = result["result"]
    return ChatResponse(
        reply=data["reply"],
        crisis_detected=data["crisis"]["crisis_detected"],
        pattern_insight=data["pattern"].get("insight"),
        mood_score=data["pattern"].get("average")
    )

@app.post("/mood")
def log_mood(request: MoodRequest):
    save_mood(request.user_id, request.mood_score)
    avg = get_mood_average(request.user_id)
    alert = get_proactive_alert(request.user_id, "student", "english")
    streak = update_streak(request.user_id)
    milestones = check_and_unlock_milestones(request.user_id, "first_mood", "english")
    return {"saved": True, "average": avg, "alert": alert,
            "streak": streak, "milestones": milestones}

# ============ ANALYTICS (Module 3) ============

@app.get("/burnout/{user_id}")
def get_burnout(user_id: str, user_type: str = "student"):
    return calculate_burnout_score(user_id, user_type)

@app.get("/weekly-report/{user_id}")
def get_weekly_report(user_id: str, user_type: str = "student", language: str = "english"):
    return generate_weekly_report(user_id, user_type, language)

@app.get("/alert/{user_id}")
def get_alert(user_id: str, user_type: str = "student", language: str = "english"):
    return get_proactive_alert(user_id, user_type, language)

# ============ ELDER ROUTES (Module 4) ============

@app.get("/elder/medications/{user_id}")
def get_elder_medications(user_id: str):
    return get_medications(user_id)

@app.post("/elder/medication/taken")
def take_medication(request: MedicationRequest):
    return mark_medication_taken(request.user_id, request.med_id, request.language)

@app.get("/elder/memory-game")
def start_memory_game(user_id: str, language: str = "english"):
    return get_memory_game(user_id, language)

@app.post("/elder/memory-game/check")
def check_game(request: MemoryGameCheckRequest):
    return check_memory_game(request.user_id, request.game_id,
                             request.user_answers, request.language)

@app.post("/elder/chat")
def elder_ai_chat(request: ElderChatRequest):
    return elder_chat(request.user_id, request.message, request.language)

@app.get("/elder/family-summary/{user_id}")
def get_family_summary(user_id: str, language: str = "english"):
    return generate_family_summary(user_id, language)

# ============ STUDENT ROUTES (Module 5) ============

@app.get("/student/exam-season/{user_id}")
def check_exam_season(user_id: str):
    return detect_exam_season(user_id)

@app.post("/student/stress")
def track_stress(request: StressRequest):
    return log_stress(request.user_id, request.stress_level, request.language)

@app.post("/student/study-session")
def track_study(request: StudySessionRequest):
    return log_study_session(request.user_id, request.duration_minutes, request.language)

@app.get("/student/affirmation")
def student_affirmation(language: str = "english"):
    return get_affirmation(language)

@app.get("/student/resources")
def campus_resources(language: str = "english"):
    return get_campus_resources(language)

@app.post("/student/chat")
def student_ai_chat(request: StudentChatRequest):
    return student_chat(request.user_id, request.message,
                        request.language, request.is_anonymous)

# ============ PROFESSIONAL ROUTES (Module 6) ============

@app.post("/professional/work-hours")
def track_work_hours(request: WorkHoursRequest):
    return log_work_hours(request.user_id, request.hours, request.language)

@app.get("/professional/burnout/{user_id}")
def get_professional_burnout(user_id: str, language: str = "english"):
    return calculate_professional_burnout(user_id, language)

@app.get("/professional/suggestions/{user_id}")
def get_suggestions(user_id: str, language: str = "english"):
    return get_balance_suggestions(user_id, language)

@app.get("/professional/session")
def quick_session(session_type: str = "breathing", language: str = "english"):
    return get_quick_session(session_type, language)

@app.post("/professional/chat")
def professional_ai_chat(request: ProfessionalChatRequest):
    return professional_chat(request.user_id, request.message, request.language)

# ============ SOCIAL ROUTES (Module 7) ============

@app.post("/journal/save")
def save_journal(request: JournalRequest):
    result = save_journal_entry(request.user_id, request.entries, request.language)
    milestones = check_and_unlock_milestones(request.user_id, "journal_5", request.language)
    result["milestones"] = milestones
    return result

@app.get("/journal/{user_id}")
def get_journal(user_id: str, limit: int = 7):
    return {"entries": get_journal_entries(user_id, limit)}

@app.post("/journal/reflect")
def journal_reflect(request: JournalRequest):
    return generate_journal_reflection(request.user_id, request.entries, request.language)

@app.get("/affirmation")
def daily_affirmation(user_id: str, language: str = "english"):
    return get_daily_affirmation(user_id, language)

@app.get("/milestones/{user_id}")
def user_milestones(user_id: str):
    return get_user_milestones(user_id)

@app.post("/milestones/unlock")
def milestone_unlock(request: MilestoneRequest):
    return check_and_unlock_milestones(request.user_id, request.action, request.language)

@app.post("/streak/update")
def streak_update(user_id: str):
    return update_streak(user_id)
    from auth.auth_routes import router as auth_router
from admin.admin_routes import router as admin_router
from auth.user_db import create_admin

# Startup-ல admin create பண்ணு
@app.on_event("startup")
def startup():
    create_admin()

# Routers include பண்ணு
app.include_router(auth_router)
app.include_router(admin_router)