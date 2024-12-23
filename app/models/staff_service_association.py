from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.base import Base

staff_service_association = Table(
    'staff_service_association', Base.metadata,
    Column('staff_id', Integer, ForeignKey('staffs.id'), primary_key=True),
    Column('service_id', Integer, ForeignKey('services.id'), primary_key=True)
)