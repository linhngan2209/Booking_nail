from fastapi import HTTPException, Request
from functools import wraps

def role_required(required_role: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get('request')
            user_role = request.session.get('role')  

            if not user_role:
                raise HTTPException(status_code=401, detail="User not authenticated")

            if user_role != required_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
                
            return await func(*args, **kwargs)
        return wrapper
    return decorator
