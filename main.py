from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.models import ChatRequest, ChatResponse, MoodRequest
from utils.memory import save_mood, get_mood_average
from graph import mindbridge_graph
import os

app = FastAPI(title="MindBridge AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "MindBridge AI Backend Running!"}

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
    return {"saved": True, "average": avg}

@app.get("/pattern/{user_id}")
def get_pattern(user_id: str, user_type: str = "student", language: str = "english"):
    from agents.pattern_agent import pattern_agent
    result = pattern_agent(user_id, user_type, language)
    return result

@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0"}