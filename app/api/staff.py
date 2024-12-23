from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from loguru import logger
from typing import List
from app.services.staff_service import StaffService
from app.db.db import get_db
from app.schemas.staff import StaffCreate, StaffResponse, StaffUpdate
from app.helpers.authorization import role_required
from app.helpers.authentication import get_current_user


router = APIRouter()

@router.get("/list-staff", response_model=List[StaffResponse])
def get_list_staff(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    staff_service = StaffService(db)
    staff_list = staff_service.get_list_staff()
    return staff_list

@router.get("/staff/{staff_id}", response_model=StaffResponse)
def get_staff_detail(staff_id: int, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    staff = staff_service.get_staff_by_id(staff_id)
    return staff

@router.post("/create-staff")
@role_required("admin")
def create_staff(new_staff: StaffCreate, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    res = staff_service.create_staff(new_staff)
    return res 

@router.put("/update-staff/{staff_id}", response_model=StaffResponse)
@role_required("admin")
def update_staff(staff_id: int, staff: StaffUpdate, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    updated_staff = staff_service.update_staff(staff_id=staff_id, staff_data=staff)
    logger.info(f"Updated staff with id {staff_id}.")
    return updated_staff

@router.delete("/delete-staff/{staff_id}")
@role_required("admin")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    staff_service.delete_staff(staff_id=staff_id)
    return {"message": "success"}
