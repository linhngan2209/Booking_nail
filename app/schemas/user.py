from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str = Field(..., max_length=100)
    email: EmailStr
    phone_number: str = Field(..., max_length=15)
    password: str = Field(..., min_length=6)
    role: Optional[str] = Field("customer")

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = Field("customer")


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=15)
    password: Optional[str] = Field(None, min_length=6)
    role: Optional[str] = Field(None)

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
