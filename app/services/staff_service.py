from fastapi import Response
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
                logger.error(f"Phone number {staff.phone_number} already exists")
                return Response(content="Phone number already exists", status_code=400)
            
            new_staff = Staff(**staff.model_dump())  
            logger.info(f"Created new staff: {new_staff}")
            self.db.add(new_staff)
            self.db.commit()
            self.db.refresh(new_staff)
            return new_staff
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Error creating staff: {e}")
            return Response(content="Phone number already exists", status_code=400)

    def get_staff_by_id(self, staff_id: int) -> Optional[Staff]:
        staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            logger.error(f"Staff with id {staff_id} not found")
            return Response(content="Staff not found", status_code=404)
        return staff

    def get_list_staff(self, skip: int = 0, limit: int = 10) -> List[Staff]:
        staff_list = self.db.query(Staff).offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(staff_list)} staff members")
        return staff_list

    def update_staff(self, staff_id: int, staff_data: StaffUpdate) -> Staff:
        db_staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if db_staff is None:
            logger.error(f"Staff with id {staff_id} not found")
            return Response(content="Staff not found", status_code=404)

        for field, value in staff_data.dict(exclude_unset=True).items():
            setattr(db_staff, field, value)
        
        self.db.commit()
        self.db.refresh(db_staff)
        logger.info(f"Updated staff {staff_id}: {db_staff.staff_name}")
        return db_staff

    def delete_staff(self, staff_id: int) -> None:
        db_staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
        if db_staff is None:
            logger.error(f"Staff with id {staff_id} not found")
            return Response(content="Staff not found", status_code=404)

        self.db.delete(db_staff)
        self.db.commit()
        logger.info(f"Deleted staff with id {staff_id}")
        return Response(content="Staff deleted successfully", status_code=200)
