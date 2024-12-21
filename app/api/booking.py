from fastapi import APIRouter, Depends, Request
from app.schemas.booking import BookingCreate, BookingCreateUser, BookingUpdate, BookingResponse
from app.services.booking_service import BookingService
from sqlalchemy.orm import Session
from app.db.db import get_db
from loguru import logger

router = APIRouter()

@router.post("/create-booking/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    booking_service = BookingService(db)
    return booking_service.create_booking(booking)

@router.post("/create-booking-user/", response_model=BookingResponse)
def create_booking_user(booking: BookingCreateUser,db: Session = Depends(get_db) ):
    logger.warning(booking)
    booking_service = BookingService(db)
    return booking_service.create_booking_user(booking)

@router.get("/list-bookings/")
def get_list_bookings(db: Session = Depends(get_db)):
    booking_service = BookingService(db)
    return booking_service.get_list_bookings()

@router.get("/booking/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking_service = BookingService(db)
    return booking_service.get_booking_by_id(booking_id)

@router.put("/update-booking/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, booking: BookingUpdate, db: Session = Depends(get_db)):
    booking_service = BookingService(db)
    return booking_service.update_booking(booking_id, booking)

@router.delete("/delete-booking/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking_service = BookingService(db)
    booking_service.delete_booking(booking_id)
    return {"detail": "Booking deleted successfully"}
