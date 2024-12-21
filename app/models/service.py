from sqlalchemy import TEXT, Column, Integer, String, DECIMAL
from app.db.base import Base
from sqlalchemy.orm import relationship

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_category = Column(String(255), nullable=True)
    service_title = Column(String(255), nullable=False)
    service_price = Column(DECIMAL(10, 2), nullable=False)
    service_image = Column(TEXT, nullable=True)
    bookings = relationship("Booking", back_populates="service")

    def __repr__(self):
        return f"<Service(id={self.id}, category={self.service_category}, title={self.service_title}, price={self.service_price}, image={self.service_image})>"
