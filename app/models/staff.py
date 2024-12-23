from sqlalchemy import Column, Integer, String, TIMESTAMP, TEXT, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import func
from app.db.base import Base
from app.models.staff_service_association import staff_service_association



class Staff(Base):
    __tablename__ = "staffs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    staff_name = Column(String(100), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    start_date = Column(TIMESTAMP, default=func.now())
    staff_image = Column(TEXT, nullable=True)
    
    services = relationship("Service", secondary=staff_service_association, back_populates="staffs")
    
    bookings = relationship("Booking", back_populates="staff")

    def __repr__(self):
        return f"<Staff(id={self.id}, staff_name={self.staff_name}, phone_number={self.phone_number}, start_date={self.start_date}, services={self.services})>"
