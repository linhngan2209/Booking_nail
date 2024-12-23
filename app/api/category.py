from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.services.category_service import CategoryService
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryInDB
from app.db.db import get_db
from app.helpers.authorization import role_required


router = APIRouter()

@router.post("/categories/", response_model=CategoryInDB)
@role_required("admin")
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    return CategoryService.create_category(db, category_data)

@router.get("/categories/{category_id}", response_model=CategoryInDB)
def get_category(category_id: int, db: Session = Depends(get_db),  ):
    return CategoryService.get_category(db, category_id)

@router.get("/categories/", response_model=List[CategoryInDB])
def list_categories(db: Session = Depends(get_db),  ):
    return CategoryService.list_categories(db)

@router.put("/categories/{category_id}", response_model=CategoryInDB)
@role_required("admin")
def update_category(category_id: int, updated_data: CategoryUpdate, db: Session = Depends(get_db),  ):
    return CategoryService.update_category(db, category_id, updated_data)

@router.delete("/categories/{category_id}")
@role_required("admin")
def delete_category(category_id: int, db: Session = Depends(get_db),  ):
    CategoryService.delete_category(db, category_id)
    return {"detail": f"Category with ID {category_id} deleted successfully"}

@router.get("/categories/services/", response_model=List[dict])
def get_all_categories_with_services(db: Session = Depends(get_db),  ):
    return CategoryService.get_all_categories_with_services(db)
