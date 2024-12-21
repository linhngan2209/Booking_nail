import os
from dotenv import load_dotenv
from datetime import timedelta, datetime
from fastapi import HTTPException, Request
import jwt

load_dotenv()
ALGORITHM = "HS256"

SECRET_KEY = os.getenv("SECRET_KEY")

def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token, request: Request):
    if token is None:
        raise HTTPException(status_code=401, detail='Token is missing')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None 
    except jwt.InvalidTokenError:
        return None  
