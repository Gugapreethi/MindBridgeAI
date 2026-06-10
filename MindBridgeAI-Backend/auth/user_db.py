import json
import os
import uuid
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USER_DIR = "data/users"
os.makedirs(USER_DIR, exist_ok=True)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_user(name: str, email: str, password: str,
                user_type: str, language: str, phone: str = None):
    user_id = str(uuid.uuid4())
    user = {
        "user_id": user_id,
        "name": name,
        "email": email,
        "phone": phone,
        "password": hash_password(password),
        "user_type": user_type,
        "language": language,
        "is_admin": False,
        "created_at": datetime.now().isoformat()
    }
    with open(f"{USER_DIR}/{user_id}.json", "w") as f:
        json.dump(user, f, indent=2)
    return user

def get_user_by_email(email: str):
    for file in os.listdir(USER_DIR):
        with open(f"{USER_DIR}/{file}") as f:
            user = json.load(f)
            if user["email"] == email:
                return user
    return None

def get_all_users():
    users = []
    for file in os.listdir(USER_DIR):
        with open(f"{USER_DIR}/{file}") as f:
            user = json.load(f)
            user.pop("password", None)
            users.append(user)
    return users

def create_admin():
    if not get_user_by_email("admin@mindbridge.ai"):
        create_user(
            name="Admin",
            email="admin@mindbridge.ai",
            password="admin123",
            user_type="admin",
            language="english",
        )
        print("Admin created!")