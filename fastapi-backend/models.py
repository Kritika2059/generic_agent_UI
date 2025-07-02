from sqlalchemy import Column, String, Integer, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users_auth"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    
    # Platform fields - all optional
    whatsapp = Column(String, nullable=True)
    linkedin_post = Column(String, nullable=True)
    discord = Column(String, nullable=True)
    slack = Column(String, nullable=True)
    facebook = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    pdf = Column(String, nullable=True)
    
    platforms_setup_at = Column(DateTime, nullable=True)