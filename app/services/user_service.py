from datetime import timedelta
from fastapi import HTTPException, Response
from sqlalchemy.orm import Session
from app.core.jwt_token import create_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.core.security import hash_password, verify_password
from loguru import logger
from app.models.booking import Booking
from app.models.service import Service

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> UserResponse:
        
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise Exception("Email already exists")
        
        hashed_password = hash_password(user_data.password)
        user_data_dict = user_data.model_dump()
        user_data_dict.pop("password", None)  
        new_user = User(**user_data_dict, password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return {"message": 'success'}

    def login_user(self, user: UserLogin):
        existing_user = self.db.query(User).filter(User.email == user.email).first()
        if not existing_user:
            raise HTTPException(status_code=404, detail="Account not found")

        if not verify_password(user.password, existing_user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")

        expires_delta = timedelta(hours=1)
        token_data = {"user_id": existing_user.id, "email": existing_user.email}
        token = create_token(token_data, expires_delta)

        response_data = {
            "access_token": token,
            "user": {
                "user_id": existing_user.id,
                "email": existing_user.email,
                "name": existing_user.full_name,
                "role": existing_user.role
            },
            "message": "Successful"
        }
        return response_data

    
    def get_booking_by_user_id(self, user_id: int):
        bookings = (
            self.db.query(Booking.id, Booking.start_time, Booking.end_time, 
                          Booking.status, Booking.description, Booking.total_bill, 
                          Service.service_title.label("service_title"))
            .join(Service, Service.id == Booking.service_id)  
            .filter(Booking.customer_id == user_id)  
            .all()
        )

        booking_data = [
            {
                "id": booking.id,
                "service_title": booking.service_title,
                "start_time": booking.start_time,
                "end_time": booking.end_time,
                "status": booking.status,
                "description": booking.description,
                "total_bill": booking.total_bill,
            }
            for booking in bookings
        ]

        return booking_data