from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func, TEXT
from sqlalchemy.ext.declarative import declarative_base
from app.db.base import Base
from sqlalchemy.orm import relationship


class Staff(Base):
    __tablename__ = "staffs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    staff_name = Column(String(100), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    start_date = Column(TIMESTAMP,  default=func.now())
    staff_image = Column(TEXT, nullable=True)
    bookings = relationship("Booking", back_populates="staff")

    def __repr__(self):
        return f"<Staff(id={self.id}, staff_name={self.staff_name}, phone_number={self.phone_number}, start_date={self.start_date})>"

    