import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL không được xác định trong biến môi trường")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db  
    finally:
        db.close()  

try:
    with engine.connect() as connection:
        print("Kết nối thành công đến cơ sở dữ liệu!")
except Exception as e:
    print(f"Có lỗi xảy ra: {e}")
