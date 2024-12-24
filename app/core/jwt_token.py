import os
from dotenv import load_dotenv
from datetime import timedelta, datetime
from fastapi import HTTPException, Request
import jwt
from loguru import logger

load_dotenv()
ALGORITHM = "HS256"

SECRET_KEY = os.getenv("SECRET_KEY")

def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, request: Request):
    if not token:
        logger.error("Token is missing")
        return None 
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        return None  
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        return None  
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {e}")
        return None  

