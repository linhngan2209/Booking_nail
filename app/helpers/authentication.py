from fastapi import Depends, HTTPException, Request
from app.core.jwt_token import verify_token

def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    token = token.split(" ")[1]  
    payload = verify_token(token, request)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload
