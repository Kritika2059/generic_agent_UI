from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime
from schemas import (
    UserCreate, SignupResponse, UserResponse, 
    PlatformSetup, PlatformSetupResponse, UserPlatformsResponse
)
from models import User
from database import SessionLocal
from sqlalchemy.exc import IntegrityError

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/signup", response_model=SignupResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    print("=== SIGNUP ROUTE HIT ===")
    print(f"Request body: {user.dict()}")
    print(f"Signup received: {user.name}, {user.email}")
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Determine role
        role = "admin" if user.email == "chadgigaa404@gmail.com" else "user"
        
        # Create new user
        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_password,
            role=role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return SignupResponse(
            success=True,
            user=UserResponse(
                id=new_user.id,
                name=new_user.name,
                email=new_user.email,
                role=new_user.role
            )
        )
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already in use"
        )
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error"
        )

@router.post("/setup-platforms", response_model=PlatformSetupResponse)
def setup_platforms(request: PlatformSetup, db: Session = Depends(get_db)):
    print(f"Platform setup received: {request.dict()}")
    
    try:
        user_id = request.userId
        platform_data = request.platformData
        
        # Validate userId
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User ID is required"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update platform data
        platform_columns = ['whatsapp', 'linkedin_post', 'discord', 'slack', 'facebook', 'instagram', 'twitter', 'pdf']
        updated_fields = []
        
        for column in platform_columns:
            if platform_data and column in platform_data:
                setattr(user, column, platform_data[column])
                updated_fields.append(column)
        
        if not updated_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No platform data provided"
            )
        
        # Set timestamp
        user.platforms_setup_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        
        # Prepare response user data
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "platforms_setup_at": user.platforms_setup_at
        }
        
        # Add platform data to response
        for column in platform_columns:
            user_data[column] = getattr(user, column)
        
        return PlatformSetupResponse(
            success=True,
            message="Platform setup completed successfully",
            user=user_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Platform setup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error during platform setup"
        )

@router.get("/user-platforms/{user_id}", response_model=UserPlatformsResponse)
def get_user_platforms(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get platform data
        platform_columns = ['whatsapp', 'linkedin_post', 'discord', 'slack', 'facebook', 'instagram', 'twitter', 'pdf']
        active_platforms = {}
        
        for column in platform_columns:
            value = getattr(user, column)
            if value:  # Only include non-null values
                active_platforms[column] = value
        
        return UserPlatformsResponse(
            success=True,
            platforms=active_platforms,
            setupAt=user.platforms_setup_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get platforms error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error"
        )