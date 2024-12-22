from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    customer: Optional[str] = None
    staff: str  
    service: str 
    start: str 
    phone: Optional[str] = None  
    total_bill: float
    description: Optional[str] = None

    class Config:
        from_attributes = True

class BookingCreateUser(BaseModel):
    customer_id: int
    staff: int
    service: int
    description: str
    total_bill: float
    start: str
    
class Config:
        from_attributes = True

class BookingUpdate(BaseModel):
    customer_id: Optional[int] = None  
    staff_id: Optional[int] = None  
    service_id: Optional[int] = None  
    start_time: Optional[datetime] = None  
    description: Optional[str] = None  
    status: Optional[str] = None 
    total_bill: float

    class Config:
        from_attributes = True  


class BookingResponse(BaseModel):
    id: int
    customer_id: int
    staff_id: int
    service_id: int
    start_time: datetime
    description: Optional[str] = None
    status: str
    total_bill: float
    service_name: Optional[str] = None  
    user_name: Optional[str] = None  
    phone_number: Optional[str] = None  
    staff_name: Optional[str] = None  
    start_date: Optional[str] = None  
    class Config:
        from_attributes = True  
