from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.jwt_token import verify_token

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.headers.get("Authorization")
        if token:
            try:
                token = token.split(" ")[1]
                payload = verify_token(token, request)
                request.state.user = payload  
            except HTTPException as e:
                raise e
        else:
            raise HTTPException(status_code=401, detail="Token is missing")
        response = await call_next(request)
        return response
