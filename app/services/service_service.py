from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate
from loguru import logger
from typing import List, Optional

class ServiceService:
    def __init__(self, db: Session):
        self.db = db

    def create_service(self, service: ServiceCreate) -> Service:
        try:
            existing_service = self.db.query(Service).filter(Service.service_title == service.service_title).first()
            if existing_service:
                raise HTTPException(status_code=400, detail="Service already exists")
            
            new_service = Service(**service.model_dump())  
            logger.info(f"Created new service: {new_service}")
            self.db.add(new_service)
            self.db.commit()
            self.db.refresh(new_service)
            
            return new_service
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Error creating service: {e}")
            raise HTTPException(status_code=400, detail="Service creation failed")

    def get_service_by_id(self, service_id: int) -> Optional[Service]:
        service = self.db.query(Service).filter(Service.id == service_id).first()
        if not service:
            logger.warning(f"Service with id {service_id} not found")
            raise HTTPException(status_code=404, detail="Service not found")
        return service

    def get_list_services(self) -> List[Service]:

        service_list = self.db.query(Service).all()
        total_count = self.db.query(Service).count()
        return {
            "services": service_list,
            "total": total_count
        }

    def update_service(self, service_id: int, service_data: ServiceUpdate) -> Service:
        db_service = self.db.query(Service).filter(Service.id == service_id).first()
        if db_service is None:
            logger.warning(f"Service with id {service_id} not found")
            raise HTTPException(status_code=404, detail="Service not found")

        for field, value in service_data.dict(exclude_unset=True).items():
            setattr(db_service, field, value)
        
        self.db.commit()
        self.db.refresh(db_service)
        logger.info(f"Updated service {service_id}: {db_service.service_title}")
        return db_service

    def delete_service(self, service_id: int) -> None:
        db_service = self.db.query(Service).filter(Service.id == service_id).first()
        if db_service is None:
            logger.warning(f"Service with id {service_id} not found")
            raise HTTPException(status_code=404, detail="Service not found")

        self.db.delete(db_service)
        self.db.commit()
        logger.info(f"Deleted service with id {service_id}")
