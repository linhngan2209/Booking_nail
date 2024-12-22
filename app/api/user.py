from email import message
from venv import logger
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.db.db import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post("/register")
def create_user(new_user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    res = user_service.create_user(new_user)
    return res

@router.post("/login", response_model=None)  
def login(user: UserLogin, request: Request, db: Session = Depends(get_db)):
    user_service = UserService(db)
    res = user_service.login_user(user)
    logger.warning(f'{res}')
    if res:
        request.session['role'] = res.role
    return res

@router.get("/user/{user_id}")
def get_user_tracking(user_id: int, db: Session = Depends(get_db)):
    user_service = UserService(db)
    res = user_service.get_booking_by_user_id(user_id)
    return res

@router.get("/logout")
async def logout(request: Request):
    request.session.clear()  
    return {"message" : "success"}