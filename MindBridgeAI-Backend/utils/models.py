from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    user_id: str
    message: str
    user_type: str
    language: str

class ChatResponse(BaseModel):
    reply: str
    mood_score: Optional[int] = None
    crisis_detected: bool = False
    pattern_insight: Optional[str] = None

class MoodRequest(BaseModel):
    user_id: str
    mood_score: int

class CareNetworkAlert(BaseModel):
    user_id: str
    contact_phone: str
    message: str