from pydantic import BaseModel
from typing import Optional, List

class CategoryBase(BaseModel):
    category_name: str
    description: Optional[str] = None
    category_image: Optional[str] = None  

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    description: Optional[str] = None
    category_image: Optional[str] = None

class ServiceInCategory(BaseModel):
    id: int
    service_title: str
    service_price: float
    service_image: Optional[str] = None

    class Config:
        from_attributes = True

class CategoryInDB(CategoryBase):
    id: int
    services: List[ServiceInCategory] = []
    class Config:
        from_attributes = True
