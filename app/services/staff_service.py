from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate
from loguru import logger
from typing import List, Optional


class StaffService:
    def __init__(self, db: Session):
        self.db = db

    def create_staff(self, staff: StaffCreate) -> Staff:
        try:
        
            existing_staff = self.db.query(Staff).filter(Staff.phone_number == staff.phone_number).first()
            if existing_staff:
                raise HTTPException(status_code=400, detail="Phone number already exists")
            
            new_staff = Staff(**staff.model_dump())  
            logger.info(f"Created new staff: {new_staff}")
            self.db.add(new_staff)
            self.db.commit()
            self.db.refresh(new_staff)
           
            return new_staff
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Error creating staff: {e}")
            raise HTTPException(status_code=400, detail="Phone number already exists")

    def get_staff_by_id(self, staff_id: int) -> Optional[Staff]:
        staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            logger.warning(f"Staff with id {staff_id} not found")
            raise HTTPException(status_code=404, detail="Staff not found")
        return staff

    def get_list_staff(self, skip: int = 0, limit: int = 10) -> List[Staff]:
        staff_list = self.db.query(Staff).offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(staff_list)} staff members")
        return staff_list

    def update_staff(self, staff_id: int, staff_data: StaffUpdate) -> Staff:
        db_staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if db_staff is None:
            logger.warning(f"Staff with id {staff_id} not found")
            raise HTTPException(status_code=404, detail="Staff not found")

        # Cập nhật các trường nếu có giá trị mới
        for field, value in staff_data.dict(exclude_unset=True).items():
            setattr(db_staff, field, value)
        
        self.db.commit()
        self.db.refresh(db_staff)
        logger.info(f"Updated staff {staff_id}: {db_staff.staff_name}")
        return db_staff

    def delete_staff(self, staff_id: int) -> None:
        db_staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if db_staff is None:
            logger.warning(f"Staff with id {staff_id} not found")
            raise HTTPException(status_code=404, detail="Staff not found")

        self.db.delete(db_staff)
        self.db.commit()
        logger.info(f"Deleted staff with id {staff_id}")
