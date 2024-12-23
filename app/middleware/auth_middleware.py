from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.jwt_token import verify_token
from loguru import logger

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_routes = ["/api/v1/login", "/api/v1/register", "/docs", "/redoc", "/openapi.json"]
        
        if request.url.path in public_routes:
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token:
            logger.error("Token is missing")
            raise HTTPException(status_code=401, detail="Token is missing")
        
        try:
            token = token.split(" ")[1]
            payload = verify_token(token, request)
            request.state.user = payload  
        except HTTPException as e:
            logger.error(f"Token verification failed: {e.detail}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

        response = await call_next(request)
        return response
