from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ServiceCreate(BaseModel):
    category_id: Optional[int] = None  
    service_title: str = Field(..., max_length=255)  
    service_price: Decimal  
    service_image: Optional[str] = None  

    class Config:
        from_attributes = True


class ServiceUpdate(BaseModel):
    category_id: Optional[int] = None  
    service_title: Optional[str] = Field(None, max_length=255)  
    service_price: Optional[Decimal] = None 
    service_image: Optional[str] = None  

    class Config:
        from_attributes = True


class ServiceResponse(BaseModel):
    id: int  
    category_id: Optional[int]  
    service_title: str  
    service_price: Decimal  
    service_image: Optional[str]  

    class Config:
        from_attributes = True
