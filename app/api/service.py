from fastapi import APIRouter, Depends
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.services.service_service import ServiceService
from sqlalchemy.orm import Session
from app.db.db import get_db
from loguru import logger
from app.helpers.authorization import role_required


router = APIRouter()

@router.post("/create-service/", response_model=ServiceResponse)
@role_required("admin")
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    service_service = ServiceService(db)
    return service_service.create_service(service)

@router.get("/list-services/")
def get_list_service(db: Session = Depends(get_db),  ):
    service_service = ServiceService(db)
    return service_service.get_list_services()

@router.get("/service/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db),  ):
    service_service = ServiceService(db)
    return service_service.get_service_by_id(service_id)

@router.put("/update-service/{service_id}", response_model=ServiceResponse)
@role_required("admin")
def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    service_service = ServiceService(db)
    return service_service.update_service(service_id, service)

@router.delete("/delete-service/{service_id}")
@role_required("admin")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service_service = ServiceService(db)
    service_service.delete_service(service_id)
    return {"detail": "Service deleted successfully"}
