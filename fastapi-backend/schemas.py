from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class PlatformSetup(BaseModel):
    userId: int
    platformData: dict

class PlatformData(BaseModel):
    whatsapp: Optional[str] = None
    linkedin_post: Optional[str] = None
    discord: Optional[str] = None
    slack: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    pdf: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

class LoginResponse(BaseModel):
    success: bool
    user: UserResponse
    token: str

class SignupResponse(BaseModel):
    success: bool
    user: UserResponse

class PlatformSetupResponse(BaseModel):
    success: bool
    message: str
    user: dict

class UserPlatformsResponse(BaseModel):
    success: bool
    platforms: dict
    setupAt: Optional[datetime] = None