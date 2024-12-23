from sqlalchemy import Column, Integer, String, TEXT
from app.db.base import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), nullable=False, unique=True)
    description = Column(TEXT, nullable=True)
    category_image = Column(TEXT, nullable=True)

    services = relationship("Service", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name}, description={self.description})>"
