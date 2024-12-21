from ast import Str
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StaffCreate(BaseModel):
    staff_name: str = Field(..., max_length=100)  
    phone_number: str = Field(..., max_length=15)  
    start_date: str
    staff_image: Optional[str] = None

    class Config:
        from_attributes = True
        from_attributes=True 


class StaffUpdate(BaseModel):
    staff_name: Optional[str] = Field(None, max_length=100)  
    phone_number: Optional[str] = Field(None, max_length=15)  
    start_date: Optional[datetime] = None 
    staff_image: Optional[str] = None

    class Config:
        from_attributes = True
        from_attributes=True 


class StaffResponse(BaseModel):
    id: int  
    staff_name: str 
    phone_number: str  
    start_date: datetime  
    staff_image: Optional[str] = None

    class Config:
        from_attributes = True
        from_attributes=True  
