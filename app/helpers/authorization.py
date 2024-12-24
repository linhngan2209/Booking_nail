from fastapi import HTTPException, Request, Response
from functools import wraps
from loguru import logger

def role_required(required_role: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get('request')
            user_role = request.session.get('role') 

            if not user_role:
                logger.error("User not authenticated")
                return Response(content="User not authenticated", status_code=401)

            if user_role != required_role:
                logger.error("Insufficient permissions")
                return Response(content="Insufficient permissions", status_code=403)

            return await func(*args, **kwargs) 
        return wrapper
    return decorator
