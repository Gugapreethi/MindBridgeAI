from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth.user_db import (
    create_user, get_user_by_email,
    verify_password, get_all_users
)
from auth.jwt_handler import create_token, verify_token

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    user_type: str
    language: str
    phone: str = None

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(request: RegisterRequest):
    existing = get_user_by_email(request.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists!")

    user = create_user(
        name=request.name,
        email=request.email,
        password=request.password,
        user_type=request.user_type,
        language=request.language,
        phone=request.phone
    )

    token = create_token(
        user["user_id"],
        user["email"],
        user["is_admin"]
    )

    return {
        "token": token,
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "user_type": user["user_type"],
            "language": user["language"],
            "is_admin": user["is_admin"]
        }
    }

@router.post("/login")
def login(request: LoginRequest):
    user = get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Email not found!")

    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password!")

    token = create_token(
        user["user_id"],
        user["email"],
        user["is_admin"]
    )

    return {
        "token": token,
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "user_type": user["user_type"],
            "language": user["language"],
            "is_admin": user["is_admin"]
        }
    }

@router.get("/me")
def get_me(token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token!")
    return payload