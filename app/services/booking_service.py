from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingCreateUser, BookingUpdate, BookingResponse
from loguru import logger
from sqlalchemy.orm import joinedload
from sqlalchemy import and_
from app.models.service import Service
from app.models.user import User
from app.models.staff import Staff
from datetime import datetime


class BookingService:
    def __init__(self, db: Session):
        self.db = db

    def get_booking_by_id(self, booking_id: int) -> BookingResponse:
        booking = self.db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            logger.warning(f"Booking with id {booking_id} not found")
            raise HTTPException(status_code=404, detail="Booking not found")
        return BookingResponse.from_orm(booking)


    def get_list_bookings(self) -> dict:
        bookings = self.db.query(Booking).join(User).join(Service).join(Staff).all()

        booking_responses = []
        for booking in bookings:
            booking_responses.append(BookingResponse(
                id=booking.id,
                customer_id=booking.customer_id,
                staff_id=booking.staff_id,
                service_id=booking.service_id,
                start_time=booking.start_time,
                description=booking.description,
                status=booking.status,
                total_bill=booking.total_bill,
                service_name=booking.service.service_title if booking.service else None,
                user_name=booking.customer.full_name if booking.customer else None,
                phone_number=booking.customer.phone_number if booking.customer else None,
                staff_name=booking.staff.staff_name if booking.staff else None,
                start_date=booking.start_time.strftime('%Y-%m-%d') if booking.start_time else None
            ))

        return booking_responses

    
    def create_booking(self, booking_data: BookingCreate) -> BookingResponse:
        service = self.db.query(Service).filter(Service.service_title == booking_data.service).first()
        if not service:
            raise HTTPException(status_code=404, detail=f"Service '{booking_data['service']}' not found")

        user = self.db.query(User).filter(User.full_name == booking_data.customer).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"User '{booking_data['customer']}' not found")

        staff = self.db.query(Staff).filter(Staff.staff_name == booking_data.staff).first()
        if not staff:
            raise HTTPException(status_code=404, detail=f"Staff '{booking_data['staff']}' not found")
        start_time = datetime.strptime(booking_data.start, '%d/%m/%Y').strftime('%Y-%m-%d')
        mapped_data = {
            "customer_id": user.id, 
            "staff_id": staff.id,  
            "service_id": service.id,
            "start_time": start_time,
            "total_bill": booking_data.total_bill,
            "description": ""
        }

        overlapping_booking = (
            self.db.query(Booking)
            .filter(
                Booking.staff_id == mapped_data["staff_id"],
                and_(
                    Booking.start_time <= mapped_data["start_time"],
                    Booking.end_time >= mapped_data["start_time"]
                )
            )
            .first()
        )

        if overlapping_booking:
            logger.warning(f"Staff with id {mapped_data['staff_id']} already has a booking at this time")
            raise HTTPException(status_code=400, detail="Staff is already booked at this time")

        db_booking = Booking(**mapped_data)
        self.db.add(db_booking)
        self.db.commit()
        self.db.refresh(db_booking)
        logger.info(f"Created booking with id {db_booking.id}")
        return db_booking
    
    def create_booking_user(self, booking_data: BookingCreateUser) -> BookingResponse:
        start_time = datetime.strptime(booking_data.start, '%I:%M %d/%m/%Y').strftime('%Y-%m-%d %H:%M:%S')
        mapped_data = {
            "customer_id": booking_data.customer_id, 
            "staff_id": booking_data.staff,  
            "service_id": booking_data.service,
            "start_time": start_time,
            "total_bill": booking_data.total_bill,
            "description": booking_data.description
        }

        overlapping_booking = (
            self.db.query(Booking)
            .filter(
                Booking.staff_id == mapped_data["staff_id"],
                and_(
                    Booking.start_time <= mapped_data["start_time"],
                    Booking.end_time >= mapped_data["start_time"]
                )
            )
            .first()
        )
        if overlapping_booking:
            logger.warning(f"Staff with id {mapped_data['staff_id']} already has a booking at this time")
            raise HTTPException(status_code=400, detail="Staff is already booked at this time")

        db_booking = Booking(**mapped_data)
        self.db.add(db_booking)
        self.db.commit()
        self.db.refresh(db_booking)
        logger.info(f"Created booking with id {db_booking.id}")
        return db_booking

    def update_booking(self, booking_id: int, booking_data: BookingUpdate) -> BookingResponse:
        db_booking = self.db.query(Booking).filter(Booking.id == booking_id).first()
        if not db_booking:
            logger.warning(f"Booking with id {booking_id} not found")
            raise HTTPException(status_code=404, detail="Booking not found")

        for field, value in booking_data.dict(exclude_unset=True).items():
            setattr(db_booking, field, value)

        self.db.commit()
        self.db.refresh(db_booking)
        logger.info(f"Updated booking {booking_id}")
        return BookingResponse.from_orm(db_booking)

    def delete_booking(self, booking_id: int) -> None:
        db_booking = self.db.query(Booking).filter(Booking.id == booking_id).first()
        if not db_booking:
            logger.warning(f"Booking with id {booking_id} not found")
            raise HTTPException(status_code=404, detail="Booking not found")

        self.db.delete(db_booking)
        self.db.commit()
        logger.info(f"Deleted booking with id {booking_id}")
