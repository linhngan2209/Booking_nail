from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ServiceCreate(BaseModel):
    service_category: Optional[str] = None  
    service_title: str = Field(..., max_length=255)  
    service_price: Decimal  
    service_image: Optional[str] = None  

    class Config:
        from_attributes = True
        from_attributes=True    


class ServiceUpdate(BaseModel):
    service_category: Optional[str] = None 
    service_title: Optional[str] = Field(None, max_length=255)  
    service_price: Optional[Decimal] = None 
    service_image: Optional[str] = None  

    class Config:
        from_attributes = True


class ServiceResponse(BaseModel):
    id: int  
    service_category: Optional[str]  
    service_title: str  
    service_price: Decimal  
    service_image: Optional[str]  

    class Config:
        from_attributes = True
        from_attributes=True   
