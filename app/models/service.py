from sqlalchemy import TEXT, Column, Integer, String, DECIMAL, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship
from app.models.staff_service_association import staff_service_association

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    service_title = Column(String(255), nullable=False)
    service_price = Column(DECIMAL(10, 2), nullable=False)
    service_image = Column(TEXT, nullable=True)
    bookings = relationship("Booking", back_populates="service")

    staffs = relationship("Staff", secondary=staff_service_association, back_populates="services")

    category = relationship("Category", back_populates="services")

    def __repr__(self):
        return f"<Service(id={self.id}, category_id={self.category_id}, title={self.service_title}, price={self.service_price}, image={self.service_image})>"