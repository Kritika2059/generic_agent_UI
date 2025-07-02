from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET") or (_ for _ in ()).throw(ValueError("JWT_SECRET not found in environment"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 1

# 🧠 In-memory user storage
users_db = []

# Request/Response Schemas
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

class LoginResponse(BaseModel):
    success: bool
    user: UserResponse
    token: str

# Utility
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Routes

@router.post("/signup")
def signup(request: SignupRequest):
    # Check for existing email
    if any(u["email"] == request.email for u in users_db):
        raise HTTPException(status_code=400, detail="Email already exists")

    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(request.password)

    user_data = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "password": hashed_password,
        "role": "user"
    }

    users_db.append(user_data)
    return {"message": "Signup successful"}

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    user = next((u for u in users_db if u["email"] == request.email), None)

    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(data={"userId": user["id"], "role": user["role"]})

    return LoginResponse(
        success=True,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"]
        ),
        token=access_token
    )
