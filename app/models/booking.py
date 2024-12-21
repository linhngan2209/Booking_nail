from sqlalchemy import FLOAT, TEXT, Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from app.db.base import Base


class Status(enum.Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"

class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    staff_id = Column(Integer, ForeignKey("staffs.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(Enum(Status), default=Status.pending)
    description = Column(TEXT, nullable=True)
    total_bill = Column(FLOAT)

    customer = relationship("User", back_populates="bookings")
    staff = relationship("Staff", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
