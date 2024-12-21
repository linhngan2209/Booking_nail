from app.db.base import Base
from app.db.db import engine
from fastapi import FastAPI
from app.api import booking, service, user
from app.api import staff
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)
Base.metadata.create_all(engine)

app.include_router(service.router, prefix="/api/v1")
app.include_router(staff.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")
app.include_router(booking.router, prefix="/api/v1")

