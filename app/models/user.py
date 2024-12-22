from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from app.db.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)
    role = Column(Enum("customer","admin", "manager" ,name="user_roles"), default="customer")
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    bookings = relationship("Booking", back_populates="customer")
    def __repr__(self):
        return f"<User(id={self.id}, full_name='{self.full_name}', email='{self.email}', role='{self.role}')>"
